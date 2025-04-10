import mongoose from "mongoose";

const duckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    },
    image: {
        type: String,
        required: true,
    }
});
const Duck = mongoose.model("Duck", duckSchema);
export default Duck;