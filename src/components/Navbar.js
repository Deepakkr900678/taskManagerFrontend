import { HiOutlineLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    const con = window.confirm('Are you sure you want to logOut?');
    if (con) {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }
  return (
    <div className="sticky top-0 z-20">
      <div className="pt-0 pr-0 pb-0 pl-0 mt-0 mr-0 mb-0 ml-0"></div>
      <div className="bg-white">
        <div className="flex-col flex">
          <div className="w-full shadow-sm">
            <div className="bg-white h-16 justify-between items-center mx-auto px-4 flex">
              <Link
                to={"/"}
                className="flex  xl:ml-0 ml-7 justify-center gap-0 items-center"
              >
                <p className="text-lg font-inter font-semibold hidden sm:block">
                  Task Manager
                </p>
              </Link>
              <div className="md:space-x-6 justify-center items-center ml-auto  space-x-3 flex ">

                <div className="justify-center items-center flex relative gap-3">
                  <button
                    className="px-3 py-2 bg-gray-800 text-white rounded flex flex-row-reverse justify-center items-center gap-2"
                    onClick={() => {
                      handleLogout()
                    }}
                  >
                    Log-Out
                    <HiOutlineLogout size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
