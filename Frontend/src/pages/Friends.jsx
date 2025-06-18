import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyFriends, getAllRequests, acceptFriendRequest } from "../lib/api";
import { MessageCircle, Send, Check, Users, UserPlus, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { timeAgo } from "../utils/timeAgo.js";
import { Link } from "react-router";

const Friends = () => {
  const [tab, setTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: myFriendsData = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends,
  });

  const { data: allRequest = {}, isLoading: requestsLoading } = useQuery({
    queryKey: ["allRequests"],
    queryFn: getAllRequests,
  });

  const { mutate: acceptRequestMutate, isPending: acceptLoading } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request accepted!");
    },
    onError: () => toast.error("Failed to accept request."),
  });

  const myFriends = myFriendsData[0]?.freinds || [];
  const requests = allRequest.notAcceptedRequest || [];
  const sent = [...(allRequest.pendingRequest || [])];

  return (
    <div className="md:mx-[2vw] mx-4 max-w-screen min-h-screen lg:p-4">
      <h1 className="text-3xl font-bold mb-0.5 mt-2 w-fit text-left">Friends</h1>
      <p className="mb-6 w-fit text-base-content/70">Manage your connections and friend requests</p>

      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar justify-start bg-base-content/15 px-2 py-1 rounded-md gap-2 mb-6 max-w-fit">
        <button
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            tab === "all" ? "bg-blue-600/70 text-white" : "bg-base-100 text-base-content"
          }`}
          onClick={() => setTab("all")}
        >
          <Users className="w-5 h-5" />
          <span className="hidden sm:block">All Friends</span>
          <span className="ml-1 bg-blue-300 text-black font-semibold text-xs px-2 py-0.5 rounded-full">
            {myFriends.length}
          </span>
        </button>

        <button
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            tab === "requests" ? "bg-blue-600/70 text-white" : "bg-base-100 text-base-content"
          }`}
          onClick={() => setTab("requests")}
        >
          <UserPlus className="w-5 h-5" />
          <span className="hidden sm:block">Requests</span>
          <span className="ml-1 bg-green-400 text-black text-xs px-2 py-0.5 rounded-full">
            {requests.length}
          </span>
        </button>

        <button
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
            tab === "sent" ? "bg-blue-600/70 text-white" : "bg-base-100 text-base-content"
          }`}
          onClick={() => setTab("sent")}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:block">Sent</span>
          <span className="ml-1 bg-orange-300 text-black text-xs px-2 py-0.5 rounded-full">
            {sent.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-base-100 w-full rounded-xl shadow p-4 h-[60vh] overflow-y-auto">
        {tab === "all" && (
          <div>
            {myFriends.length === 0 ? (
              <div className="text-center text-base-content/70 py-8">You have no friends yet.</div>
            ) : (
              <ul className="flex flex-col gap-4">
                {myFriends.map(friend => (
                  <li key={friend._id} className="flex items-start sm:items-center gap-4 p-2 border-b border-base-content/20 flex-wrap sm:flex-nowrap">
                    <img src={friend.profilePic} alt={friend.fullName} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-[1.05rem]">{friend.fullName}</div>
                      <div className="text-sm text-base-content/65">
                        {friend.age ? `${friend.age} yrs` : ""} {friend.location && `• ${friend.location}`}
                      </div>
                    </div>
                    <Link
                      to={`/chat/${friend?._id}`}
                      className="btn btn-sm rounded-full bg-blue-600 text-white flex items-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "requests" && (
          <div>
            {requestsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg text-success"></span>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center text-base-content/70 py-8">No friend requests.</div>
            ) : (
              <ul className="flex flex-col gap-4">
                {requests.map(req => (
                  <li key={req._id} className="flex items-start sm:items-center gap-4 p-3 border-b border-base-content/20 flex-wrap sm:flex-nowrap">
                    <img src={req.sender?.profilePic} alt={req.sender?.fullName} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-[1.05rem]">{req.sender?.fullName}</div>
                      <div className="text-sm text-base-content/60">
                        {req.sender?.age ? `${req.sender.age} yrs` : ""} {req.sender?.location && `• ${req.sender.location}`}
                      </div>
                    </div>
                    <button
                      className="btn btn-sm bg-green-700 text-white flex items-center gap-1"
                      onClick={() => acceptRequestMutate(req._id)}
                      disabled={acceptLoading}
                    >
                      {acceptLoading ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Accept
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "sent" && (
          <div>
            {sent.length === 0 ? (
              <div className="text-center text-base-content/70 py-8">No sent requests.</div>
            ) : (
              <ul className="flex flex-col gap-4">
                {sent.map(req => (
                  <li key={req._id} className="flex items-start sm:items-center gap-4 p-3 border-b border-base-content/20 flex-wrap sm:flex-nowrap">
                    <img src={req.recipient?.profilePic} alt={req.recipient?.fullName} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold">{req.recipient?.fullName}</div>
                      <p className="text-sm text-base-content/70">{`Sent ${timeAgo(req.createdAt)}`}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-base-content/80 font-semibold">
                      <Clock className="w-4 h-4" /> Pending
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
