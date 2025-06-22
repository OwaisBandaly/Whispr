import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, MessageCircle, AudioWaveform } from "lucide-react";
import signupImage from "../../public/signup.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logIn } from "../lib/api";
import toast from "react-hot-toast";
import {Link} from "react-router"

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (loginData) => {
      return await toast.promise(
        logIn(loginData),
        {
          loading: "Logging in...",
          success: "Login successful!",
          error: (err) =>
            err?.response?.data?.message || "Something went wrong!",
        },
        {
          style: {
            background: "#1e1e2f",
            color: "#d1d5db",
            border: "1px solid #333",
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleForgetPassword = () => {};

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen min-w-screen flex items-center justify-center bg-base-300 p-4"
      data-theme="sunset"
    >
      <div className="flex flex-col md:flex-row bg-base-200 rounded-xl shadow-lg overflow-hidden border-1 border-base-content/20 max-w-3xl w-full">
        {/* Image Section */}
        <div className="hidden bg-base-content/5 md:flex items-center justify-center w-1/2 p-8">
          <img
            src={signupImage}
            alt="Sign up illustration"
            className="rounded-lg object-cover h-72 w-full"
          />
        </div>

        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-center p-8 w-full">
          <form
            className="space-y-6"
            onSubmit={handleSignUp}
            autoComplete="off"
          >
            <div>
              <div className="flex text-violet-50 items-center gap-1 text-left">
                <AudioWaveform className="w-7 h-7 mb-2" />
                <h2 className="text-2xl font-semibold text-left mb-2">
                  Whispr.
                </h2>
              </div>
              <h2 className="text-[1.12rem] mt-1 text-left text-gray-200">
                Welcome Back
              </h2>
              <p className="text-sm text-left font-light text-gray-400 mb-6">
                Sign in to your account to continue.
              </p>
            </div>
            {/* Email */}
            <label className="p-2 rounded-lg focus:outline-none pl-3 border-1 border-base-content/20 flex items-center gap-2 bg-base-100 w-full ">
              <Mail className="w-5 h-5 text-[#7cdc96]" />
              <input
                type="email"
                className="grow text-emerald-50/90 !bg-transparent text-sm autofill:!bg-transparent focus:outline-none w-full"
                placeholder="Email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </label>

            {/* Password */}
            <label className="p-2 rounded-lg focus:outline-none pl-3 border-1 border-base-content/20 flex items-center gap-2 bg-base-100 w-full">
              <Lock className="w-5 h-5 text-[#7cdc96]" />
              <input
                type={showPassword ? "text" : "password"}
                className="grow text-emerald-50/90 !bg-transparent text-sm autofill:!bg-transparent focus:outline-none w-full"
                placeholder="Password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#7cdc96]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#7cdc96]" />
                )}
              </button>
            </label>

            <button
              className="mt-[-10px] mb-0 w-fit h-fit"
              onClick={handleForgetPassword}
            >
              <Link 
              to="/forget-password"
              className="cursor-pointer text-sm text-gray-300/90 hover:text-gray-200 hover:underline">
                Forget Password?
              </Link>
            </button>
            {/* Error Message
            {error && (
              <div className="flex items-center text-red-400/80 font-normal italic text-left mb-1">
                <ShieldAlert className="w-5 h-5 mr-1" />
                <span>{error.response.data.message}</span>
              </div>
            )} */}
            <button
              className="btn bg-[#6ee38d] hover:bg-[#8affa9] text-black text-[1.020rem] font-semibold w-full mt-4"
              type="submit"
            >
              {isPending ? (
                <span className="loading loading-dots"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="text-center mt-4 text-sm">
            <span className="text-base-content/70">
              Don't have an account?{" "}
            </span>
            <a href="/signup" className="text-[#7cdc96] italic underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
