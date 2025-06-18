import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../lib/api";
import ResetSuccess from "./ResetSuccess";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    mutate: doResetPassword,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({ token, password }) => resetPassword(token, password),
    onSuccess: () => {
    setTimeout(() => navigate("/login"), 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    doResetPassword({ token, password: newPassword });
  };

  return (
    <>
      {isSuccess ? (
        <ResetSuccess />
      ) : (
        <div className="w-full max-w-[29rem] mx-auto bg-base-100 p-8 rounded-xl shadow">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-700/90 p-3 rounded-full mb-5">
              <ShieldCheck className="w-7 h-7 text-emerald-50 text-center" />
            </div>
            <h2 className="text-2xl text-emerald-50 font-bold mb-2">
              Reset your password
            </h2>
            <p className="text-emerald-50/60 text-sm text-center mb-2">
              Choose a strong password to secure your account.
            </p>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <label
              htmlFor="newPassword"
              className="block text-emerald-50/90 font-semibold mb-2"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              className="border-2 border-base-content/10 text-sm text-emerald-50/80 bg-base-content/5 p-[0.55rem] focus:outline-none rounded-md w-full mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label
              htmlFor="confirmPassword"
              className="block text-emerald-50/90 font-semibold"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              className="border-2 border-base-content/10 text-sm text-emerald-50/80 bg-base-content/5 p-[0.55rem] focus:outline-none rounded-md w-full mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {/* {
            newPassword === confirmPassword ? (
                <span className="text-sm text-green-500">Password match</span>
            ) : (
                <span></span>
            )
        } */}
            {error && (
              <div className="text-red-400 mb-2 text-sm">
                {error.response?.data?.message || "Something went wrong."}
              </div>
            )}
            <button
              type="submit"
              className={`btn w-full ${
                newPassword && confirmPassword
                  ? "bg-blue-700/90 text-emerald-50"
                  : "bg-blue-700/45 text-emerald-50/45"
              }`}
              disabled={isPending}
            >
              {isPending ? <span className="loading loading-spinner"></span> : "Reset Password"}
            </button>
          </form>
          <div className="divider mt-7 mb-2" />
          <div className="text-center text-gray-500">
            <span>Remember your password? </span>
            <Link
              to="/login"
              className="text-blue-500/80 hover:text-blue-300 hover:underline"
            >
              Sign in here
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPasswordForm;
