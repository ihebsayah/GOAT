const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Manager = require("../models/managerModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const manager = await Manager.find();
  res.status(200).json(manager);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      FullName,
      Age,
      Nationality,
      CurrentClub,
      League,
      YearsOfExperience,
      WinPercentage,
      TotalMatchesManaged,
      TrophiesWon,
      PreferredFormation,
      AttackingStyle,
      DefensiveStyle,
      ContractExpiryDate,
      PreviousClubsManaged,
      SalaryAnnualEUR,
      FIFAManagerRating,
    } = req.body;
    if (
      !email ||
      !password ||
      !FullName ||
      !Age ||
      !Nationality ||
      !CurrentClub ||
      !League ||
      !YearsOfExperience ||
      !WinPercentage ||
      !TotalMatchesManaged ||
      !TrophiesWon ||
      !PreferredFormation ||
      !AttackingStyle ||
      !DefensiveStyle ||
      !ContractExpiryDate ||
      !PreviousClubsManaged ||
      !SalaryAnnualEUR ||
      !FIFAManagerRating
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Manager.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const manager = await Manager.create({
      email,
      password: hashPassword,
      FullName,
      Age,
      Nationality,
      CurrentClub,
      League,
      YearsOfExperience,
      WinPercentage,
      TotalMatchesManaged,
      TrophiesWon,
      PreferredFormation,
      AttackingStyle,
      DefensiveStyle,
      ContractExpiryDate,
      PreviousClubsManaged,
      SalaryAnnualEUR,
      FIFAManagerRating,
    });

    res.status(200).json({ _id: manager.id, email: manager.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const manager = await Manager.findById(req.params.id);
  if (!manager) {
    res.status(404);
    throw new Error("Manager not found");
  }
  res.status(200).json(manager);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const manager = await Manager.findOne({ email });
  //compare password with hashedpassword
  if (manager && (await bcrypt.compare(password, manager.password))) {
    const accessToken = jwt.sign(
      {
        manager: {
          email: manager.email,
          id: manager.id,
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
  res.status(200).json(req.manager);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.manager.id;
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
  const manager = await Manager.findById(req.params.id);
  if (!manager) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Manager.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const manager = await Manager.findById(req.params.id);
  console.log(manager);
  if (!manager) {
    res.status(404);
    throw new Error("manager not found");
  }

  await Manager.findByIdAndDelete(req.params.id);
  res.status(200).json(manager);
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
