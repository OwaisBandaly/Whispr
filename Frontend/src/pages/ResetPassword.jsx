import { useParams } from "react-router-dom";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";


const ResetPassword = () => {
  const { token } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-base-200">
      {!token ? (
        <ForgotPasswordForm />
      ) : (
        <ResetPasswordForm />
      )}
    </div>
  );
};

export default ResetPassword;