const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const MarketingAgency = require("../models/marketingAgency");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const marketingAgency = await MarketingAgency.find();
  res.status(200).json(marketingAgency);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      AgencyName,
      Location,
      Industry,
      ClientName,
      Website,
      Email,
      PhoneNumber,
      CEOName,
      FoundedYear,
      EmployeesCount,
      SocialMediaPresence,
      ServicesOffered,
      AnnualRevenueUSD,
      NumberOfCampaignsRun,
      CustomerSatisfactionRating,
      AwardsWon,
      Specialization,
      ClientType,
      KeyFocusArea,
      MonthlyMarketingBudgetUSD,
      KeyIndustriesServed,
    } = req.body;
    if (
      !email ||
      !password ||
      !AgencyName ||
      !Location ||
      !Industry ||
      !ClientName ||
      !Website ||
      !Email ||
      !PhoneNumber ||
      !CEOName ||
      !FoundedYear ||
      !EmployeesCount ||
      !SocialMediaPresence ||
      !ServicesOffered ||
      !AnnualRevenueUSD ||
      !NumberOfCampaignsRun ||
      !CustomerSatisfactionRating ||
      !AwardsWon ||
      !Specialization ||
      !ClientType ||
      !KeyFocusArea ||
      !MonthlyMarketingBudgetUSD ||
      !KeyIndustriesServed
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await MarketingAgency.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const marketingAgency = await MarketingAgency.create({
      email,
      password: hashPassword,
      AgencyName,
      Location,
      Industry,
      ClientName,
      Website,
      Email,
      PhoneNumber,
      CEOName,
      FoundedYear,
      EmployeesCount,
      SocialMediaPresence,
      ServicesOffered,
      AnnualRevenueUSD,
      NumberOfCampaignsRun,
      CustomerSatisfactionRating,
      AwardsWon,
      Specialization,
      ClientType,
      KeyFocusArea,
      MonthlyMarketingBudgetUSD,
      KeyIndustriesServed,
    });

    res
      .status(200)
      .json({ _id: marketingAgency.id, email: marketingAgency.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const marketingAgency = await MarketingAgency.findById(req.params.id);
  if (!marketingAgency) {
    res.status(404);
    throw new Error("Marketing agency not found");
  }
  res.status(200).json(marketingAgency);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const marketingAgency = await MarketingAgency.findOne({ email });
  //compare password with hashedpassword
  if (
    marketingAgency &&
    (await bcrypt.compare(password, marketingAgency.password))
  ) {
    const accessToken = jwt.sign(
      {
        marketingAgency: {
          email: marketingAgency.email,
          id: marketingAgency.id,
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
  res.status(200).json(req.marketingAgency);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.marketingAgency.id;
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
  const marketingAgency = await MarketingAgency.findById(req.params.id);
  if (!marketingAgency) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await MarketingAgency.findByIdAndUpdate(
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
  const marketingAgency = await MarketingAgency.findById(req.params.id);
  console.log(marketingAgency);
  if (!marketingAgency) {
    res.status(404);
    throw new Error("marketing Agency not found");
  }

  await MarketingAgency.findByIdAndDelete(req.params.id);
  res.status(200).json(marketingAgency);
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
