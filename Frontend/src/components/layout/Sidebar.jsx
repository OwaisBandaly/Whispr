import { useState } from "react";
import { Home, Users, Circle, MessageCircle, Menu, MessageCircleMore, AudioWaveform } from "lucide-react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../../hooks/useAuthUser";
import useThemeStore from "../../store/useThemeStore";
import userPng from "../../../public/user.png"

const Sidebar = () => {
  const { userData } = useAuthUser();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { theme } = useThemeStore()
  const isActive = (path) =>
    location.pathname === path ? `${theme === "sunset" ? "text-violet-50" : "text-[#0f0c29]"} btn-active bg-base-content/10` : "";

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-2 left-2 z-50">
        <button
          className="btn btn-square btn-md"
          onClick={() => setOpen(!open)}
        >
          <AudioWaveform className={`rotate-90 w-6 h-6 ${theme === "sunset" ? "text-violet-50/90" : "text-[#0f0c29]"}`} />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col justify-between fixed z-50 top-0 left-0 h-screen w-64 bg-base-200 border-r-2 border-neutral-800 shadow-lg transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          } md:static ${theme === "sunset" ? "text-violet-50" : "text-[#0f0c29]"}`}
      >
        {/* Top: Logo and Nav */}
        <div>
          {/* Logo */}
          <div className={`flex items-center h-14 border-b ${theme === "sunset" ? "text-violet-50" : "text-[#0f0c29]"} border-neutral-800 gap-1 px-4`}>
            <AudioWaveform />
            <Link 
            to="/" 
            className={`md:text-2xl text-xl font-semibold italic`}>
            Whispr.
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className={`btn btn-ghost justify-start gap-3 text-base-content hover:bg-base-content/7 mx-2 ${isActive(
                "/"
              )}`}
            >
              <Home className="w-6 h-6" />
              <span className="">Home</span>
            </Link>
            <Link
              to="/friends"
              onClick={() => setOpen(false)}
              className={`btn btn-ghost justify-start gap-3 text-base-content hover:bg-base-content/7 mx-2 ${isActive(
                "/friends"
              )}`}
            >
              <Users className="w-6 h-6" />
              <span className="">Friends</span>
            </Link>
            <Link
              to="/chat"
              onClick={() => setOpen(false)}
              className={`btn btn-ghost justify-start gap-3 text-base-content hover:bg-base-content/7 mx-2 ${isActive(
                "/chat"
              )}`}
            >
              <MessageCircleMore className="w-6 h-6" />
              <span className="">Chats</span>
            </Link>
          </nav>
        </div>

        {/* Bottom: User */}
        <div className="mb-6 px-4">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-base-content/8">
            <div className="relative">
              <div className="relative w-10 h-10 rounded-full">
                {!imgLoaded && !imgError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base-content/10 rounded-full">
                    <span className="loading loading-ring loading-xl w-4 h-4"></span>
                  </div>
                )}
                <img
                  src={!imgError ? userData?.profilePic : userPng}
                  alt="User"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  className={
                    userData?.profilePic
                      ? "w-10 h-10 rounded-full object-cover"
                      : "w-10 h-10 rounded-full object-cover bg-gray-300"
                  }
                />
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0 right-0">
                <Circle className="w-3 h-3 bg-green-500 rounded-full border-2 border-base-100" />
              </span>
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-sm md:text-base">
                {userData?.fullName}
              </div>
              <div className="text-xs text-green-500 flex items-center gap-1 md:text-sm">
                Online
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
