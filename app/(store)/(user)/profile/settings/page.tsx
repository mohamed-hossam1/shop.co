import { GetUser } from "@/actions/userAction";
import AccountSettingsForm from "@/components/profile/AccountSettingsForm";
import { redirect } from "next/navigation";
import ROUTES from "@/constants/routes";
import PasswordSettingsForm from "@/components/profile/PasswordSettingsForm";

export default async function page() {
  const user = await GetUser();

  if (!user) {
    redirect(ROUTES.SIGNIN);
  }

  const initialName = user.name || "";
  const initialEmail = user.email || "";
  const initialPhone = user.phone || "";

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Settings</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full" />
        </div>

        <div className="space-y-6">
          <AccountSettingsForm
            initialName={initialName}
            initialEmail={initialEmail}
            initialPhone={initialPhone}
          />
          <PasswordSettingsForm />
        </div>
      </div>
    </div>
  );
}
