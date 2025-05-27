"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const ducks_1 = __importDefault(require("./routes/ducks"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const body_parser_1 = __importDefault(require("body-parser"));
const cloudinaryConfiguration_1 = __importDefault(require("./config/cloudinaryConfiguration"));
const comments_1 = __importDefault(require("./routes/comments"));
dotenv_1.default.config();
(0, cloudinaryConfiguration_1.default)();
const DBConnection = () => {
    if (process.env.MONGO_URI) {
        mongoose_1.default
            .connect(process.env.MONGO_URI)
            .then(() => console.log("Connection to Mongo DB established"))
            .catch((err) => console.log(err));
    }
    else {
        throw new Error("you forgot the MongoDB connection string");
    }
};
DBConnection();
const app = (0, express_1.default)();
// middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
// routes //
app.use("/api/ducks", ducks_1.default);
app.use("/api/user", user_1.default);
app.use("/api/comments", comments_1.default);
// app.get("/", (req, res) => {
//   res.send("server is running");
// });
// app.get("/api", duckRouter);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port);
});
