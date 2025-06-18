import { MapPin, CircleUser , UserPlus, Check } from "lucide-react";
import { useState } from "react";
import userPng from "../../../public/user.png" 
import useThemeStore from "../../store/useThemeStore";

const DiscoverCard = ({
  person,
  onSendRequest,
  loading,
  isRequested,
  canAccept,
  onAcceptRequest,
  acceptLoading,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const {theme} = useThemeStore();

  return (
    <div className={`flex items-center gap-3 rounded-lg p-3 border border-neutral-700
   ${theme === "sunset" ? "text-violet-50": "text-[#0f0c29]"}
    `}>
      <div className="relative w-12 h-12 rounded-full ">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-700/40 rounded-full">
            <span className="loading loading-ring loading-xl w-4 h-4"></span>
          </div>
        )}
        <img
          src={!imgError ? person.profilePic : userPng}
          loading="eager"
          alt={person.username}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`w-12 h-12 rounded-full object-cover border-2 border-[#4c504d96] transition-opacity duration-300`}
        />
      </div>

      <div className="flex-1">
        <h1 className="font-medium text-[1.1rem]">
          {person.fullName}
        </h1>
        {person.location && (
          <div className="flex items-center gap-1 text-base-content/85 text-sm">
            {person.age ? `${person.age} yrs` : ""}
            {person.age && person.location && " • "}
            {person.location}
          </div>
        )}
      </div>

      {canAccept ? (
        <button
          className="btn btn-md bg-green-800 text-emerald-50 flex items-center gap-1"
          onClick={onAcceptRequest}
          disabled={acceptLoading}
        >
          {acceptLoading ? (
            <span className="loading loading-spinner loading-md" />
          ) : (
            <>Accept</>
          )}
        </button>
      ) : (
        <button
          className={`btn btn-md bg-[#302b63] font-normal text-violet-50 flex items-center gap-1`}
          onClick={onSendRequest}
          disabled={loading || isRequested}
        >
          {isRequested ? (
            <>
              <Check className={`w-4 h-4 ${theme === "sunset" ? "text-violet-50" : "text-[#0f0c29]"}`} />
              <span className={`${theme === "sunset" ? "text-violet-50" : "text-[#0f0c29]"}`}>Requested</span>
            </>
          ) : loading ? (
            <span className="loading loading-spinner loading-md" />
          ) : ( 
            <>
              <UserPlus className="w-4 h-4" />
              Add
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default DiscoverCard;
