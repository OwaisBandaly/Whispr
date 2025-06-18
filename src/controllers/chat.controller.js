import { generateStreamToken } from "../config/stream.config.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = generateStreamToken(req.user._id);

    res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json("Error in getStreamToken", error.message);
  }
};
