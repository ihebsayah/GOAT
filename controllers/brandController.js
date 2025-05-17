const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Brand = require("../models/brandModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const brand = await Brand.find();
  res.status(200).json(brand);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      Brand,
      sponsoredClub,
      AnnualRevenueUSD,
      ContractDuration,
    } = req.body;
    if (
      !email ||
      !password ||
      !name ||
      !sponsoredClub ||
      !AnnualRevenueUSD ||
      !ContractDuration
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Brand.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const brand = await Brand.create({
      email,
      password: hashPassword,
      Brand,
      sponsoredClub,
      AnnualRevenueUSD,
      ContractDuration,
    });

    res.status(200).json({ _id: brand.id, email: brand.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(brand);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const brand = await Brand.findOne({ email });
  //compare password with hashedpassword
  if (brand && (await bcrypt.compare(password, brand.password))) {
    const accessToken = jwt.sign(
      {
        brand: {
          email: brand.email,
          id: brand.id,
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
  res.status(200).json(req.brand);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.brand.id;
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
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  console.log(brand);
  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  await Brand.findByIdAndDelete(req.params.id);
  res.status(200).json(brand);
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
