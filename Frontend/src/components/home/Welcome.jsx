import useThemeStore from "../../store/useThemeStore";



const Welcome = ({ userData, friends }) => {

  const {theme} = useThemeStore();

  return (
    <div className="mb-6">
    <div className={`flex justify-between items-center rounded-xl p-6 bg-gradient-to-r from-[#0f0c29] via-[#302b6370] to-[#24243ec1]`}>
      <div className="flex flex-col align-middle">
        <h1 className={`md:text-[1.7rem] text-lg font-light text-violet-50 drop-shadow`}>
          Welcome back, <span className="font-normal">{userData?.fullName.split(" ",1) || "User"}!</span>
        </h1>
        <p className="text-violet-50 text-xs md:text-lg font-extralight">
          Discover new friends and stay connected.
        </p>
      </div>
      <div className="md:flex hidden flex-col md:items-center">
        <p className="text-3xl text-green-50">{friends.length}</p>
        <p className="text-green-50">Friends Online</p>
      </div>
    </div>
  </div>
  )
}
export default Welcome;