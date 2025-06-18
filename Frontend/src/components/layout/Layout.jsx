import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="w-screen flex bg-base-300 ">
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;