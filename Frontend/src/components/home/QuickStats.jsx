import useThemeStore from "../../store/useThemeStore";

const QuickStats = ({ friends, allRequestSent, pendingRequestId }) => {
  
  const {theme} = useThemeStore();
  
  return (
  <div className={`bg-base-200 rounded-xl p-4 border border-neutral-800 shadow flex flex-col gap-3
  ${theme === "sunset" ? "text-violet-50": "text-[#0f0c29]"}
  `}>
    <h2 className="font-medium text-lg mb-2">Quick Stats</h2>
    <div className="flex font-light flex-col gap-2">
      <div className="flex  justify-between">
        <span>Total Friends</span>
        <span className="">{friends.length}</span>
      </div>
      <div className="flex justify-between">
        <span>Requests Pending</span>
        <span className=" text-yellow-300">
          {pendingRequestId.size}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Sent Requests</span>
        <span className=" text-blue-400">{allRequestSent.length}</span>
      </div>
    </div>
  </div>
)};

export default QuickStats;
