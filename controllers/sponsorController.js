const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sponsor = require("../models/sponsorModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const sponsor = await Player.find();
  res.status(200).json(sponsor);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      name,
      type,
      industry,
      budget,
      reputationScore,
      marketingSupport,
      contractDuration,
      region,
      previousSponsorships,
      productRelevance,
    } = req.body;
    if (
      !email ||
      !password ||
      !name ||
      !type ||
      !industry ||
      !budget ||
      !reputationScore ||
      !marketingSupport ||
      !contractDuration ||
      !region ||
      !previousSponsorships ||
      !productRelevance
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Sponsor.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const sponsor = await Player.create({
      email,
      password: hashPassword,
      name,
      type,
      industry,
      budget,
      reputationScore,
      marketingSupport,
      contractDuration,
      region,
      previousSponsorships,
      productRelevance,
    });

    res.status(200).json({ _id: sponsor.id, email: sponsor.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const sponsor = await Player.findById(req.params.id);
  if (!sponsor) {
    res.status(404);
    throw new Error("Player not found");
  }
  res.status(200).json(sponsor);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const sponsor = await Player.findOne({ email });
  //compare password with hashedpassword
  if (sponsor && (await bcrypt.compare(password, sponsor.password))) {
    const accessToken = jwt.sign(
      {
        sponsor: {
          email: sponsor.email,
          id: sponsor.id,
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
  res.status(200).json(req.sponsor);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.sponsor.id;
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
  const sponsor = await Player.findById(req.params.id);
  if (!sponsor) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Player.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const sponsor = await Player.findById(req.params.id);

  if (!sponsor) {
    res.status(404);
    throw new Error("Player not found");
  }

  await Player.findByIdAndDelete(req.params.id);
  res.status(200).json(sponsor);
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
