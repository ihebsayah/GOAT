const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Gym = require("../models/gymModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const gym = await Gym.find();
  res.status(200).json(gym);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      GymName,
      Location,
      GymType,
      MembershipCapacity,
      RegisteredPlayers,
      CoachesAndTrainers,
      EquipmentProvided,
      AffiliatedClubs,
      CollaboratedClubs,
      MembershipFees,
      ContactInfo,
      FacilitySize,
      AdditionalServices,
    } = req.body;
    if (
      !email ||
      !password ||
      !GymName ||
      !Location ||
      !GymType ||
      !MembershipCapacity ||
      !RegisteredPlayers ||
      !CoachesAndTrainers ||
      !EquipmentProvided ||
      !AffiliatedClubs ||
      !CollaboratedClubs ||
      !MembershipFees ||
      !ContactInfo ||
      !FacilitySize ||
      !AdditionalServices
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Gym.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const gym = await Gym.create({
      email,
      password: hashPassword,
      GymName,
      Location,
      GymType,
      MembershipCapacity,
      RegisteredPlayers,
      CoachesAndTrainers,
      EquipmentProvided,
      AffiliatedClubs,
      CollaboratedClubs,
      MembershipFees,
      ContactInfo,
      FacilitySize,
      AdditionalServices,
    });

    res.status(200).json({ _id: gym.id, email: gym.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id);
  if (!gym) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(gym);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const gym = await Gym.findOne({ email });
  //compare password with hashedpassword
  if (gym && (await bcrypt.compare(password, gym.password))) {
    const accessToken = jwt.sign(
      {
        gym: {
          email: gym.email,
          id: gym.id,
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
  res.status(200).json(req.gym);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.gym.id;
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
  const gym = await Gym.findById(req.params.id);
  if (!gym) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Gym.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id);
  console.log(gym);
  if (!gym) {
    res.status(404);
    throw new Error("Gym not found");
  }

  await Gym.findByIdAndDelete(req.params.id);
  res.status(200).json(gym);
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
