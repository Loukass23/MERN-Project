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
exports.pictureDelete = void 0;
const cloudinary_1 = require("cloudinary");
const pictureDelete = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedImage = yield cloudinary_1.v2.uploader.destroy(public_id);
        console.log("deletedImage :>> ", deletedImage);
        return deletedImage;
    }
    catch (error) {
        console.error(`Error deleting image from Cloudinary: ${error}`);
        throw error;
    }
});
exports.pictureDelete = pictureDelete;
