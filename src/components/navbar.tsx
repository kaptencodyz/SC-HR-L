import Link from "next/link";

const NavBar = () => {
  return (
    <div className="bg-primary flex flex-col justify-center w-full fixed top-0 shadow-[0_5px_50px_40px_rgba(0,0,0,0.8)] m-0 pt-0">
      <div className="flex flex-row w-full justify-center">
        <p className="text-textColor text-3xl mt-2">Star Citizen HR Logistics</p>
      </div>
      <div className="flex flex-row w-full justify-center">
        <div className="h-10 w-2/5 mt-2 flex justify-between">
          <Link className="w-1/5 rounded-tl-2xl rounded-tr-2xl p-0.5 pb-0 bg-gradient-to-b from-contrast/70 to-primary" href="">
            <div className="bg-primary w-full h-full flex justify-center items-bottom rounded-tl-2xl rounded-tr-2xl">
              <div className="w-full h-full flex justify-center rounded-tl-2xl rounded-tr-2xl bg-gradient-to-b from-contrast/30 to-primary">
                <p className="flex items-center text-textColor">
                  Job list
                </p>
              </div>
            </div>
          </Link>

          <Link className="w-1/5 rounded-tl-2xl rounded-tr-2xl p-0.5 pb-0 hover:bg-gradient-to-b from-contrast/70 to-primary" href="">
            <div className="bg-primary w-full h-full flex justify-center items-bottom rounded-tl-2xl rounded-tr-2xl">
              <div className="w-full h-full flex justify-center rounded-tl-2xl rounded-tr-2xl active:bg-gradient-to-b from-contrast/30 to-primary">
                <p className="flex items-center text-textColor">
                  Enlisted jobs
                </p>
              </div>
            </div>
          </Link>

          <Link className="w-1/5 rounded-tl-2xl rounded-tr-2xl p-0.5 pb-0 hover:bg-gradient-to-b from-contrast/70 to-primary" href="">
            <div className="bg-primary w-full h-full flex justify-center items-bottom rounded-tl-2xl rounded-tr-2xl">
              <div className="w-full h-full flex justify-center rounded-tl-2xl rounded-tr-2xl active:bg-gradient-to-b from-contrast/30 to-primary">
                <p className="flex items-center text-textColor">
                  Create Job
                </p>
              </div>
            </div>
          </Link>

          <Link className="w-1/5 rounded-tl-2xl rounded-tr-2xl p-0.5 pb-0 hover:bg-gradient-to-b from-contrast/70 to-primary" href="">
            <div className="bg-primary w-full h-full flex justify-center items-bottom rounded-tl-2xl rounded-tr-2xl">
              <div className="w-full h-full flex justify-center rounded-tl-2xl rounded-tr-2xl active:bg-gradient-to-b from-contrast/30 to-primary">
                <p className="flex items-center text-textColor">
                  Support
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;