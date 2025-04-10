import mongoose from "mongoose";

type DuckType = {
  id: number;
  name: string;
  image: string;
};

const duckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
const Duck = mongoose.model<DuckType>("Duck", duckSchema);
export default Duck;
