const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");

const connectMongoDB = require("./config/db");
const logger = require("./config/logger");

const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");

const errorHandler = require("./middleware/errorHandler");

const upload = multer({ dest: "uploads/" });

const app = express();

const PORT = process.env.PORT;

// MongoDB
connectMongoDB();
console.log("mongodb connected");

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Security
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: "http://localhost:8001",
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Morgan
app.use(
  morgan("dev", {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  }),
);

// Routes
app.use("/", authRoutes);
app.use("/files", fileRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
