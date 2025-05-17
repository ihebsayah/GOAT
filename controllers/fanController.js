const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Fan = require("../models/fanModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const fan = await Fan.find();
  res.status(200).json(fan);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      name,
      age,
      gender,
      location,
      favouriteTeam,
      favouritePlayer,
    } = req.body;
    if (
      !email ||
      !password ||
      !name ||
      !age ||
      !gender ||
      !location ||
      !favouriteTeam ||
      !favouritePlayer
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Fan.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const fan = await Fan.create({
      email,
      password: hashPassword,
      name,
      age,
      gender,
      location,
      favouriteTeam,
      favouritePlayer,
    });

    res.status(200).json({ _id: fan.id, email: fan.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const fan = await Fan.findById(req.params.id);
  if (!fan) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(fan);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const fan = await Fan.findOne({ email });
  //compare password with hashedpassword
  if (fan && (await bcrypt.compare(password, fan.password))) {
    const accessToken = jwt.sign(
      {
        fan: {
          email: fan.email,
          id: fan.id,
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
  res.status(200).json(req.fan);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.fan.id;
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
  const fan = await Fan.findById(req.params.id);
  if (!fan) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Fan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const fan = await Fan.findById(req.params.id);
  console.log(fan);
  if (!fan) {
    res.status(404);
    throw new Error("Club not found");
  }

  await Fan.findByIdAndDelete(req.params.id);
  res.status(200).json(fan);
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
