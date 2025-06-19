import { useQuery } from "@tanstack/react-query";
import { getMyFriends } from "../lib/api";
import { Link, useParams } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";

const SidebarFriends = ({ talkedUser, onSelectFriend }) => {
  const { id } = useParams();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["myFriends"],
    queryFn: getMyFriends,
  });

  const myAllFriends = Array.isArray(friends) ? friends : [];

  return (
    <aside className="border-r border-base-content/10 h-screen md:max-w-80 overflow-hidden w-screen flex flex-col py-4 px-2 shadow-lg">
      <h2 className="text-lg font-bold text-base-content mb-4 px-2">Chats</h2>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="text-base-content/60 text-center mt-10">
            Loading...
          </div>
        ) : !myAllFriends || myAllFriends.length === 0 ? (
          <div className="text-base-content/60 text-center mt-10">
            No friends yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {talkedUser.map(
              ({ user, lastMessage, lastMessageAt, unreadMessage, myId }) => (
                (
                  <Link
                  
                    to={`/chat/${user.id}`}
                    key={user.id}
                    className={`flex items-center cursor-pointer gap-3 border-b-1 hover:bg-base-content/5 border-base-content/10 px-3 py-2 transition 
                      ${id === user.id ? "bg-base-content/7" : "hover:bg-base-content/5"}
                      `}
                    onClick={() => {
                      if (window.innerWidth < 768 && onSelectFriend)
                        onSelectFriend();
                    }}
                  >
                    <img
                      src={user.image || "/default-avatar.png"}
                      alt={user.name || user.name}
                      className="w-10 h-10 rounded-full object-cover border border-base-content/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base-content truncate">
                        {user.name || user.name}
                      </div>
                      <div className="text-xs text-base-content/60 truncate">
                        {lastMessage}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-col justify-center items-center">
                      <span className="text-xs text-base-content/70">
                        {new Date(lastMessageAt).toLocaleDateString()}
                      </span>
                      {unreadMessage > 0 && (
                        <span className="bg-blue-700/80 text-white w-6 h-6 text-center rounded-full">
                          {unreadMessage}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              )
            )}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default SidebarFriends;
