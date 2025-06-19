import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getMyFriends, getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import SidebarFriends from "../components/SidebarFriends";
import useThemeStore from "../store/useThemeStore";
import { MessageSquare } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { userData } = useAuthUser();
  const { theme } = useThemeStore();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [talkedUsers, setTalkedUsers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true); // for mobile

  const { data: tokenData, isLoading: tokenLoading } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!userData,
  });

  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ["myFriends"],
    queryFn: getMyFriends,
    select: (data) =>
      (data[0]?.freinds || []).filter((f) => f.status === "accepted"),
  });

  // Initialize Stream Chat
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !userData?._id) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: userData._id,
            name: userData.fullName,
            image: userData.profilePic,
          },
          tokenData.token
        );

        setChatClient(client);

        if (targetUserId) {
          const channelId = [userData._id, targetUserId].sort().join("-");
          const ch = client.channel("messaging", channelId, {
            members: [userData._id, targetUserId],
          });
          await ch.watch();
          setChannel(ch);
        }
      } catch (err) {
        console.error("Stream Chat init error:", err);
        toast.error("Stream Chat init failed");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData?.token, userData?._id, targetUserId]);

  // Fetch recent conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!chatClient || !userData?._id) return;

      try {
        const filters = {
          type: "messaging",
          members: { $in: [userData._id] },
        };
        const sort = { last_message_at: -1 };

        const channels = await chatClient.queryChannels(filters, sort, {
          watch: true,
          state: true,
        });

        const recentUsers = channels
          .map((ch) => {
            const members = Object.values(ch.state.members);
            const other = members.find((m) => m.user.id !== userData._id)?.user;

            const lastMsg =
              ch.state.messages[ch.state.messages.length - 1] || null;

            return {
              myId: userData?._id,
              user: other,
              lastMessage: lastMsg?.text || "(No messages)",
              unreadMessage: ch.countUnread(),
              lastMessageAt: ch.state.last_message_at,
            };
          })
          .filter(Boolean);

        setTalkedUsers(recentUsers);
      } catch (err) {
        console.error("Conversation fetch error", err);
      }
    };

    fetchConversations();
  }, [chatClient, userData]);

  // Handle sidebar visibility on mobile
  useEffect(() => {
    // On mobile, hide sidebar when a chat is open
    if (window.innerWidth < 768) {
      setShowSidebar(!targetUserId);
    }
  }, [targetUserId]);

  // Loading state
  if (tokenLoading || loading || !chatClient) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  // Responsive layout
  return (
  <div className="flex flex-1 flex-col md:flex-row h-full w-screen overflow-hidden">
    {/* Sidebar */}
    <div
      className={`
        ${targetUserId ? "hidden" : "block"} 
        md:block 
        w-full md:w-80 
        h-full 
        bg-base-300
        border-r border-base-content/10
      `}
    >
      <SidebarFriends
        friends={friends}
        talkedUser={talkedUsers}
        onSelectFriend={() => setShowSidebar(false)}
      />
    </div>

    {/* Chat or Welcome area */}
    <main
      className={`
        flex-1 h-full 
        ${targetUserId ? "block" : "hidden"} 
        md:block 
        bg-base-200 
        flex items-center justify-center
      `}
    >
      {targetUserId && channel ? (
        <Chat
          client={chatClient}
          theme={`${
            theme === "sunset"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }`}
        >
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </Channel>
        </Chat>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <MessageSquare className="w-12 h-12 text-base-content/80 mb-2" />
          <h2 className="text-2xl font-bold mb-2 text-base-content/80">
            Welcome to Chat
          </h2>
          <p className="text-base-content/60 text-center max-w-md">
            Select a friend from the sidebar to start a conversation. <br />
            All your accepted friends will appear here.
          </p>
        </div>
      )}
    </main>
  </div>
);

};

export default ChatPage;
