"use client";

import ROUTES from "@/constants/routes";
import Link from "next/link";
import { useFormik } from "formik";
import { useState } from "react";
import {
  signInValidationSchema,
  signUpValidationSchema,
} from "@/lib/validation/authValidations";
import { GetUser, SignInSupabase, SignUpSupabase } from "@/app/actions/userAction";
import { useRouter } from "next/navigation";
import { useUser } from "@/Context/UserContext";
import { useCart } from "@/Context/CartContext";

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
      
      if (fromType == "Sign Up") {
        const { signUpError, addUserError } = await SignUpSupabase(values);
        
        if (signUpError) {
          errorMessage = signUpError.message;
        } else if (addUserError) {
          errorMessage = addUserError.message;
        }
      } else {
        const { signInError } = await SignInSupabase(values);
        if (signInError) {
          errorMessage = signInError.message;
        }
      }
      
      if (errorMessage) {
        setApiError(errorMessage);
        setIsPending(false);
        return;
      }
      
      const user = await GetUser();
      if (user) {
        updateUser(user);
        try {
          await initCart();
        } catch (cartError) {
          console.error("Cart initialization error:", cartError);
        }
        router.replace(ROUTES.HOME);
      } else {
        setApiError("Failed to get user profile");
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
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {apiError && <div className="text-red-500 font-bold"> {apiError}</div>}
        {fromType == "Sign Up" && (
          <div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-primary mb-2"
              >
                Name
              </label>
              <input
                id="name"
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-prring-primary transition-all duration-300 ${
                  formik.touched.name && formik.errors.name && "border-red-500"
                }`}
                placeholder="Enter your name"
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="text-red-500 mt-2">
                {formik.touched.name && formik.errors.name}
              </div>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-primary mb-2"
          >
            Email
          </label>
          <input
            id="email"
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-prring-primary transition-all duration-300 ${
              formik.touched.email && formik.errors.email && "border-red-500"
            }`}
            placeholder="Enter your email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="text-red-500 mt-2">
            {formik.touched.email && formik.errors.email}
          </div>
        </div>
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-primary mb-2"
          >
            Password
          </label>
          <input
            id="password"
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-prring-primary transition-all duration-300 ${
              formik.touched.password &&
              formik.errors.password &&
              "border-red-500"
            }`}
            placeholder={`${
              fromType == "Sign Up"
                ? "Create a password"
                : "Enter your password"
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
            className="absolute right-3 top-[47px] -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
          <div className="text-red-500 mt-2">
            {formik.touched.password && formik.errors.password}
          </div>
        </div>
        {fromType == "Sign Up" && (
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-primary mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-prring-primary transition-all duration-300 ${
                formik.touched.phone && formik.errors.phone && "border-red-500"
              }`}
              placeholder="Enter your phone number"
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="text-red-500 mt-2">
              {formik.touched.phone && formik.errors.phone}
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-primary flex gap-2 justify-center items-center text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-hover transition-all duration-500 shadow-lg hover:shadow-xl  ${
            isPending
              ? "bg-primary/70 hover:bg-primary/70 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {isPending ? (
            <div className="h-6 w-6 border-b-2 border-current rounded-full animate-spin"></div>
          ) : (
            `${fromType == "Sign Up" ? "Create Account" : "Sign In"}`
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p>
          {fromType == "Sign Up"
            ? "Already have an account? "
            : "Don't have an account? "}
          <Link
            className="text-primary hover:text-primary-hover font-semibold ml-1 transition-all duration-500"
            href={
              fromType == "Sign Up" ? `${ROUTES.SIGNIN}` : `${ROUTES.SIGNUP}`
            }
          >
            {fromType == "Sign Up" ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
}