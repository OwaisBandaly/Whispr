import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) console.error("Dev: Api key or secret missing");

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    return userData;
  } catch (error) {
    console.error("Error upserting stream user.");
  }
};

export const generateStreamToken = (userId) => {
  try {
    return streamClient.createToken(userId?.toString());
  } catch (error) {
    console.log("Error generating stream token", error);
  }
};
