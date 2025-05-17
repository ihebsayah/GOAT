const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Player = require("../models/playerModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const player = await Player.find();
  res.status(200).json(player);
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
      height_cm,
      weight_kgs,
      value_euro,
      international_reputation,
      body_type,
      release_clause_euro,
      heading_accuracy,
      acceleration,
      sprint_speed,
      reactions,
      aggression,
      interceptions,
      vision,
      penalties,
      composure,
      marking,
      standing_tackle,
      age_group,
      performance_score,
      skill_index,
      physicality_index,
      position_group,
    } = req.body;
    if (
      !email ||
      !password ||
      !name ||
      !age ||
      !height_cm ||
      !weight_kgs ||
      !value_euro ||
      !international_reputation ||
      !body_type ||
      !release_clause_euro ||
      !heading_accuracy ||
      !acceleration ||
      !sprint_speed ||
      !reactions ||
      !aggression ||
      !interceptions ||
      !vision ||
      !penalties ||
      !composure ||
      !marking ||
      !standing_tackle ||
      !age_group ||
      !performance_score ||
      !skill_index ||
      !physicality_index ||
      !position_group
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Player.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const player = await Player.create({
      email,
      password: hashPassword,
      name,
      age,
      height_cm,
      weight_kgs,
      value_euro,
      international_reputation,
      body_type,
      release_clause_euro,
      heading_accuracy,
      acceleration,
      sprint_speed,
      reactions,
      aggression,
      interceptions,
      vision,
      penalties,
      composure,
      marking,
      standing_tackle,
      age_group,
      performance_score,
      skill_index,
      physicality_index,
      position_group,
    });

    res.status(200).json({ _id: player.id, email: player.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) {
    res.status(404);
    throw new Error("Player not found");
  }
  res.status(200).json(player);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const player = await Player.findOne({ email });
  //compare password with hashedpassword
  if (player && (await bcrypt.compare(password, player.password))) {
    const accessToken = jwt.sign(
      {
        player: {
          email: player.email,
          id: player.id,
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
  res.status(200).json(req.player);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.player.id;
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
  const player = await Player.findById(req.params.id);
  if (!player) {
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
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error("Player not found");
  }

  await Player.findByIdAndDelete(req.params.id);
  res.status(200).json(player);
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
