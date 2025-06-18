import { useState } from "react";
import {
  User,
  Info,
  Calendar,
  MapPin,
  ShuffleIcon,
  CircleCheckBig,
  X,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { onboard } from "../lib/api";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import useThemeStore from "../store/useThemeStore";

const Onboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme } = useThemeStore();
  const { userData } = useAuthUser();

  const [form, setForm] = useState({
    fullName: userData.fullName || "",
    bio: userData.bio || "",
    age: userData.age || "",
    location: userData.location || "",
    profilePic: userData.profilePic || defaultProfile,
  });

  const [profileLoad, setProfileLoad] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: onboardMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (formData) => {
      return await toast.promise(
        onboard(formData),
        {
          loading: "Saving your profile...",
          success: "Profile updated successfully!",
          error: (err) =>
            err?.response?.data?.message || "Something went wrong!",
        },
        {
          style: {
            background: "#1e1e2f",
            color: "#d1d5db",
            border: "1px solid #333",
          },
          iconTheme: {
            primary: "#7cdc96",
            secondary: "#1e1e2f",
          },
          position: "right-bottom",
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      if(currentPath === "/update-profile") {
        navigate(-1);
      }
    },
  });

  const handleRandomAvatar = () => {
    setProfileLoad(true);
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setForm({ ...form, profilePic: randomAvatar });
    setTimeout(() => {
      setProfileLoad(false);
    }, 1600);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardMutation(form);
  };

  return (
    <div
      className="min-h-screen min-w-screen flex items-center justify-center bg-base-300 p-4"
      data-theme={currentPath == "/update-profile" ? theme : "sunset"}
    >
      <div className="relative flex flex-col bg-base-200 rounded-xl shadow-lg overflow-hidden border-2 border-neutral-800 max-w-lg w-full">
        <div className="flex-1 flex flex-col justify-center p-8 w-full">
          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            {currentPath == "/update-profile" && (
              <div className="absolute right-5 top-4">
                <button
                  className="p-1 text-base-content hover:text-neutral-500 transition"
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  <X />
                </button>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-center text-base-content">
                {currentPath == "/onboard"
                  ? "Complete your profile"
                  : "Edit your profile"}
              </h2>
              <p className="text-md text-center text-neutral-400 mb-6">
                {currentPath == "/onboard"
                  ? "Tell us a bit about yourself to get started"
                  : ""}
              </p>
            </div>
            {/* Profile Picture with Change Button */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="relative">
                {profileLoad && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base-content/50 backdrop-blur-3xl rounded-full">
                    <span className="loading loading-spinner text-primary"></span>
                  </div>
                )}
                <img
                  src={form.profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4  border-neutral-800 shadow"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2c7740] hover:bg-[#4c7a58] transition"
                  tabIndex={-1}
                  onClick={handleRandomAvatar}
                >
                  <ShuffleIcon className="w-5 h-5 cursor-pointer text-slate-100" />
                </button>
              </div>
            </div>
            {/* Full Name */}
            <label className="rounded-xl flex border-2 border-neutral-700 items-center gap-2 bg-base-100 w-full">
              <User className="ml-2 w-5 h-5 text-[#7cdc96]" />
              <input
                type="text"
                className="grow p-2 text-base-content autofill:!bg-transparent focus:!bg-transparent w-full focus:outline-none"
                placeholder="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </label>
            {/* Age & Location side by side */}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="rounded-xl flex border-2 border-neutral-700 items-center gap-2 bg-base-100 w-full sm:w-1/2">
                <Calendar className="ml-2 w-5 h-5 text-[#7cdc96]" />
                <input
                  type="number"
                  className="grow p-2 text-base-content !bg-transparent autofill:!bg-transparent focus:!bg-transparent w-full focus:outline-none"
                  placeholder="Age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min={1}
                  max={120}
                  required
                  autoComplete="off"
                />
              </label>
              <label className="rounded-xl flex border-2 border-neutral-700 items-center gap-2 bg-base-100 w-full sm:w-1/2">
                <MapPin className="ml-2 w-5 h-5 text-[#7cdc96]" />
                <input
                  type="text"
                  className="grow p-2 text-base-content !bg-transparent autofill:!bg-transparent focus:!bg-transparent w-full focus:outline-none"
                  placeholder="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </label>
            </div>
            {/* Bio */}
            <label className="flex flex-col gap-1 w-full">
              <span className="flex items-center gap-2 text-base-content/80 font-medium">
                <Info className="w-5 h-5 text-[#7cdc96]" />
                Bio
              </span>
              <textarea
                className="textarea rounded-xl my-1 border-2 border-neutral-700 bg-base-100 text-base-content focus:!bg-transparent focus:outline-none resize-none w-full"
                placeholder="Tell us about yourself...(optional)"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                maxLength={500}
                rows={4}
                autoComplete="off"
              />
              <span className="text-xs text-neutral-500 text-right">
                {form.bio.length}/500
              </span>
            </label>
            {error && (
              <div className="text-red-500 text-sm">
                {error.response?.data?.message || "Something went wrong"}
              </div>
            )}

            <button
              className="btn bg-[#7cdc96] hover:bg-[#7bf19b] text-primary-content text-[1.1rem] font-bold w-full"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-dots bg-base-content"></span>
              ) : (
                <span className="flex justify-center items-center gap-2">
                  <CircleCheckBig className="w-6 h-6 text-base"></CircleCheckBig>
                  {currentPath == "/onboard"
                    ? "Complete Setup"
                    : "Save changes"}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
