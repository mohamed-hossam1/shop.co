import AuthForm from "@/components/forms/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Cura Store",
  description:
    "Sign in to your Cura account to manage your orders, addresses, and more.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/sign-in",
  },
};

export default function SignIn() {
  return <AuthForm fromType="Sign In" />;
}
