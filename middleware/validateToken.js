const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }

      req.travelAgency = decoded.travelAgency;
      req.supplier = decoded.supplier;
      req.sponsor = decoded.sponsor;
      req.serviceProvider = decoded.serviceProvider;
      req.player = decoded.player;
      req.agency = decoded.agency;
      req.agent = decoded.agent;
      req.brand = decoded.brand;
      req.club = decoded.club;
      req.manager = decoded.manager;
      req.marketingAgency = decoded.marketingAgency;
      req.fan = decoded.fan;
      req.gyn = decoded.gyn;

      next();
    });
  }
});

module.exports = validateToken;
