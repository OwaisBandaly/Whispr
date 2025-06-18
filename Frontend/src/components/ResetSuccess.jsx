import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const ResetSuccess = () => (
  <div className="w-full max-w-md mx-auto bg-base-100 p-8 rounded-xl shadow flex flex-col items-center">
    <div className="bg-green-600 animate-bounce p-2 rounded-full mb-5">
      <Check className="w-8 h-8 text-white" />
    </div>
    <h2 className="text-2xl font-bold text-emerald-50/90 mb-4 text-center">
      Password Reset Successful!
    </h2>
    <p className="text-gray-400 text-center mb-6">
      Your password has been successfully reset. You can now sign in with your new password.
    </p>
    <Link
      to=""
      className="btn bg-blue-700/90 text-white w-full font-semibold"
    >
      Redirecting
      <span className="loading loading-dots"></span>
    </Link>
  </div>
);

export default ResetSuccess;