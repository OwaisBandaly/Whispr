import { ArrowBigLeft, Check, MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotSuccess = ({ email }) => (
  <div className="w-full max-w-[29rem] mx-2 md:mx-auto bg-base-100 p-8 rounded-xl shadow flex flex-col items-center">
    <div className="bg-green-600 animate-bounce p-2 rounded-full mb-3">
      <Check className="w-8 h-8  text-white" />
    </div>
    <h2 className="text-2xl font-bold text-emerald-50/90 mb-2 text-center">
      Check your email
    </h2>
    <p className="text-gray-400 text-center mb-5">
      We've sent a password reset link to <span className="text-gray-300 font-semibold">{email}</span>
    </p>
    <p className="text-gray-500 text-center mb-6">
      Didn't receive the email? Check your spam folder or try again in a few minutes.
    </p>
    <Link
      to="/forget-password"
      className="btn bg-base-300 hover:bg-base-200 border-1 border-base-content/30 text-white w-full font-semibold mb-3"
    >
      Try Different Email
    </Link>
    <Link
      to="/login"
      className="text-gray-500 flex items-center justify-center gap-2 hover:text-gray-300 font-semibold"
    >
     <MoveLeft className="w-4 " />
      Back to sign in
    </Link>
  </div>
);

export default ForgotSuccess;