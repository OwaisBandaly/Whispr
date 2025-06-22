import useAuthUser from "../../hooks/useAuthUser";
import DiscoverCard from "./DiscoverCard";
import { UserPlus } from "lucide-react";

const DiscoverPeopleSection = ({
  search,
  setSearch,
  suggestFriendsLoading,
  searchUserLoaing,
  searchUsers,
  suggestFriendsData,
  allRequest,
  sendRequestMutate,
  sendRequestPending,
  acceptReqPending,
  pendingRequestId,
  acceptRequestMutate,
}) => {

  const {userData} = useAuthUser();
   const notAcceptedFriends = searchUsers.filter((user) => {
    return !user?.freinds.includes(userData?._id);
  })

  return (
    <div className={`custom-scrollbar md:col-span-2 bg-base-200 max-h-[30rem] overflow-y-auto md:overflow-y-auto rounded-xl p-4 border border-neutral-800 shadow flex flex-col`}>
    <div className="inline-flex gap-1 my-1">
      <UserPlus className="sm:mt-0.5 mt-[0.22rem] sm:w-6 sm:h-6 w-5 h-5" />
      <h2 className="font-light emerald mb-3 text-lg sm:text-xl">
        Discover People
      </h2>
    </div>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search for people..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border-1 rounded-lg bg-base-100/60 focus:outline-0 border-neutral-700 text-base-content w-full"
      />
    </div>
    {suggestFriendsLoading || searchUserLoaing ? (
      <div className="flex justify-center items-center h-32">
        <span className="loading loading-spinner loading-lg text-success"></span>
      </div>
    ) : (
      <>
        {(search ? notAcceptedFriends : suggestFriendsData).length === 0 ? (
          <div className="text-center text-base-content/90 py-8">
            No {search ? "users found." : "suggested friends found."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {(search ? notAcceptedFriends : suggestFriendsData).map((person) => {
              const incomingRequest = (
                allRequest.notAcceptedRequest || []
              ).find(
                (req) => req.sender?._id?.toString() === person._id?.toString()
              );
              return (
                <DiscoverCard
                  key={person._id}
                  person={person}
                  onSendRequest={() => sendRequestMutate(person._id)}
                  loading={sendRequestPending || acceptReqPending}
                  isRequested={pendingRequestId.has(person._id)}
                  canAccept={Boolean(incomingRequest)}
                  onAcceptRequest={() =>
                  incomingRequest && acceptRequestMutate(incomingRequest._id)
                  }
                  onAcceptLoading={acceptReqPending}
                />
              );
            })}
          </div>
        )}
      </>
    )}
  </div>
  )
}
  


export default DiscoverPeopleSection;
