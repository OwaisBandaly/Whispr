import useThemeStore from "../../store/useThemeStore";
import { timeAgo } from "../../utils/timeAgo";

const RecentActivity = ({ allRequest, pendingRequestLoading }) => {
  // Combine and sort activities
  const activities = [
    ...(allRequest.notAcceptedRequest || []).map((req) => ({
      ...req,
      activityType: "received",
      activityDate: req.createdAt,
    })),
    ...(allRequest.acceptedRequest || []).map((req) => ({
      ...req,
      activityType: "accepted",
      activityDate: req.updatedAt || req.createdAt,
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

  const {theme} = useThemeStore()

  return (
    <div className={`bg-base-200 rounded-xl max-h-[20rem] overflow-y-scroll p-4 border border-neutral-800 shadow flex flex-col custom-scrollbar
    ${theme === "sunset" ? "text-violet-50/95": "text-[#0f0c29]"}
    `}>
      <h2 className="font-bold text-lg mb-4">
        Recent Activity
      </h2>
      <ul className="flex flex-col gap-2">
        {pendingRequestLoading ? (
          <li className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md text-success"></span>
          </li>
        ) : filteredActivities.length === 0 ? (
          <li className="text-base-content/70 text-center py-4">
            No recent activity.
          </li>
        ) : (
          filteredActivities.map((req) => (
            <li
              key={req._id}
              className="text-sm bg-base-100 flex gap-2 items-center rounded p-2"
            >
              <img
                className="w-7 h-7 object-center"
                src={
                  req.activityType === "received"
                    ? req.sender?.profilePic
                    : req.recipient?.profilePic
                }
                alt={
                  req.activityType === "received"
                    ? req.sender?.username
                    : req.recipient?.username
                }
              />
              <div className="flex flex-col items-start">
                {req.activityType === "received"  ? (
                  <p>
                    <span className="font-bold">
                      {req.sender?.fullName || req.sender?.username}
                    </span>{" "}
                    sent you a friend request
                  </p>
                ) : (
                  <p>
                    <span className="font-bold">
                      {req.recipient?.fullName || req.recipient?.username}
                    </span>{" "}
                    accepted your request
                  </p>
                )}
                <span className="text-base-content/60">
                  {timeAgo(req.activityDate)}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentActivity;
