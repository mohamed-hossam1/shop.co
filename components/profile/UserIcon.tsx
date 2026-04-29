import { useUser } from "@/stores/userStore";

export default function UserIcon({ isExpanded }: { isExpanded: boolean }) {
  const { user: userData, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black/5 animate-pulse border border-black/10 shrink-0" />
        {isExpanded && (
          <div className="space-y-2">
            <div className="w-24 h-4 bg-black/5 animate-pulse" />
            <div className="w-32 h-3 bg-black/5 animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 font-satoshi">
      <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0 border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
        <span className="text-white text-xl font-black font-integral">
          {userData?.name?.[0] || "U"}
        </span>
      </div>
      
      {isExpanded && (
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-black text-black uppercase tracking-wider truncate">
            {userData?.name || "User"}
          </p>
          <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest truncate">
            {userData?.email}
          </p>
        </div>
      )}
    </div>
  );
}
