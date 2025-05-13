import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import duckRouter from "./routes/ducks";
import mongoose from "mongoose";
import userRouter from "./routes/user";
import bodyParser from "body-parser";
import cloudinaryConfig from "./config/cloudinaryConfiguration";
import commentRouter from "./routes/comments";

dotenv.config();
cloudinaryConfig();

const DBConnection = () => {
  if (process.env.MONGO_URI) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connection to Mongo DB established"))
      .catch((err) => console.log(err));
  } else {
    throw new Error("you forgot the MongoDB connection string");
  }
};
DBConnection();
const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// routes
app.use("/api/ducks", duckRouter);
app.use("/api/user", userRouter);
app.use("/api/comments", commentRouter);

// app.get("/", (req, res) => {
//   res.send("server is running");
// });
// app.get("/api", duckRouter);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
