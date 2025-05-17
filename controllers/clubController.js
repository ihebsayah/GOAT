const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Club = require("../models/clubModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const club = await Club.find();
  res.status(200).json(club);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      ClubName,
      StadiumCapacity,
      NetWorthEUR,
      YouthAcademyRating,
      TransferBudgetEUR,
      ManagerialStability,
      PlayingStyle,
      InjuryRecords,
      FanBaseSize,
      Rank,
    } = req.body;
    if (
      !email ||
      !password ||
      !ClubName ||
      !StadiumCapacity ||
      !NetWorthEUR ||
      !YouthAcademyRating ||
      !TransferBudgetEUR ||
      !ManagerialStability ||
      !PlayingStyle ||
      !InjuryRecords ||
      !FanBaseSize ||
      !Rank
    ) {
      res.status(400);
      console.log("hello");
      throw new Error("All fields are required");
    }

    const userAvailable = await Club.findOne({ email });
    if (userAvailable) {
      console.log("hello");
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const club = await Club.create({
      email,
      password: hashPassword,
      ClubName,
      StadiumCapacity,
      NetWorthEUR,
      YouthAcademyRating,
      TransferBudgetEUR,
      ManagerialStability,
      PlayingStyle,
      InjuryRecords,
      FanBaseSize,
      Rank,
    });

    res.status(200).json({ _id: club.id, email: club.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(club);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const club = await Club.findOne({ email });
  //compare password with hashedpassword
  if (club && (await bcrypt.compare(password, club.password))) {
    const accessToken = jwt.sign(
      {
        club: {
          email: club.email,
          id: club.id,
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
  res.status(200).json(req.club);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.club.id;
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
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Club.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  console.log(club);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  await Club.findByIdAndDelete(req.params.id);
  res.status(200).json(club);
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
