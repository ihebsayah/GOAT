const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Supplier = require("../models/supplierModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const supplier = await Supplier.find();
  res.status(200).json(supplier);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      supplierName,
      productRange,
      brandReputation,
      deliveryAndLogistics,
      productQuality,
      eCommerceAndDistribution,
      customizationAndPersonalization,
      sponsorshipAndPartnershipDeals,
      pricingAndDiscounts,
      collaboratedClubs,
    } = req.body;
    if (
      !email ||
      !password ||
      !supplierName ||
      !productRange ||
      !brandReputation ||
      !deliveryAndLogistics ||
      !productQuality ||
      !eCommerceAndDistribution ||
      !customizationAndPersonalization ||
      !sponsorshipAndPartnershipDeals ||
      !pricingAndDiscounts ||
      !collaboratedClubs
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Supplier.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const supplier = await Supplier.create({
      email,
      password: hashPassword,
      supplierName,
      productRange,
      brandReputation,
      deliveryAndLogistics,
      productQuality,
      eCommerceAndDistribution,
      customizationAndPersonalization,
      sponsorshipAndPartnershipDeals,
      pricingAndDiscounts,
      collaboratedClubs,
    });

    res.status(200).json({ _id: supplier.id, email: supplier.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }
  res.status(200).json(supplier);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const supplier = await Supplier.findOne({ email });
  //compare password with hashedpassword
  if (supplier && (await bcrypt.compare(password, supplier.password))) {
    const accessToken = jwt.sign(
      {
        supplier: {
          email: supplier.email,
          id: supplier.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//CURRENT USER----
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.supplier);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.agency.id;
  if (!userId) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  const response = await axios.post("http://127.0.0.1:5001//recommend", {
    user_id: userId,
  });

  res.json(response.data); // Transmet les recommandations au frontend
});

//UPDATE USER----
const updateUser = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Supplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  await Supplier.findByIdAndDelete(req.params.id);
  res.status(200).json(supplier);
});

module.exports = {
  createUser,
  currentUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  recommendationSystem,
};
