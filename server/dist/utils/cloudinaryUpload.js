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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pictureUpload = void 0;
const cloudinary_1 = require("cloudinary");
const pictureUpload = (filePath_1, ...args_1) => __awaiter(void 0, [filePath_1, ...args_1], void 0, function* (filePath, folder = "ducks-app") {
    try {
        const uploadedImage = yield cloudinary_1.v2.uploader.upload(filePath, {
            folder,
            resource_type: "auto",
        });
        return {
            secure_url: uploadedImage.secure_url,
            public_id: uploadedImage.public_id,
        };
    }
    catch (error) {
        console.error(`Error uploading image to Cloudinary: ${error}`);
        throw error;
    }
});
exports.pictureUpload = pictureUpload;
