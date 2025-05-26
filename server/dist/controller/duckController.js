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
exports.checkUserLikes = exports.getUserLikedDucks = exports.unlikeDuck = exports.likeDuck = exports.deleteDuck = exports.updateDuck = exports.createDuck = exports.getDuckById = exports.ducks = exports.getDuckOptions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ducksModel_1 = __importDefault(require("../model/ducksModel"));
const usersModel_1 = __importDefault(require("../model/usersModel"));
const fs_1 = __importDefault(require("fs"));
const duckOptions_1 = require("../constants/duckOptions");
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
const cloudinaryDelete_1 = require("../utils/cloudinaryDelete");
const getDuckOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            success: true,
            options: {
                breeds: duckOptions_1.DUCK_BREEDS,
                moods: duckOptions_1.DUCK_MOODS,
                genders: duckOptions_1.DUCK_GENDERS,
            },
        });
        return;
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
    return;
});
exports.getDuckOptions = getDuckOptions;
const ducks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters
        const { sort = "-uploadedAt", breed, gender, isRubberDuck, uploadedBy, page = 1, limit = 12, } = req.query;
        // Build the filter object
        const filter = {};
        // If user select filter in the query => adds to search.
        if (breed)
            filter.breed = breed;
        if (gender)
            filter.gender = gender;
        if (isRubberDuck)
            filter.isRubberDuck = isRubberDuck === "true";
        if (uploadedBy)
            filter.uploadedBy = uploadedBy;
        // Convert page and limit to numbers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Get total count of ducks who match filter (for pagination info)
        const totalDucks = yield ducksModel_1.default.countDocuments(filter);
        // Fetch ducks with filters, sorting, and pagination
        const ducks = yield ducksModel_1.default.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);
        res.status(200).json({
            success: true,
            ducks,
            pagination: {
                totalDucks,
                totalPages: Math.ceil(totalDucks / limitNum),
                currentPage: pageNum,
                ducksPerPage: limitNum,
                hasNextPage: pageNum * limitNum < totalDucks,
                hasPreviousPage: pageNum > 1,
            },
        });
    }
    catch (error) {
        console.error("Error fetching ducks:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.ducks = ducks;
const getDuckById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(404).json({ success: false, message: "Invalid duck ID" });
            return;
        }
        const duck = yield ducksModel_1.default.findById(id);
        if (!duck) {
            res.status(404).json({ success: false, message: "Duck not found" });
            return;
        }
        res.status(200).json({ success: true, duck });
    }
    catch (error) {
        console.error("Error fetching duck:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getDuckById = getDuckById;
const createDuck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
    }
    if (!req.file) {
        res.status(400).json({ success: false, message: "No image provided" });
        return;
    }
    const duckData = req.body;
    const tempFilePath = req.file.path;
    // Validate required fields
    const errors = [];
    if (!((_a = duckData.name) === null || _a === void 0 ? void 0 : _a.trim())) {
        errors.push("Name is a required field");
    }
    if (!duckData.gender || !duckOptions_1.DUCK_GENDERS.includes(duckData.gender)) {
        errors.push(`You need to select a valid gender. Options: ${duckOptions_1.DUCK_GENDERS.join(", ")}`);
    }
    if (!duckData.breed || !duckOptions_1.DUCK_BREEDS.includes(duckData.breed)) {
        errors.push(`You need to select a valid breed. Options: ${duckOptions_1.DUCK_BREEDS.join(", ")}`);
    }
    if (errors.length > 0) {
        // Clean up temp file if validation fails
        fs_1.default.unlink(tempFilePath, (err) => {
            if (err)
                console.error("Error deleting temp file:", err);
        });
        res.status(400).json({
            success: false,
            message: errors.join(". "),
        });
        return;
    }
    try {
        // First upload to Cloudinary
        const { secure_url, public_id } = yield (0, cloudinaryUpload_1.pictureUpload)(tempFilePath, "ducks");
        // Create new duck with the actual image data
        const duck = new ducksModel_1.default(Object.assign(Object.assign({}, duckData), { image: secure_url, imagePublicId: public_id, likes: 0, likedBy: [], uploadedAt: new Date(), uploadedBy: req.user._id, isRubberDuck: duckData.isRubberDuck || false, description: duckData.description || "" }));
        yield duck.save();
        // Clean up temp file
        fs_1.default.unlink(tempFilePath, (err) => {
            if (err)
                console.error("Error deleting temp file:", err);
        });
        res.status(201).json({ success: true, duck });
    }
    catch (error) {
        console.error("Error creating duck:", error);
        // Clean up temp file in case of error
        if (tempFilePath) {
            fs_1.default.unlink(tempFilePath, (err) => {
                if (err)
                    console.error("Error deleting temp file:", err);
            });
        }
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const messages = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                message: messages.join(". "),
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server Error",
        });
    }
});
exports.createDuck = createDuck;
const updateDuck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const tempFilePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path; // Store for cleanup
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Invalid duck ID" });
        return;
    }
    try {
        const duck = yield ducksModel_1.default.findById(id);
        if (!duck) {
            res.status(404).json({ success: false, message: "Duck not found" });
            return;
        }
        // Ownership check
        if (!duck.uploadedBy ||
            ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString()) !== duck.uploadedBy.toString()) {
            res.status(403).json({
                success: false,
                message: "Not authorized to modify this duck",
            });
            return;
        }
        // First validate all data before any Cloudinary operations
        if (req.body.name)
            duck.name = req.body.name;
        if (req.body.gender)
            duck.gender = req.body.gender;
        if (req.body.breed)
            duck.breed = req.body.breed;
        if (req.body.description !== undefined)
            duck.description = req.body.description;
        if (req.body.isRubberDuck !== undefined) {
            duck.isRubberDuck = req.body.isRubberDuck === "true";
        }
        // Validate before any Cloudinary operations
        yield duck.validate();
        // Handle image update only after validation passes
        if (req.file) {
            // Upload new image to Cloudinary
            const { secure_url, public_id } = yield (0, cloudinaryUpload_1.pictureUpload)(tempFilePath, "ducks");
            // Delete old image from Cloudinary if it exists
            if (duck.imagePublicId) {
                try {
                    yield (0, cloudinaryDelete_1.pictureDelete)(duck.imagePublicId);
                }
                catch (err) {
                    console.warn("Failed to delete old image from Cloudinary:", err);
                }
            }
            // Update duck with new image
            duck.image = secure_url;
            duck.imagePublicId = public_id;
            // Delete local temp file
            fs_1.default.unlink(tempFilePath, (err) => {
                if (err)
                    console.error("Error deleting temp file:", err);
            });
        }
        // Save changes
        yield duck.save();
        res.status(200).json({ success: true, duck });
    }
    catch (error) {
        console.error("Error updating duck:", error);
        // Cleanup temp file in case of error
        if (tempFilePath) {
            fs_1.default.unlink(tempFilePath, (err) => {
                if (err)
                    console.error("Error deleting temp file:", err);
            });
        }
        // Handle validation errors specifically
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const messages = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                message: messages.join(". "),
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server Error",
        });
    }
});
exports.updateDuck = updateDuck;
const deleteDuck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Invalid duck ID" });
        return;
    }
    try {
        const duck = yield ducksModel_1.default.findById(id);
        if (!duck) {
            res.status(404).json({ success: false, message: "Duck not found" });
            return;
        }
        // Ownership check
        if (!duck.uploadedBy ||
            ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) !== duck.uploadedBy.toString()) {
            res.status(403).json({
                success: false,
                message: "Not authorized to delete this duck",
            });
            return;
        }
        // Delete image from Cloudinary if it exists
        if (duck.imagePublicId) {
            yield (0, cloudinaryDelete_1.pictureDelete)(duck.imagePublicId);
        }
        // Cleans up all user references to this duck
        yield duck.deleteOne();
        yield usersModel_1.default.updateMany({ likedDucks: id }, { $pull: { likedDucks: id } });
        // $pull removes all duck id from the array
        res.status(200).json({
            success: true,
            message: "Duck deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting duck:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.deleteDuck = deleteDuck;
const likeDuck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
    }
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Invalid duck ID" });
        return;
    }
    try {
        const duck = yield ducksModel_1.default.findById(id);
        if (!duck) {
            res.status(404).json({ success: false, message: "Duck not found" });
            return;
        }
        // check to prevent liking own duck
        if (duck.uploadedBy &&
            duck.uploadedBy.toString() === req.user._id.toString()) {
            res.status(400).json({
                success: false,
                message: "You can't like your own duck",
            });
            return;
        }
        // Check if user already liked this duck
        const userAlreadyLiked = duck.likedBy.some((userId) => userId.toString() === req.user._id.toString());
        if (userAlreadyLiked) {
            res.status(400).json({
                success: false,
                message: "You already liked this duck",
            });
            return;
        }
        // Update duck
        const updatedDuck = yield ducksModel_1.default.findByIdAndUpdate(id, {
            $inc: { likes: 1 },
            $push: { likedBy: req.user._id },
        }, { new: true });
        // Update user's liked ducks
        yield usersModel_1.default.findByIdAndUpdate(req.user._id, {
            $addToSet: { likedDucks: id },
        });
        res.status(200).json({
            success: true,
            likes: updatedDuck === null || updatedDuck === void 0 ? void 0 : updatedDuck.likes,
            liked: true,
        });
        return;
    }
    catch (error) {
        console.log("Error liking duck:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
});
exports.likeDuck = likeDuck;
const unlikeDuck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
    }
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Invalid duck ID" });
        return;
    }
    try {
        const duck = yield ducksModel_1.default.findById(id);
        if (!duck) {
            res.status(404).json({ success: false, message: "Duck not found" });
            return;
        }
        // Check if user hasn't liked this duck
        const userAlreadyLiked = duck.likedBy.some((userId) => userId.toString() === req.user._id.toString());
        if (!userAlreadyLiked) {
            res.status(400).json({
                success: false,
                message: "You haven't liked this duck yet",
            });
            return;
        }
        // Update duck
        const updatedDuck = yield ducksModel_1.default.findByIdAndUpdate(id, {
            $inc: { likes: -1 },
            $pull: { likedBy: req.user._id },
        }, { new: true });
        // Update user's liked ducks
        yield usersModel_1.default.findByIdAndUpdate(req.user._id, { $pull: { likedDucks: id } });
        res.status(200).json({
            success: true,
            likes: updatedDuck === null || updatedDuck === void 0 ? void 0 : updatedDuck.likes,
            liked: false,
        });
        return;
    }
    catch (error) {
        console.log("Error unliking duck:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
});
exports.unlikeDuck = unlikeDuck;
const getUserLikedDucks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if user is logged in
    if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
    }
    // Find user and populate their likedDucks
    try {
        const user = yield usersModel_1.default.findById(req.user._id).populate("likedDucks");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        // Return the populated likedDucks array - frontend gets complete duck objects
        res.status(200).json({ success: true, likedDucks: user.likedDucks });
        return;
    }
    catch (error) {
        console.log("Error fetching liked ducks:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
});
exports.getUserLikedDucks = getUserLikedDucks;
const checkUserLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
    }
    // Extract duckIds from request body (array of duck IDs)
    const { duckIds } = req.body;
    if (!Array.isArray(duckIds)) {
        res.status(400).json({
            success: false,
            message: "duckIds should be an array",
        });
        return;
    }
    // find user
    try {
        const user = yield usersModel_1.default.findById(req.user._id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        // Map through requested duckIds to check which ones are liked
        const likedStatus = duckIds.map((duckId) => ({
            duckId,
            // Check if this duckId exists in user's likedDucks array
            liked: user.likedDucks.some((id) => id.toString() === duckId),
        }));
        res.status(200).json({ success: true, likedStatus });
        return;
    }
    catch (error) {
        console.log("Error checking user likes:", error);
        res.status(500).json({ success: false, message: "Server Error" });
        return;
    }
});
exports.checkUserLikes = checkUserLikes;
