const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Agency = require("../models/agencyModel");

//getAllUsers
const getAllAgencyUsers = asyncHandler(async (req, res) => {
  const agency = await Agency.find();
  res.status(200).json(agency);
});

//Create user

const createAgencyUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      AgencyName,
      ContactInformation,
      Location,
      YearsInOperation,
      ServicesOffered,
      ClientsRepresented,
      NumberOfDealsClosed,
      TotalContractValue,
      TargetClients,
      FeeStructure,
      ClientSatisfactionRate,
    } = req.body;
    if (
      !email ||
      !password ||
      !AgencyName ||
      !ContactInformation ||
      !Location ||
      !YearsInOperation ||
      !ServicesOffered ||
      !ClientsRepresented ||
      !NumberOfDealsClosed ||
      !TotalContractValue ||
      !TargetClients ||
      !FeeStructure ||
      !ClientSatisfactionRate
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Agency.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const agency = await Agency.create({
      email,
      password: hashPassword,
      AgencyName,
      ContactInformation,
      Location,
      YearsInOperation,
      ServicesOffered,
      ClientsRepresented,
      NumberOfDealsClosed,
      TotalContractValue,
      TargetClients,
      FeeStructure,
      ClientSatisfactionRate,
    });

    res.status(200).json({ _id: agency.id, email: agency.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);
  if (!agency) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(agency);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const agency = await Agency.findOne({ email });
  //compare password with hashedpassword
  if (agency && (await bcrypt.compare(password, agency.password))) {
    const accessToken = jwt.sign(
      {
        agency: {
          email: agency.email,
          id: agency.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("username or password is not valid");
  }
});

//CURRENT USER----
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.agency);
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

// Implement your recommendation logic here
// For example, you can use machine learning algorithms or collaborative filtering

//UPDATE USER----
const updateUser = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);
  if (!agency) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Agency.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);
  console.log(agency);
  if (!agency) {
    res.status(404);
    throw new Error("Agency not found");
  }

  await Agency.findByIdAndDelete(req.params.id);
  res.status(200).json(agency);
});

module.exports = {
  createAgencyUser,
  currentUser,
  loginUser,
  getAllAgencyUsers,
  updateUser,
  deleteUser,
  getUser,
  recommendationSystem,
};
