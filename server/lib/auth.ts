import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("No JWT secret");
}

// Bcrypt function (password hashing & comparison)
export const encryptPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.log("Error: ", error);
  }
};

// JWT functions (token generation & verification)
export const generateToken = (userId: string, userEmail: string) => {
  const payload = {
    sub: userId,
    email: userEmail,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
