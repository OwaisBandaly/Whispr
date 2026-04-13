import { generateStreamToken } from "../config/stream.config.js";
import { recordAppError, recordChatEvent } from "../monitoring/metrics.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = generateStreamToken(req.user._id);
    recordChatEvent("stream_token_issued");

    res.status(200).json({ token });
  } catch (error) {
    recordAppError("get_stream_token");
    return res.status(500).json("Error in getStreamToken", error.message);
  }
};
