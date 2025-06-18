import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

export const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  return {
    isLoading: authUser.isLoading,
    userData: authUser.data?.data,
    isVerified: authUser.data?.data.isVerified,
    isOnboarded: authUser.data?.data.isOnboarded,
  };
};

export default useAuthUser;
