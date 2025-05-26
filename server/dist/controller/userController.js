"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfilePicture = exports.login = exports.register = exports.getCurrentUser = exports.getUserById = exports.users = void 0;
const usersModel_1 = __importDefault(require("../model/usersModel"));
const auth_1 = require("../lib/auth");
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
const cloudinaryDelete_1 = require("../utils/cloudinaryDelete");
const users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield usersModel_1.default.find({}).select("-password");
        res.status(200).json({ success: true, users: users });
    }
    catch (error) {
        console.log("Quack! Error in fetching users:", error);
        res.status(500).json({
            success: false,
            message: "The ducks got confused and couldn't fetch the users. Try again later!",
        });
    }
});
exports.users = users;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(404).json({ success: false, message: "Invalid user ID" });
            return;
        }
        const user = yield usersModel_1.default.findById(id).select("-password");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.log("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getUserById = getUserById;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const user = yield usersModel_1.default.findById(req.user._id)
            .select("-password")
            .populate("likedDucks");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            _id: user._id,
            username: user.username,
            email: user.email,
            likedDucks: user.likedDucks || [],
        });
    }
    catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getCurrentUser = getCurrentUser;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV !== "production") {
        console.log("Request body:", req.body);
    }
    try {
        const { username, email, password } = req.body;
        // Validate input fields
        if (!username || username.trim() === "") {
            res.status(400).json({
                success: false,
                message: "Username is required quck quack",
            });
            return;
        }
        if (!email || email.trim() === "") {
            res.status(400).json({
                success: false,
                message: "duckmail is required",
            });
            return;
        }
        if (!password || password.trim() === "") {
            res.status(400).json({
                success: false,
                message: "duckword is required",
            });
            return;
        }
        // Check for existing user by username or email
        const emailExists = yield usersModel_1.default.findOne({ email });
        if (emailExists) {
            res.status(400).json({
                message: "Quack! This email is already in our pond. Try another one!",
            });
            return;
        }
        // Then check for username
        const usernameExists = yield usersModel_1.default.findOne({ username });
        if (usernameExists) {
            res.status(400).json({
                message: "Quack! This username is already taken by another duck in our pond!",
            });
            return;
        }
        // Validators
        if (password.length < 6) {
            res.status(400).json({
                message: "Quack! Your duckword is too short - it needs at least 6 characters to keep your nest safe!",
            });
            return;
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            res.status(400).json({
                message: "Quack! Your username can only contain letters, numbers, and underscores - no funny duck symbols allowed!",
            });
            return;
        }
        if (username.length < 3 || username.length > 12) {
            res.status(400).json({
                message: "Quack! Your username must be between 3-12 characters - not too short, not too long, just ducky!",
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                message: "Quack! That doesn't look like a proper duckmail address!",
            });
            return;
        }
        const hashedPassword = yield (0, auth_1.encryptPassword)(password);
        const user = new usersModel_1.default({
            username,
            email,
            password: hashedPassword,
        });
        yield user.save();
        const userId = user._id.toString();
        const token = (0, auth_1.generateToken)(userId, user.email, user.username);
        res.status(201).json({
            message: "Quack-tastic! You've successfully joined our duck pond!",
            token,
            user: {
                id: user._id,
                username,
                email,
            },
        });
    }
    catch (error) {
        console.error("Quack! Registration error:", error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV !== "production") {
        console.log("Request body:", req.body);
    }
    try {
        const { login, password } = req.body;
        // validation
        if (!login || login.trim() === "") {
            res.status(400).json({
                success: false,
                message: "duckmail or username is required",
            });
            return;
        }
        if (!password || password.trim() === "") {
            res.status(400).json({
                success: false,
                message: "duckword is required",
            });
            return;
        }
        // Determine if login is email or username
        const isEmail = login.includes("@");
        const query = isEmail ? { email: login } : { username: login };
        const user = yield usersModel_1.default.findOne(query).select("+password");
        if (!user) {
            res.status(401).json({
                message: isEmail
                    ? "Quack! No duck found with that email in our pond!"
                    : "Quack! No duck found with that username in our pond!",
            });
            return;
        }
        const isMatch = yield (0, auth_1.verifyPassword)(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                message: "Quack! Wrong duckword - are you sure you're the right duck?",
            });
            return;
        }
        const userId = user._id.toString();
        const token = (0, auth_1.generateToken)(userId, user.email, user.username);
        res.status(200).json({
            message: "Quack! Welcome back to the pond!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Quack! Login error:", error);
        if (error instanceof mongoose_1.default.Error) {
            res.status(400).json({
                message: "Quack! There's something wrong with your request!",
            });
            return;
        }
        res.status(500).json({
            message: "Oh no! The ducks got their feathers in a twist. Try again later!",
        });
    }
});
exports.login = login;
const updateProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Verify the user is updating their own profile
        if (!req.user || req.user._id.toString() !== id) {
            res.status(403).json({ success: false, message: "Not authorized" });
            return;
        }
        const user = yield usersModel_1.default.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        // Initialize update object
        const updates = {};
        // Handle bio update
        if (req.body.bio !== undefined) {
            updates.bio = req.body.bio;
        }
        // Handle image update if new file was uploaded
        if (req.file) {
            // Upload new image
            const { secure_url, public_id } = yield (0, cloudinaryUpload_1.pictureUpload)(req.file.path, "profile-pictures");
            // Delete old image if it exists
            if (user.profilePicturePublicId) {
                yield (0, cloudinaryDelete_1.pictureDelete)(user.profilePicturePublicId);
            }
            // Update image fields
            updates.profilePicture = secure_url;
            updates.profilePicturePublicId = public_id;
            // Clean up temp file
            fs_1.default.unlinkSync(req.file.path);
        }
        // Apply updates
        const updatedUser = yield usersModel_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        });
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                bio: updatedUser.bio,
                createdAt: updatedUser.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server Error",
        });
    }
});
exports.updateProfilePicture = updateProfilePicture;
