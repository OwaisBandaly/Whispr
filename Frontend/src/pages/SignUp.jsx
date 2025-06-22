import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MessageCircle,
  ShieldUser,
  LoaderCircle,
  AudioWaveform,
} from "lucide-react";
import signupImage from "../../public/signup.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import { showVerifyEmailToast } from "../utils/toastUtils";

const SignUp = () => {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: signupMutation, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      showVerifyEmailToast(signupData?.email);
    },
  });

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="min-h-screen min-w-screen flex items-center justify-center bg-base-300 p-4"
      data-theme="sunset"
    >
      <div className="flex flex-col md:flex-row bg-base-200 rounded-xl shadow-lg overflow-hidden border-1 border-base-content/20 max-w-3xl w-full">
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
              <h2 className="text-lg mt-1 text-left text-gray-200">
                Create an Account
              </h2>
              <p className="text-sm font-light text-left text-gray-400 mb-6">
                Enter your details to create your account.
              </p>
            </div>
            {/* Username */}
            <label className="p-2 rounded-lg focus:outline-none pl-3 flex border-1 border-base-content/20 items-center gap-2 bg-base-100 w-full ">
              <User className="w-5 h-5 text-[#7cdc96c7]" />
              <input
                type="text"
                className="grow text-emerald-50/90 text-sm !bg-transparent autofill:!bg-transparent focus:outline-none w-full"
                placeholder="Username"
                name="username"
                value={signupData.username}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </label>

            {/* Email */}
            <label className="p-2 rounded-lg focus:outline-none pl-3 border-1 border-base-content/20 flex items-center gap-2 bg-base-100 w-full ">
              <Mail className="w-5 h-5 text-[#7cdc96d1]" />
              <input
                type="email"
                className="grow text-emerald-50/90 text-sm !bg-transparent autofill:!bg-transparent focus:outline-none w-full"
                placeholder="Email"
                name="email"
                value={signupData.email}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </label>

            {/* Password */}
            <label className="p-2 rounded-lg focus:outline-none pl-3 border-1 border-base-content/20 flex items-center gap-2 bg-base-100 w-full">
              <Lock className="w-5 h-5 text-[#7cdc96c8]" />
              <input
                type={showPassword ? "text" : "password"}
                className="grow text-emerald-50/90 text-sm !bg-transparent autofill:!bg-transparent focus:outline-none w-full"
                placeholder="Password"
                name="password"
                value={signupData.password}
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
                  <EyeOff className="w-5 h-5 text-[#7cdc96ad]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#7cdc96ac]" />
                )}
              </button>
            </label>
            {/* Error Message */}
            {error && (
              <div className="flex items-center text-red-400/80 font-normal italic text-left mb-1">
                <ShieldUser className="w-5 h-5 mr-1" />
                <span className="text-sm">{error.response.data.message}</span>
              </div>
            )}
            <button
              className="btn bg-[#7cdc96] hover:bg-[#80ca94] text-black text-[1.001rem] font-bold w-full mt-4"
              type="submit"
            >
              {isPending ? (
                <span className="flex justify-center items-center gap-2">
                  <LoaderCircle className="animate-spin" />
                  Creating your Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center mt-4 text-sm">
            <span className="text-base-content/70">
              Already have an account?{" "}
            </span>
            <a href="/login" className="text-[#7cdc96] italic underline">
              Sign in
            </a>
          </div>
        </div>
        {/* Image Section */}
        <div className="hidden bg-base-content/5 md:flex items-center justify-center w-1/2 p-8">
          <img
            src={signupImage}
            alt="Sign up illustration"
            className="rounded-lg object-cover h-72 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
