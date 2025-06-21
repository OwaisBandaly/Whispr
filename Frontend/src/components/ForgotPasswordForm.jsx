import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgetPassword } from "../lib/api";
import { showVerifyEmailToast } from "../utils/toastUtils";
import ForgotSuccess from "./ForgotSuccess";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  // const [isSuccess, setIsSuccess] = useState(false)
  const {
    mutate: sendResetLink,
    isPending,
    error,
    isSuccess
  } = useMutation({
    mutationFn: forgetPassword,
    onSuccess: () => {
      // setIsSuccess(true);
    } 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendResetLink(email);
  };

  return (
    <>
    {
      isSuccess ? (
        <ForgotSuccess email={email} />
      ) : (
        <div className="w-fit mx-2 md:max-w-[29rem] md:mx-auto bg-base-100 p-8 rounded-xl shadow">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-blue-700/90 p-3 rounded-full mb-5">
        <Mail className="w-7 h-7 text-emerald-50 text-center" />
        </div>
        <h2 className="text-2xl text-emerald-50 font-bold mb-2">Forgot Password?</h2>
        <p className="text-emerald-50/60 text-sm text-center mb-2">
          No worries! Enter your email address and we'll send you a reset link.
        </p>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="email" className="block text-emerald-50/90 font-semibold mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email address"
          className="border-2 border-base-content/10 text-sm text-emerald-50/80 bg-base-content/5 p-[0.55rem] focus:outline-none rounded-md w-full mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {error && (
          <div className="text-red-600 mb-2 text-sm">
            {error.response?.data?.message || "Something went wrong."}
          </div>
        )}
        <button
          type="submit"
          className={`btn w-full ${email.length ? "bg-blue-700/90 text-emerald-50" : "bg-blue-700/45 text-emerald-50/45"}`}
          disabled={isPending}
        >
          {isPending ? <span className="loading loading-spinner"></span> : "Send Reset Link"}
        </button>
      </form>
      <div className="flex justify-center items-center mt-6">
        <Link to="/login" className="flex items-center text-gray-500 hover:text-gray-300">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to login
        </Link>
      </div>
      <div className="divider mt-7 mb-2" />
      <div className="text-center text-gray-500">
        <span>Don't have an account? </span>
        <Link to="/signup" className="text-blue-500/80 hover:text-blue-300 hover:underline">
          Sign up here
        </Link>
      </div>
    </div>
      )
    }
    
    </>
  );
};

export default ForgotPasswordForm;