const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const DBConnection = require("./src/utils/DbConnection");

app.use(express.json());
app.use(cors());

const userRoutes = require("./src/routes/userRoutes");
app.use("/user", userRoutes);

const bookingRoutes = require("./src/routes/bookingRoutes");
app.use("/booking", bookingRoutes);

const pgRoutes = require("./src/routes/PgRouter");
app.use("/pg", pgRoutes);

const reviewRoutes = require("./src/routes/ReviewRoutes");
app.use("/review", reviewRoutes);

const PaymentRoutes = require("./src/routes/PaymentRoutes");
app.use("/payment", PaymentRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await DBConnection();

    app.listen(PORT, () => {
      console.log(`server started at Port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
