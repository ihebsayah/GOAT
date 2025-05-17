const express = require("express");
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

connectDb();
const app = express();
app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use("/api/user/agency", require("./routes/agencyRoute"));
app.use("/api/user/agent", require("./routes/agentRoute"));
app.use("/api/user/brand", require("./routes/brandRoute"));
app.use("/api/user/club", require("./routes/clubRoute"));
app.use("/api/user/fan", require("./routes/fanRoute"));
app.use("/api/user/gym", require("./routes/gymRoute"));
app.use("/api/user/manager", require("./routes/managerRoute"));
app.use("/api/user/marketingAgency", require("./routes/marketingAgencyRoute"));
app.use("/api/user/player", require("./routes/playerRoute"));
app.use("/api/user/serviceProvider", require("./routes/serviceProvideRoute"));
app.use("/api/user/sponsor", require("./routes/sponsorRoute"));
app.use("/api/user/supplier", require("./routes/supplierRoute"));
app.use("/api/user/travelAgency", require("./routes/travelAgencyRoute"));

const port = process.env.PORT || 5050;
app.listen(5050, () => {
  console.log(`Server running on port ${port}`);
});
