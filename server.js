const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./utility/logger')
require("./db/conn")
const bodyParser = require("body-parser");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const adminRoute = require('./routes/adminRoute');
app.use(bodyParser.json());
const Route = express.Router();

app.use(cors());
app.use("/uploads",express.static('uploads'));

// Routes
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);







const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});