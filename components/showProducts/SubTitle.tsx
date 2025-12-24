import ROUTES from "@/constants/routes";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SubTitleProp {
  categoryTitle: string;
  categoryImage: string;
  categoryId: number
}

export default function SubTitle({categoryTitle, categoryImage, categoryId}: SubTitleProp) {
  
  return (
    <div className="flex justify-between text-gray-800 relative mb-6">
      <div>
        <div className="flex gap-2 items-center">
          {/* <Image
            src={categoryImage}
            alt={categoryTitle}
            width={56}
            height={56}
            className="w-14 rounded-full h-14"
          /> */}
          <h2 className="md:text-2xl text-xl font-bold">{categoryTitle}</h2>
        </div>
      </div>
      <div>
        {/* <div>
          <Link href={{pathname:ROUTES.PRODUCTS,query:{"category":`${categoryId}`}}} className="flex items-center">
            <p className="text-lg text-primary font-bold">Show All</p>
            <ChevronRight className="text-primary font-bold w-10 " size={25} />
          </Link>
        </div> */}
      </div>
      <div className="border-gray-300 w-full absolute bottom-[1px] -z-10"></div>
    </div>
  );
}
