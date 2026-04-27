"use client";

import ROUTES from "@/constants/routes";
import Link from "next/link";
import { useFormik } from "formik";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  signInValidationSchema,
  signUpValidationSchema,
} from "@/lib/validation/authValidations";
import { GetUser, SignInSupabase, SignUpSupabase } from "@/actions/userAction";
import { useRouter } from "next/navigation";
import { useUser } from "@/stores/userStore";
import { useCart } from "@/stores/cartStore";

interface AuthFormProps {
  fromType: string;
}

interface UserData {
  name?: string;
  email: string;
  password: string;
  phone?: string;
}

export default function AuthForm({ fromType }: AuthFormProps) {
  const [apiError, setApiError] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useUser();
  const {initCart} = useCart()
  const router = useRouter()
  const schema =
    fromType == "Sign Up" ? signUpValidationSchema : signInValidationSchema;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: UserData) => {
    setApiError("");
    setIsPending(true);
    
    try {
      let errorMessage = "";
      
      if (fromType === "Sign Up") {
        const result = await SignUpSupabase(values);
        if (!result.success) errorMessage = result.message;
      } else {
        const result = await SignInSupabase(values);
        if (!result.success) errorMessage = result.message;
      }
      
      if (errorMessage) {
        setApiError(errorMessage);
        setIsPending(false);
        return;
      }
      
      const userRes = await GetUser();
      if (userRes.success && userRes.data) {
        updateUser(userRes.data);
        try {
          await initCart();
        } catch (cartError) {
          console.error("Cart initialization error:", cartError);
        }
        router.replace(ROUTES.HOME);
      } else {
        setApiError(userRes.success === false ? userRes.message : "Failed to get user profile");
        setIsPending(false);
      }
      
    } catch (error) {
      console.error("Auth error:", error);
      setApiError(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsPending(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validationSchema: schema,
    onSubmit,
  });
  


  return (
    <div className="w-full">
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        {apiError && <div className="text-red-500 font-bold text-center text-sm"> {apiError}</div>}
        {fromType === "Sign Up" && (
          <div>
            <div className="relative">
              <input
                id="name"
                className={`w-full px-6 py-4 bg-[#F0F0F0] border-none font-satoshi rounded-full focus:outline-none focus:ring-1 focus:ring-black/20 transition-all duration-300 placeholder:text-gray-500 ${
                  formik.touched.name && formik.errors.name ? "ring-1 ring-red-500 bg-red-50" : ""
                }`}
                placeholder="Full Name"
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="text-red-500 text-xs px-4 mt-1 font-medium">
                {formik.touched.name && formik.errors.name}
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="relative">
            <input
              id="email"
              className={`w-full px-6 py-4 bg-[#F0F0F0] border-none font-satoshi rounded-full focus:outline-none focus:ring-1 focus:ring-black/20 transition-all duration-300 placeholder:text-gray-500 ${
                formik.touched.email && formik.errors.email ? "ring-1 ring-red-500 bg-red-50" : ""
              }`}
              placeholder="Email Address"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="text-red-500 text-xs px-4 mt-1 font-medium">
              {formik.touched.email && formik.errors.email}
            </div>
          </div>
        </div>

        <div className="relative">
          <input
            id="password"
            className={`w-full px-6 py-4 bg-[#F0F0F0] border-none font-satoshi rounded-full focus:outline-none focus:ring-1 focus:ring-black/20 transition-all duration-300 placeholder:text-gray-500 ${
              formik.touched.password && formik.errors.password ? "ring-1 ring-red-500 bg-red-50" : ""
            }`}
            placeholder={`${
              fromType === "Sign Up" ? "Create Password" : "Password"
            }`}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-5 top-4 text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
          <div className="text-red-500 text-xs px-4 mt-1 font-medium">
            {formik.touched.password && formik.errors.password}
          </div>
        </div>

        {fromType === "Sign Up" && (
          <div>
            <div className="relative">
              <input
                id="phone"
                className={`w-full px-6 py-4 bg-[#F0F0F0] border-none font-satoshi rounded-full focus:outline-none focus:ring-1 focus:ring-black/20 transition-all duration-300 placeholder:text-gray-500 ${
                  formik.touched.phone && formik.errors.phone ? "ring-1 ring-red-500 bg-red-50" : ""
                }`}
                placeholder="Phone Number (Optional)"
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="text-red-500 text-xs px-4 mt-1 font-medium">
                {formik.touched.phone && formik.errors.phone}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-black text-white py-4 px-4 rounded-full font-bold font-satoshi hover:bg-black/80 transition-all duration-300 flex justify-center items-center mt-4 ${
            isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isPending ? (
            <div className="h-6 w-6 border-b-2 border-white rounded-full animate-spin"></div>
          ) : (
            `${fromType === "Sign Up" ? "Create Account" : "Sign In"}`
          )}
        </button>
      </form>

      <div className="mt-8 text-center font-satoshi text-sm text-gray-500">
        <p>
          {fromType === "Sign Up"
            ? "Already have an account? "
            : "Don't have an account? "}
          <Link
            className="text-black hover:underline font-bold transition-all duration-300"
            href={fromType === "Sign Up" ? ROUTES.SIGNIN : ROUTES.SIGNUP}
          >
            {fromType === "Sign Up" ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
}
