import { useUser } from "@/Context/UserContext";

export default function UserIcon({ isExpanded }: { isExpanded: boolean }) {
  const userContext = useUser();
  const userData = userContext.user;
  if (userContext.isLoading) {
    return (
      <div className="flex flex-row-reverse items-center gap-2 font-semibold ">
        <div className="hidden md:block">
          <p
            className={`${
              isExpanded ? "opacity-100 block" : "opacity-0 hidden"
            } transition-all duration-300 w-30 h-6 animate-pulse bg-gray-200 mb-2`}
          ></p>
          <p
            className={`${
              isExpanded ? "opacity-100 block" : "opacity-0 hidden"
            } transition-all duration-300 text-gray-500 bg-gray-200 w-45 h-6 animate-pulse text-sm`}
          ></p>
        </div>
        <div className="border-2 flex bg-gradient-to-r from-[#1F1F6F] to-[#14274E] items-center w-10 h-10 flex justify-center items-center rounded-full cursor-pointer border-primary transition-all duration-300">
          
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-row-reverse items-center gap-2 font-semibold">
      <div>
        {userData && (
          <p
            className={`${
              isExpanded ? "opacity-100 block" : "opacity-0 hidden"
            } transition-all duration-300 `}
          >
            {userData.name}
          </p>
        )}
        {userData && (
          <p
            className={`${
              isExpanded ? "opacity-100 block" : "opacity-0 hidden"
            } transition-all duration-300 text-gray-500 text-sm`}
          >
            {userData.email}
          </p>
        )}
      </div>
      <div className="border-2 flex bg-gradient-to-r from-[#1F1F6F] to-[#14274E]  items-center w-10 h-10 flex justify-center items-center rounded-full cursor-pointer border-primary transition-all duration-300">
        {userData && (
          <>
            <p className="text-white text-center w-5 cursor-pointer font-bold">
              {userData.name[0]}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
