import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  acceptFriendRequest,
  getAllRequests,
  getMyFriends,
  getSearchedUsers,
  getSuggestFriends,
  sendFriendRequest,
} from "../lib/api";
import toast from "react-hot-toast";
import DiscoverPeopleSection from "../components/home/DiscoverPeopleSection.jsx";
import RecentActivity from "../components/home/RecentActivity.jsx";
import QuickStats from "../components/home/QuickStats.jsx";
import Welcome from "../components/home/Welcome.jsx";
import useThemeStore from "../store/useThemeStore.js";



const Home = () => {
  const [search, setSearch] = useState("");
  const [pendingRequestId, setPendingRequestId] = useState(new Set());
  const queryClient = useQueryClient();
  const { userData } = useAuthUser();

  const {theme} = useThemeStore();

  // Query for searching user(s).
  const { data: searchUsers = [], isLoading: searchUserLoaing } = useQuery({
    queryKey: ["searchUser", search],
    queryFn: () => getSearchedUsers(search),
    enabled: !!search,
  });

  // Query for suggesting user(s) on discover section.
  const { data: suggestFriendsData = [], isLoading: suggestFriendsLoading } =
    useQuery({
      queryKey: ["suggestFriends"],
      queryFn: getSuggestFriends,
    });

  // Query for extracting all requests (accepted, notAccepted, pending).
  const { data: allRequest = [], isLoading: pendingRequestLoading } = useQuery({
    queryKey: ["allRequests"],
    queryFn: getAllRequests,
  });

  // Query for extracting all friends of user.
  const { data: myFriends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends,
  });

  // Mutation for sending friend request
  const { mutate: sendRequestMutate, isPending: sendRequestPending } =
    useMutation({
      mutationFn: sendFriendRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["suggestFriends"] });
        queryClient.invalidateQueries({ queryKey: ["allRequests"] });
        toast.success("Friend request sent successfully!");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Failed to send friend request.");
      },
    });

     // Mutation for accepting friend request
  const { mutate: acceptRequestMutate, isPending: acceptReqPending } =
    useMutation({
      mutationFn: acceptFriendRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["suggestFriends"] });
        queryClient.invalidateQueries({ queryKey: ["allRequests"] });
        toast.success("Friend request accepted!");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Failed to accept request.");
      },
    });

  useEffect(() => {
    const pendingId = new Set();
    (allRequest?.pendingRequest || []).forEach((req) => {
      if (req.recipient?._id) pendingId.add(req.recipient._id);
    });
    setPendingRequestId(pendingId);
  }, [allRequest?.pendingRequest]);

  const friends = myFriends[0]?.freinds || [];
  const allRequestSent = [
    ...(allRequest.acceptedRequest || []),
    ...(allRequest.pendingRequest || []),
  ];

  return (
    <div className={`mx-auto px-2 ${theme === "sunset" ? "text-violet-50": "text-[#0f0c29]"} sm:px-4 py-4`}>
      {/* Welcome Heading */}
      <Welcome userData={userData} friends={friends} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Discover People */}
        <DiscoverPeopleSection
          search={search}
          setSearch={setSearch}
          suggestFriendsLoading={suggestFriendsLoading}
          searchUserLoaing={searchUserLoaing}
          searchUsers={searchUsers}
          suggestFriendsData={suggestFriendsData}
          allRequest={allRequest}
          sendRequestMutate={sendRequestMutate}
          sendRequestPending={sendRequestPending}
          acceptReqPending={acceptReqPending}
          pendingRequestId={pendingRequestId}
          acceptRequestMutate={acceptRequestMutate}
        />

        <div className="flex flex-col gap-6">
          {/* Quick Stats */}
          <QuickStats
            pendingRequestId={pendingRequestId}
            friends={friends}
            allRequestSent={allRequestSent}
          />
          {/* Recent Activity */}
          <RecentActivity
            allRequest={allRequest}
            pendingRequestLoading={pendingRequestLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
