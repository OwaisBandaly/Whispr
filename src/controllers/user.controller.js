import mongoose from "mongoose";
import { User } from "../models/auth.model.js";
import { Friend } from "../models/friend.model.js";

export const searchUsers = async (req, res) => {
  try {
    // taking query(search input) from req.query(url)
    // ex, http://localhost:3000/api/user?query="john"
    const { query } = req.query;
    if (!query) throw new Error("Query required");

    // set filter to {empty object} initially.
    let filter = {};
    // if query is given, will search that either in username, fullName or location.
    // ex, if query = "john", search "john" either in username, fullName, or location whichever gives the result.
    // and add that query to filter.
    if (query) {
      filter = {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { fullName: { $regex: query, $options: "i" } },
        ],
      };
    }
    // if no filter ({}) return null (we dont want to extract all the user from db.)
    if (!filter) return null;

    // find the user in db based on that filter("john") ascending always.
    const findUser = await User.find(filter)
      .sort({ createdAt: 1 })
      .select("username age fullName profilePic location freinds");

    const filteredUsers = findUser.filter(
      (user) =>
        user._id.toString() !== req.user._id.toString()
    );

    if (!filteredUsers) throw new Error("Error while fetching Users");

    // then count the number of user(s) (using countDocuments()) that appear when searched & store in a variable.
    const countUser = await User.countDocuments(filter);

    // if it's 0 the return a message.
    if (countUser === 0)
      return res.status(404).json({ message: "No User Found" });

    // else return the user info.
    return res.status(200).json(filteredUsers, countUser);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error searching user: ${error.message}`,
    });
  }
};

export const suggestFriends = async (req, res) => {
  try {
    const currentUserId = req.user._id; // my ID
    const currentUser = req.user; // my details

    // check for not suggesting your own profile and
    // the one you are already friends with.
    const user = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.freinds },
      isVerified: true,
      isOnboarded: true,
    }).select("profilePic fullName age location");

    if (!user || user.length === 0)
      return res.status(200).json([], { message: "No user to suggest" });

    // other than that suggest all the users.
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error recommending friends: ${error.message}`,
    });
  }
};

export const sendFriendReq = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const myId = req.user._id;
    console.log(myId);
    console.log(friendId);

    // cannot send request to own self!
    if (myId == friendId)
      throw new Error("You cannot send request to yourself.");

    // check if that user(friend) exists?
    const userExists = await User.findById(friendId);
    if (!userExists) throw new Error("User not found.");

    // if exists - check if they are already friends.
    if (userExists.freinds.includes(myId))
      throw new Error(`You are already friends with ${userExists.fullName}`);

    // check if request is already created.
    const checkRequest = await Friend.findOne({
      $or: [
        { sender: myId, recipient: friendId },
        { sender: friendId, recipient: myId },
      ],
    });

    if (checkRequest)
      return res.status(200).json({ message: `request already sent.` });

    // if not then create a request between them(i.e, myId and freindId)
    const sendRequest = await Friend.create({
      sender: myId,
      recipient: friendId,
    });

    if (!sendRequest) throw new Error("Error sending request.");

    // friend request created ("pending" by default).
    return res
      .status(201)
      .json({ success: true, message: `Request sent`, data: sendRequest });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const myId = req.user._id;

    // check if requestID exists? (The ID we got when created friend request).
    if (!requestId) throw new Error("Request Id required.");

    // using requestID find that request in "Friend" document.
    const findRequest = await Friend.findById(requestId).populate(
      "sender",
      "username"
    );
    if (!findRequest) throw new Error("Request not found."); // Error if not found.

    // check if the recipient and currently logged in user are same
    //  (i,e, shouldn't accept your own request).
    if (findRequest.recipient.toString() != myId)
      throw new Error("Cannot accept your own request.");

    // set the request status to "accepted".
    findRequest.status = "accepted";
    await findRequest.save();

    // add my ID(recipient) to the friend's(sender) friend field and vice versa.
    // $addToSet: add elements to the array only if they don't exists already.
    const sender = await User.findByIdAndUpdate(findRequest.sender, {
      $addToSet: { freinds: findRequest.recipient },
    });
    const recipient = await User.findByIdAndUpdate(findRequest.recipient, {
      $addToSet: { freinds: findRequest.sender },
    });

    return res
      .status(200)
      .json({ message: `You and ${sender.username} are friends.` });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    // friend request(s) which are not accepted (pending) by the user.
    const notAcceptedRequest = await Friend.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("sender", "profilePic fullName age location");

    // friend request(s) which user has sent to others and got accepted.
    const acceptedRequest = await Friend.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "profilePic fullName age location");

    // friend request(s) which user has sent to others and are not accepted (pending).
    const pendingRequest = await Friend.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipient", "profilePic fullName age location");

    return res
      .status(200)
      .json({ notAcceptedRequest, acceptedRequest, pendingRequest });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "error getAllRequest" + error.message });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const myId = req.user._id;

    // show all my(user) friends with details like fullName, age, etc.
    const myFriends = await User.find({ _id: myId })
      .select("freinds -_id")
      .populate("freinds", "fullName profilePic age location username");

    console.log(myFriends);

    if (!myFriends) throw new Error("You currently have no friends");

    return res.status(200).json(myFriends);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
