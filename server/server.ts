import express from "express";
import "dotenv/config";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());




app.get("/", (req, res) => {
    res.send("server is running");
});
const port = process.env.PORT ?? 8000

app.listen(port, () => {
  console.log("Server is running on http://localhost:"+port);
});