import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";
import Searchbar from "./Search";
import UserControl from "./UserControl";
import CartIcon from "./CartIcon";


export default function Navbar() {


  return (
    <div className="shadow-lg">
      <div className="flex max-w-[1400px] px-5 m-auto justify-between lg:justify-center items-center gap-5">
        <Link href={ROUTES.HOME}>
          <div className="relative w-[75px] h-[75px] transition-all duration-300 ">
            <Image
              src="/cura-logo.webp"
              alt="Logo"
              fill
              sizes="70px"
              className="object-contain"
              loading="eager"
            />
          </div>

        </Link>

        <div className="flex justify-between lg:justify-between items-center lg:flex-1 gap-5">
          <div className="flex-1 hidden lg:flex">
            <Searchbar />
          </div>
          {/* <div className="hidden lg:flex">
            <LangToggle />
          </div> */}

          
          <CartIcon />
          <UserControl />
          

        </div>
      </div>
      <div className="flex lg:hidden py-2.5 border-t border-gray-100 ">
        <Searchbar />
      </div>
    </div>
  );
}
