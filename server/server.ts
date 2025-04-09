import express from "express";
import "dotenv/config";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/ducks.ts"; //need o be fixed
import mongoose from "mongoose";

dotenv.config();


mongoose
  .connect(process.env.MONGO_URI || "mongodb") //need to change tmr continue epic 8
  .then(() => console.log("Connection to Mongo DB established"))
  .catch((err) => console.log(err));


const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use("/ducks", router);




app.get("/", (req, res) => {
    res.send("server is running");
});
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log("Server is running on http://localhost:"+port);
});