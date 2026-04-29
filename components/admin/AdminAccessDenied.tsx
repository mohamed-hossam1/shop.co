import Link from "next/link";

import ROUTES from "@/constants/routes";

export default function AdminAccessDenied({
  userName,
}: {
  userName?: string | null;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ee_0%,#ffffff_100%)] px-4 py-12 font-satoshi">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full border border-black bg-white p-8 sm:p-12">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-black/45">
            Admin Console
          </p>
          <h1 className="mt-4 font-integral text-3xl font-black uppercase tracking-[0.08em] text-black sm:text-5xl">
            Access Denied
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-black/65 sm:text-base">
            {userName
              ? `${userName}, your account is signed in but does not have admin privileges.`
              : "Your account does not have admin privileges."}{" "}
            Ask an existing administrator to update your role in the `users` table before returning to `/admin`.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ROUTES.HOME}
              className="border border-black bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
            >
              Back To Store
            </Link>
            <Link
              href={ROUTES.PROFILE}
              className="border border-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
