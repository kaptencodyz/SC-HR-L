import Link from "next/link";

const NavBar = () => {
  return (
    <div className="bg-primary flex flex-col justify-center w-full fixed top-0 shadow-[0_5px_50px_40px_rgba(0,0,0,0.8)] m-0 pt-0">
      <div className="flex flex-row w-full justify-center">
        <p className="text-textColor text-3xl mt-2">Star Citizen HR Logistics</p>
      </div>
      <div className="flex flex-row w-full justify-center">
        <div className="h-10 w-2/5 mt-2 flex justify-between">
          <Link className="bg-contrast w-1/5 flex justify-center items-center" href="">Job list</Link>
          <Link className="bg-contrast w-1/5" href="">Enlisted jobs</Link>
          <Link className="bg-contrast w-1/5" href="">Create Job</Link>
          <Link className="bg-contrast w-1/5" href="">Support</Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;