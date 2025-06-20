import { useState, useRef, useEffect } from "react";
import { Sun, Moon, UserPen, LogOut, BellDot, ArrowLeft, AudioWaveform } from "lucide-react";
import useAuthUser from "../../hooks/useAuthUser";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logOut } from "../../lib/api";
import useThemeStore from "../../store/useThemeStore";
import userPng from "../../../public/user.png"
import { useLocation, useParams } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData } = useAuthUser();
  const [showMenu, setShowMenu] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef();
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  const {id} = useParams();

  const queryClient = useQueryClient();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowMenu(false);
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  return (
    <nav className={`w-full h-14 px-4 flex items-center justify-between md:justify-between bg-base-200 border-b border-neutral-800 shadow z-10
    ${theme === "sunset" ? "text-violet-50/90" : "text-[#0f0c29]"}
    `}>

      <div className="flex items-center gap-2 md:hidden">
        <Link to="/">
        {<ArrowLeft /> }
        </Link>
      </div>

      <div className="md:flex w-fit items-center hidden">
        <Link to="/">
        {(location.pathname === "/chat" || location.pathname === `/chat/${id}`) && (
          <div className="flex items-center gap-1">
             <AudioWaveform />
            <span 
            className={`md:text-2xl text-xl font-semibold italic`}>
            Whispr.
            </span>
          </div>
        )}
        </Link>
      </div>

      {/* Right side icons */}
      <div className="flex items-center sm:gap-1">
        <Link to="/notifications" className="btn btn-ghost btn-circle">
          <BellDot className="w-[1.6rem] h-[1.6rem]" />
        </Link>

        <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
          {theme === "sunset" ? (
            <Sun className="w-[1.6rem] h-[1.6rem]" />
          ) : (
            <Moon className="w-[1.6rem] h-[1.6rem]" />
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setShowMenu((v) => !v)}
          >
            <div className="relative w-7 h-7 rounded-full">
              {!imgLoaded && !imgError && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-700/40 rounded-full">
                  <span className="loading loading-ring loading-xl w-4 h-4"></span>
                </div>
              )}
              <img
                src={!imgError ? userData?.profilePic : userPng}
                alt="User"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className="w-7 h-7 rounded-full object-cover border-2 border-base-content"
              />
            </div>
          </button>

          {showMenu && (
            <div className="absolute mt-2 right-0 w-46 bg-base-200 border border-neutral-700 rounded-xl shadow-lg z-50">
              <div className="flex flex-col py-2 px-1">
                {/* change theme */}
                {/* <button
                  className="btn-circle hover:bg-base-content/5 rounded-lg px-4 py-1.5"
                  onClick={toggleTheme}
                >
                  {theme === "sunset" ? (
                    <span className="flex text-md items-center  gap-2"><Sun className="w-5 h-5 text-slate-100" />
                      {`${theme === "sunset" ? "Light mode" : "Dark mode"}`}
                    </span>
                  ) : (
                    <span className="flex text-md items-center gap-2"><Moon className="w-5 h-5 text-slate-900" />
                      {`${theme === "sunset" ? "Light mode" : "Dark mode"}`}
                    </span>
                  )}

                </button> */}
                {/* edit profile */}
                <button
                  className="flex items-center gap-2 px-4 py-1.5 hover:bg-base-content/5 rounded-lg"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/update-profile");
                  }}
                >
                  <UserPen className="w-5 h-5" />
                  Edit Profile
                </button>
                {/* logout */}
                <button
                  className="flex items-center gap-2 px-4 py-1.5 hover:bg-base-content/5 rounded-lg text-red-400"
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
