const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ServiceProvider = require("../models/serviceProviderModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const serviceProvider = await ServiceProvider.find();
  res.status(200).json(serviceProvider);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      ProviderName,
      ServiceType,
      Location,
      YearsInOperation,
      ClientPortfolio,
      Accreditations,
      ServiceCapacity,
      PricingModel,
      TechnologyUtilized,
      PerformanceMetrics,
      ComplianceStandards,
      ContactInformation,
      Availability,
      Testimonials,
    } = req.body;
    if (
      !email ||
      !password ||
      !ProviderName ||
      !ServiceType ||
      !Location ||
      !YearsInOperation ||
      !ClientPortfolio ||
      !Accreditations ||
      !ServiceCapacity ||
      !PricingModel ||
      !TechnologyUtilized ||
      !PerformanceMetrics ||
      !ComplianceStandards ||
      !ContactInformation ||
      !Availability ||
      !Testimonials
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await ServieceProvider.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const serviceProvider = await ServieceProvider.create({
      email,
      password: hashPassword,
      ProviderName,
      ServiceType,
      Location,
      YearsInOperation,
      ClientPortfolio,
      Accreditations,
      ServiceCapacity,
      PricingModel,
      TechnologyUtilized,
      PerformanceMetrics,
      ComplianceStandards,
      ContactInformation,
      Availability,
      Testimonials,
    });

    res
      .status(200)
      .json({ _id: serviceProvider.id, email: serviceProvider.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const serviceProvider = await ServieceProvider.findById(req.params.id);
  if (!serviceProvider) {
    res.status(404);
    throw new Error("ServieceProvider not found");
  }
  res.status(200).json(serviceProvider);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const serviceProvider = await ServieceProvider.findOne({ email });
  //compare password with hashedpassword
  if (
    serviceProvider &&
    (await bcrypt.compare(password, serviceProvider.password))
  ) {
    const accessToken = jwt.sign(
      {
        serviceProvider: {
          email: serviceProvider.email,
          id: serviceProvider.id,
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
  res.status(200).json(req.serviceProvider);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.serviceProvider.id;
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
  const serviceProvider = await ServieceProvider.findById(req.params.id);
  if (!serviceProvider) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await ServieceProvider.findByIdAndUpdate(
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
  const serviceProvider = await ServieceProvider.findById(req.params.id);

  if (!serviceProvider) {
    res.status(404);
    throw new Error("ServieceProvider not found");
  }

  await ServieceProvider.findByIdAndDelete(req.params.id);
  res.status(200).json(serviceProvider);
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
