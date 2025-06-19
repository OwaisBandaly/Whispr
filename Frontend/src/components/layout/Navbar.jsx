import { useState, useRef, useEffect } from "react";
import { MessageCircle, Sun, Moon, Settings, Search , UserPen, LogOut } from "lucide-react";
import useAuthUser from "../../hooks/useAuthUser";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logOut } from "../../lib/api";
import useThemeStore from "../../store/useThemeStore";

const Navbar = () => {
const navigate = useNavigate();
  const { userData } = useAuthUser();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const { theme, toggleTheme } = useThemeStore();

  const queryClient = useQueryClient();
  const {mutate: logoutMutation} = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["authUser"]})
    }
  })

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  return (
  <nav className="w-full h-16 px-4 flex items-center justify-between bg-base-200 border-b border-neutral-800 shadow z-10">
  {/* Logo only visible on mobile */}
  <div className="block md:hidden">
    <img
      src="/logo.svg" // <-- Replace with your logo path
      alt="Whispr"
      className="h-8 w-auto"
    />
  </div>

  {/* Right side icons */}
  <div className="flex items-center gap-2 sm:gap-3">
    <Link to="/chat" className="btn btn-ghost btn-circle">
      <MessageCircle className="w-5 h-5" />
    </Link>

    <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
      {theme === "sunset" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-blue-400" />
      )}
    </button>

    <button className="btn btn-ghost btn-circle">
      <Settings className="w-5 h-5 text-base-content" />
    </button>

    {/* Profile dropdown */}
    <div className="relative" ref={menuRef}>
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setShowMenu((v) => !v)}
      >
        <img
          src={userData?.profilePic || "/default-avatar.png"}
          alt="User"
          className="w-7 h-7 rounded-full object-cover border-2 border-base-content"
        />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-44 bg-base-200 border border-neutral-700 rounded-xl shadow-lg z-50">
          <div className="flex flex-col py-2">
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-base-content/5 rounded-xl text-base-content"
              onClick={() => {
                setShowMenu(false);
                navigate("/update-profile");
              }}
            >
              <UserPen className="w-5 h-5" />
              Edit Profile
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-base-content/5 rounded-xl text-error"
              onClick={() => {
                setShowMenu(false);
                logoutMutation();
              }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</nav>



  );
};

export default Navbar;