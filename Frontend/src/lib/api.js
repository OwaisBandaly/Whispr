import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const res = await axiosInstance.post("/auth/signup", signupData);
  return res.data;
};

export const logIn = async (loginData) => { 
  const res = await axiosInstance.post("/auth/login", loginData);
  return res.data;
};

export const forgetPassword = async (email) => {
  const res = await axiosInstance.post("/auth/forget-password", {email});
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await axiosInstance.post(`/auth/reset-password/${token}`, {password});
  return res.data; 
};

export const logOut = async () => {
  const res = await axiosInstance.patch("/auth/logout");
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    return null;
  }
};

export const onboard = async (onboardData) => {
  const res = await axiosInstance.post("/auth/onboarding", onboardData);
  return res.data;
};

export const getSearchedUsers = async (findUser) => {
  const res = await axiosInstance.get("/user/search", {
    params: { query: findUser },
  });
  return res.data;
};

export const getSuggestFriends = async () => {
  const res = await axiosInstance.get("/user/suggest-friends");
  return res.data;
};

export const getMyFriends = async () => {
  const res = await axiosInstance.get("/user/my-friends");
  return res.data;
};

export const getAllRequests = async () => {
  const res = await axiosInstance.get("/user/requests");
  return {
    pendingRequest: res.data?.pendingRequest,
    notAcceptedRequest: res.data?.notAcceptedRequest,
    acceptedRequest: res.data?.acceptedRequest,
  };
};

export const sendFriendRequest = async (id) => {
  const res = await axiosInstance.post(`/user/request/${id}/send`);
  return res.data;
};

export const acceptFriendRequest = async (id) => {
  const res = await axiosInstance.put(`/user/request/${id}/accept`);
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chat/token")
  return res.data;
}
