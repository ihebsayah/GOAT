const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Agent = require("../models/agentModel");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const agent = await Agent.find();
  res.status(200).json(agent);
});

//Create user

const createAgentUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      Name,
      AgencyName,
      ContactInformation,
      Location,
      YearsOfExperience,
      Specialization,
      PlayersRepresented,
      NumberOfDealsClosed,
      TotalTransferValue,
      TargetPlayers,
      CommissionStructure,
      FeedbackRating,
    } = req.body;
    if (
      !email ||
      !password ||
      !Name ||
      !AgencyName ||
      !ContactInformation ||
      !Location ||
      !YearsOfExperience ||
      !Specialization ||
      !PlayersRepresented ||
      !NumberOfDealsClosed ||
      !TotalTransferValue ||
      !TargetPlayers ||
      !CommissionStructure ||
      !FeedbackRating
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await Agent.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const agent = await Agent.create({
      email,
      password: hashPassword,
      Name,
      AgencyName,
      ContactInformation,
      Location,
      YearsOfExperience,
      Specialization,
      PlayersRepresented,
      NumberOfDealsClosed,
      TotalTransferValue,
      TargetPlayers,
      CommissionStructure,
      FeedbackRating,
    });

    res.status(200).json({ _id: agent.id, email: agent.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(agent);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const agent = await Agent.findOne({ email });
  //compare password with hashedpassword
  if (agent && (await bcrypt.compare(password, agent.password))) {
    const accessToken = jwt.sign(
      {
        agent: {
          email: agent.email,
          id: agent.id,
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
  res.status(200).json(req.agent);
});

//RECOMMENDATION SYSTEM
const recommendationSystem = asyncHandler(async (req, res) => {
  const userId = req.agent.id;
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
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await Agent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

//DELETE-----
const deleteUser = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  console.log(agent);
  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }

  await Agent.findByIdAndDelete(req.params.id);
  res.status(200).json(agent);
});

module.exports = {
  createAgentUser,
  currentUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  recommendationSystem,
};
