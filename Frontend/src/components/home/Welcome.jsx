import useThemeStore from "../../store/useThemeStore";



const Welcome = ({ userData, friends }) => {

  const {theme} = useThemeStore();

  return (
    <div className="mb-6">
    <div className={`flex justify-between items-center rounded-xl p-6 bg-gradient-to-r from-[#0f0c29] via-[#302b6370] to-[#24243e] shad#f64f59ow-lg`}>
      <div className="flex flex-col align-middle">
        <h1 className={`text-2xl font-medium text-violet-50 drop-shadow`}>
          Welcome back, <span className="font-bold">{userData?.fullName.split(" ",1) || "User"}!</span>
        </h1>
        <p className="text-violet-50 text-sm font-medium">
          Discover new friends and stay connected
        </p>
      </div>
      <div className="md:flex hidden flex-col md:items-center">
        <p className="text-3xl font-bold text-violet-50">{friends.length}</p>
        <p className="text-violet-50 font-semibold">Friends Online</p>
      </div>
    </div>
  </div>
  )
}
export default Welcome;