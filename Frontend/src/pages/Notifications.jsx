import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRequests } from "../lib/api";
import { Bell , Dot, UserPlus, UserCheck } from "lucide-react";
import { timeAgo } from "../utils/timeAgo";
import useThemeStore from "../store/useThemeStore";

const Notifications = () => {
  const {theme} = useThemeStore();

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
    <div
  className={`w-full px-4 md:px-6 max-w-4xl mx-auto py-6 min-h-full ${
    theme === "sunset" ? "text-violet-50/90" : "text-[#0f0c29]"
  }`}
>
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 sm:gap-0">
    <div>
      <h1 className="text-2xl sm:text-3xl font-medium">Notifications</h1>
      <p className="mt-1 text-base-content/95">
        Stay updated with your latest activities.
      </p>
    </div>
    {ifUnread && (
      <button
        className="btn btn-sm bg-blue-600/80 font-medium text-white mt-2 sm:mt-0"
        onClick={markAllAsRead}
        disabled={activities.length === 0}
      >
        Mark all as read
      </button>
    )}
  </div>

  <div className="bg-base-100 rounded-xl shadow py-4 h-fit">
    <div className="flex justify-between items-center px-4 pb-3 mb-3 border-b border-base-content/10">
      <span className="text-lg sm:text-xl font-light flex items-center gap-2">
        <Bell className="w-5 h-5" />
        All Notifications
      </span>
      {ifUnread && (
        <span className="bg-red-900 px-3 sm:flex gap-1 text-white text-sm rounded-full">
          {unreadCount.length} <span className="hidden sm:flex">new</span>
        </span>
      )}
    </div>

    {isLoading ? (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg text-success"></span>
      </div>
    ) : filteredActivities.length === 0 ? (
      <div className="text-center text-base-content/95 py-8">
        No notifications.
      </div>
    ) : (
      <ul className="flex flex-col gap-3 sm:gap-4 px-2 sm:px-4">
        {filteredActivities.map((req) => (
          <li
            key={req._id}
            onClick={() => {
              if (!readIds.includes(req._id)) {
                setReadIds((prev) => [...prev, req._id]);
              }
            }}
            className={`flex flex-wrap sm:flex-nowrap items-center gap-3 cursor-pointer rounded-md px-3 py-3 ${
              !readIds.includes(req._id)
                ? "border-l-4 border-blue-500 bg-base-100"
                : "hover:bg-base-200"
            }`}
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
              className="w-11 h-11 rounded-full object-cover border border-base-content/10"
            />

            {/* Icon */}
            <div className="shrink-0">
              {req.activityType === "sent" ? (
                <UserPlus className="w-5 h-5 text-blue-600" />
              ) : (
                <UserCheck className="w-5 h-5 text-green-500/90" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {req.activityType === "sent" ? (
                <span className="text-base-content/90">
                  You sent a friend request to{" "}
                  <span className={`font-medium ${
                      theme === "sunset"
                        ? "text-violet-50/90"
                        : "text-[#0f0c29]"
                    }`}>
                    {req.recipient?.fullName || req.recipient?.username}
                  </span>
                </span>
              ) : (
                <span className="text-base-content/90 ">
                  <span
                    className={`font-medium ${
                      theme === "sunset"
                        ? "text-violet-50/90"
                        : "text-[#0f0c29]"
                    }`}
                  >
                    {req.recipient?.fullName || req.recipient?.username}
                  </span>{" "}
                  accepted your friend request
                </span>
              )}
              <div className="text-xs mt-0.5 text-base-content/90">
                {timeAgo(req.activityDate)}
              </div>
            </div>

            {/* Dot for unread */}
            {!readIds.includes(req._id) && (
              <Dot className="w-8 h-8 text-blue-500 animate-pulse shrink-0" />
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