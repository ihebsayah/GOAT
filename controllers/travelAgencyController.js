const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TravelAgency = require("../models/travelAgencyModel");
const axios = require("axios");

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const travelAgency = await TravelAgency.find();
  res.status(200).json(travelAgency);
});

//Create user

const createUser = async (req, res) => {
  try {
    console.log(req.body);

    const {
      email,
      password,
      AgencyName,
      HeadquartersLocation,
      ListOfClubsServed,
      ListOfPlayersServed,
      FederationsAndAssociationsWorkedWith,
      PartnerAirlinesAndHotels,
      NumberOfTeamsManagedPerYear,
      SportsEventTravelPackages,
      CollaboratedClubs,
    } = req.body;
    if (
      !email ||
      !password ||
      !AgencyName ||
      !HeadquartersLocation ||
      !ListOfClubsServed ||
      !ListOfPlayersServed ||
      !FederationsAndAssociationsWorkedWith ||
      !PartnerAirlinesAndHotels ||
      !NumberOfTeamsManagedPerYear ||
      !SportsEventTravelPackages ||
      !CollaboratedClubs
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const userAvailable = await TravelAgency.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User exists already");
    }

    //hash password--
    const hashPassword = await bcrypt.hash(password, 10);

    const travelAgency = await TravelAgency.create({
      email,
      password: hashPassword,
      AgencyName,
      HeadquartersLocation,
      ListOfClubsServed,
      ListOfPlayersServed,
      FederationsAndAssociationsWorkedWith,
      PartnerAirlinesAndHotels,
      NumberOfTeamsManagedPerYear,
      SportsEventTravelPackages,
      CollaboratedClubs,
    });

    res.status(200).json({ _id: travelAgency.id, email: travelAgency.email });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//get User By Id------------

const getUser = asyncHandler(async (req, res) => {
  const travelAgency = await TravelAgency.findById(req.params.id);
  if (!travelAgency) {
    res.status(404);
    throw new Error("TravelAgency not found");
  }
  res.status(200).json(travelAgency);
});

///--------LOGIN USER------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const travelAgency = await TravelAgency.findOne({ email });
  //compare password with hashedpassword
  if (travelAgency && (await bcrypt.compare(password, travelAgency.password))) {
    const accessToken = jwt.sign(
      {
        travelAgency: {
          email: travelAgency.email,
          id: travelAgency.id,
          AgencyName: travelAgency.AgencyName,
          HeadquartersLocation: travelAgency.HeadquartersLocation,
          ListOfClubsServed: travelAgency.ListOfClubsServed,
          ListOfPlayersServed: travelAgency.ListOfPlayersServed,
          FederationsAndAssociationsWorkedWith:
            travelAgency.FederationsAndAssociationsWorkedWith,
          PartnerAirlinesAndHotels: travelAgency.PartnerAirlinesAndHotels,
          NumberOfTeamsManagedPerYear: travelAgency.NumberOfTeamsManagedPerYear,
          SportsEventTravelPackages: travelAgency.SportsEventTravelPackages,
          CollaboratedClubs: travelAgency.CollaboratedClubs,
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
  res.status(200).json(req.travelAgency.id);
});

//recommendation system

const recommendationSystem = asyncHandler(async (req, res) => {
  const id_col = req.travelAgency.id;
  console.log(id_col);
  if (!id_col) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  const response = await axios.post("http://127.0.0.1:5001//recommend", {
    _id: id_col,
  });

  console.log(response.data);

  res.json(response.data);
});

//UPDATE USER----
const updateUser = asyncHandler(async (req, res) => {
  const travelAgency = await TravelAgency.findById(req.params.id);
  if (!travelAgency) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updatedUser = await TravelAgency.findByIdAndUpdate(
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
  const travelAgency = await TravelAgency.findById(req.params.id);

  if (!travelAgency) {
    res.status(404);
    throw new Error("TravelAgency not found");
  }

  await TravelAgency.findByIdAndDelete(req.params.id);
  res.status(200).json(travelAgency);
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
