import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Call from "./pages/Call.jsx";
import Onboard from "./pages/Onboard.jsx";
import Notifications from "./pages/Notifications.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/layout/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/layout/Layout.jsx";
import useThemeStore from "./store/useThemeStore.js";
import Friends from "./pages/Friends.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const App = () => {
  const { isLoading, isVerified, isOnboarded, userData } = useAuthUser();
  const isAuthenticated = Boolean(userData);

  const {theme} = useThemeStore();

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
          isAuthenticated ?
            isVerified ? (
              isOnboarded ? (
                <Layout showSidebar>
                  <Home />
                </Layout>
              ) : (
                <Navigate to="/onboard" />
              )
            ) : (
              <Navigate to="/signup" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboard"} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated || !isVerified ? (
              <SignUp />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboard"} />
            )
          }
        />

        {/* <Route
          path="/verify-email"
          element={!isVerified ? <VerifyEmail /> : <Navigate to={isOnboarded ? "/" : "/onboard"} />}
        /> */}

        <Route
          path="/onboard"
          element={
            isAuthenticated && isVerified && !isOnboarded ? (
              <Onboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/update-profile"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Onboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/chat"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/friends"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar>
                <Friends />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
       <Route
          path="/forget-password"
          element={
            !isAuthenticated  ? (
              <ResetPassword />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboard"} />
            )
          }
        />
       <Route
          path="/reset-password/:token"
          element={
            !isAuthenticated  ? (
              <ResetPassword />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboard"} />
            )
          }
        />

        <Route
          path="/call"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar>
                <Call />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
