import AuthForm from "@/components/forms/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Cura Store",
  description:
    "Create a new Cura account to start shopping premium organic beauty products.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/sign-up",
  },
};

export default function SignUp() {
  return <AuthForm fromType="Sign Up" />;
}
