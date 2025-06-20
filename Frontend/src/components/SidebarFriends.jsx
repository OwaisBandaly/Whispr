import { useQuery } from "@tanstack/react-query";
import { getMyFriends, getSearchedUsers } from "../lib/api";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";

const SidebarFriends = ({ talkedUser, onSelectFriend }) => {
  const { id } = useParams();
  const {userData} = useAuthUser();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["myFriends"],
    queryFn: getMyFriends,
  });

  // Query for searching user(s).
  const { data: searchUsers = [], isLoading: searchUserLoaing } = useQuery({
    queryKey: ["searchUser", debouncedSearch],
    queryFn: () => getSearchedUsers(debouncedSearch),
    enabled: !!debouncedSearch,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search])

  const showRecent = debouncedSearch.trim() === "";
  console.log("SEARCH USER", searchUsers)

  const acceptedFriends = searchUsers.filter((user) => {
    console.log("USER:", user);
    return Array.isArray(user?.freinds) && user?.freinds.includes(userData?._id);
  })
  

  return (
    <aside className="border-r border-base-content/10 h-screen md:max-w-80 overflow-hidden w-screen flex flex-col py-4 px-2 shadow-lg">
      <div className="mb-4">
          <input
            type="text"
            placeholder="Search friend..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-2 border-1 text-sm rounded-lg bg-base-100 focus:outline-0 border-neutral-700 text-base-content w-full"
          />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {
          isLoading && (
            <div className="text-center py-8">
                <span className="loading loading-spinner"></span>
              </div>
          )
        }
        {showRecent ? (
          <>
            <span className="font-medium text-lg mt-2 px-2">Recent Chats</span>
            {!talkedUser || talkedUser.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-sm font-light">No recent chats.</span>
              </div>
            ) : (
              <ul className="flex flex-col gap-2 mt-6">
                {talkedUser.map(
                  ({
                    user,
                    lastMessage,
                    lastMessageAt,
                    unreadMessage,
                    myId,
                  }) => (          
                    <Link
                      to={`/chat/${user.id}`}
                      key={user.id}
                      className={`flex items-center cursor-pointer gap-3 border-b-1 hover:bg-base-content/5 border-base-content/10 px-3 py-2 transition 
                      ${
                        id === user.id
                          ? "bg-base-content/7"
                          : "hover:bg-base-content/5"
                      }
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
                        <div className="text-base-content truncate">
                          {user.name || user.name}
                        </div>
                        <div className="text-xs text-base-content/90 truncate">
                          {lastMessage}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-col justify-center items-center">
                        <span className="text-xs text-base-content/80">
                          {lastMessage == "(No messages)" ? "": new Date(lastMessageAt).toLocaleDateString()}
                        </span>
                        {unreadMessage > 0 && (
                          <span className="bg-blue-700/80 text-white w-6 h-6 text-center rounded-full">
                            {unreadMessage}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                )}
              </ul>
            )}
          </>
        ) : (
          <>
            <span>Search Results</span>
            {searchUserLoaing ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner"></span>
              </div>
            ) : acceptedFriends.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-sm font-light">No user found.</span>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {acceptedFriends.map(
                  (user) => (
                    
                    (
                      <Link
                        to={`/chat/${user._id}`}
                        key={user._id}
                        className={`flex items-center cursor-pointer gap-3 border-b-1 hover:bg-base-content/5 border-base-content/10 px-3 py-2 transition 
                      ${
                        id === user._id
                          ? "bg-base-content/7"
                          : "hover:bg-base-content/5"
                      }
                      `}
                        onClick={() => {
                          if (window.innerWidth < 768 && onSelectFriend)
                            onSelectFriend();
                        }}
                      >
                        <img
                          src={user.profilePic || "/default-avatar.png"}
                          alt={user.fullName || user.username}
                          className="w-10 h-10 rounded-full object-cover border border-base-content/10"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base-content truncate">
                            {user.fullName || user.fullName}
                          </div>
                        </div>
                      </Link>
                    )
                  )
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default SidebarFriends;
