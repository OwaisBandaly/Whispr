import toast from "react-hot-toast";
import { MailCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export const showVerifyEmailToast = (userEmail) => {
  toast.custom((t) => (
    <div
      className={`max-w-md w-full bg-base-200 text-base-content border border-base-300 shadow-lg rounded-lg px-4 py-3 flex items-start gap-3 transition-all ${
        t.visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <MailCheck className="w-6 h-6 text-green-500 mt-1" />
      <div>
        <p className="font-medium">Verify your account</p>
        <p className="text-sm">
          Link sent to{" "}
          <a
            href={getInboxLink(userEmail)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-500"
          >
            {userEmail}
          </a>
        </p>
      </div>
      <button
        className="ml-auto text-xl font-bold text-neutral-500 hover:text-neutral-300"
        onClick={() => toast.dismiss(t.id)}
      >
        ×
      </button>
    </div>
  ));
};

const getInboxLink = (email) => {
  if (email.includes("gmail.com")) return "https://mail.google.com/";
  if (email.includes("outlook.com") || email.includes("hotmail.com"))
    return "https://outlook.live.com/";
  if (email.includes("yahoo.com")) return "https://mail.yahoo.com/";
  return "https://mail.google.com/"; // fallback
};

/**
 *
 * @param {string} message
 */
export const showSuccessToast = (message) => {
  toast.custom((t) => (
    <div
      className={`max-w-md w-full bg-base-200 text-base-content border border-base-300 shadow-lg rounded-lg px-4 py-3 flex items-start gap-3 transition-all ${
        t.visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <CheckCircle2 className="w-6 h-6 text-green-400 mt-1" />
      <div>
        <p className="font-semibold">Success</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  ));
};

/**
 *
 * @param {string} message
 */
export const showErrorToast = (message) => {
  toast.custom((t) => (
    <div
      className={`max-w-sm w-full bg-base-200 text-base-content border border-base-content shadow-lg rounded-lg px-4 py-3 flex items-start gap-3 transition-all ${
        t.visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
      <div>
        <p className="font-semibold text-red-500">Error</p>
        <p className="text-sm text-base-content">{message}</p>
      </div>
    </div>
  ));
};
