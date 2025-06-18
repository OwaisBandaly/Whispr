import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRequests } from "../lib/api";
import { Bell , Dot, UserPlus, UserCheck } from "lucide-react";
import { timeAgo } from "../utils/timeAgo";

const Notifications = () => {
  const queryClient = useQueryClient();
  const { data: allRequest = {}, isLoading } = useQuery({
    queryKey: ["allRequests"],
    queryFn: getAllRequests,
  });

  // Combine and tag activities
  const activities = [
    ...(allRequest.notAcceptedRequest || []).map(req => ({
      ...req,
      activityType: "sent",
      activityDate: req.createdAt,
      read: false,
    })),
    ...(allRequest.acceptedRequest || []).map(req => ({
      ...req,
      activityType: "accepted",
      activityDate: req.updatedAt || req.createdAt,
      read: false,
    })),
  ].sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate));

   const filteredActivities = activities.filter(req => {
    if(req.activityType === "sent" || req.activityType === "accepted") {
      return req.recipient && req.recipient._id
    }
    if(req.activityType === "received") {
      return req.sender && req.sender._id
    }
    return false;
  })
  // Local state for read/unread
  const [readIds, setReadIds] = useState([]);

  const markAllAsRead = () => {
    setReadIds(filteredActivities.map(a => a._id));
  };

  const ifUnread = filteredActivities.some(a => !readIds.includes(a._id))
  const unreadCount = filteredActivities.filter(a => !readIds.includes(a._id));
  

  return (
    <div className="max-w-[57rem] ml-30 p-6 min-h-screen">
      <div className="flex items-center">
        <div className="flex-1 justify-between mb-6">
          <h1 className="text-3xl w-fit font-bold">Notifications</h1>
          <p className="w-fit mt-0.5 text-base-content/80 text-md">Stay updated with your latest activities</p>
        </div>
        {ifUnread && (
          <button
            className="btn btn-sm bg-blue-600/80 text-white"
            onClick={markAllAsRead}
            disabled={activities.length === 0}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="bg-base-100 rounded-xl shadow py-4 min-h-[32rem]">
        <div className="flex justify-between items-center mx-4 pb-3 mb-3 border-b border-base-content/10">
          <span className="text-xl font-semibold flex items-center gap-2"><Bell className="w-5 h-5" />All Notifications</span>
          {ifUnread && <span className="bg-red-900 scale-95 w-fit px-3 font-semibold text-white rounded-full">{unreadCount.length} new</span>}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg text-success"></span>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center text-base-content/70 py-8">No notifications.</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {filteredActivities.map((req) => (
              <li
                key={req._id}
                onClick={() => {
                  if (!readIds.includes(req._id)) {
                    setReadIds(prev => [...prev, req._id])
                  }
                }}
                className={`flex cursor-pointer items-center gap-3 p-3 ${!readIds.includes(req._id) ? "border-l-4 border-blue-500" : ""}`}
              >
                {/* User profile pic */}
                <img
                  src={
                    req.activityType === "sent"
                      ? req.recipient?.profilePic
                      : req.recipient?.profilePic
                  }
                  alt={
                    req.activityType === "sent"
                      ? req.recipient?.username
                      : req.recipient?.username
                  }
                  className="w-11 h-11 ml-3 rounded-full object-cover"
                />
                {/* Icon */}
                {req.activityType === "sent" ? (
                  <UserPlus className="w-5 h-5 text-blue-600" />
                ) : (
                  <UserCheck className="w-5 h-5 text-green-500/90" />
                )}
                {/* Info */}
                <div className="flex-1">
                  {req.activityType === "sent" ? (
                    <span>
                      You sent a friend request to{" "}
                      <span className="font-bold">{req.recipient?.fullName || req.recipient?.username}</span>
                    </span>
                  ) : (
                    <span>
                      <span className="font-bold">{req.recipient?.fullName || req.recipient?.username}</span> accepted your friend request
                    </span>
                  )}
                  <div className="text-xs mt-0.5 text-base-content/60">{timeAgo(req.activityDate)}</div>
                </div>
                {/* Dot for unread */}
                {!readIds.includes(req._id) && (
                  <Dot className="w-8 h-8 text-blue-500 animate-pulse" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;