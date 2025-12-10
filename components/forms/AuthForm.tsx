"use client";

import ROUTES from "@/constants/routes";
import Link from "next/link";
import { useFormik } from "formik";
import { useState, useTransition } from "react";
import {
  signInValidationSchema,
  signUpValidationSchema,
} from "@/lib/validation/authValidations";
import { GetUser, SignInSupabase, SignUpSupabase } from "@/app/actions/userAction";
import { useRouter } from "next/navigation";
import { useUser } from "@/Context/UserContext";

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
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useUser();
  const router = useRouter()
  const schema =
    fromType == "Sign Up" ? signUpValidationSchema : signInValidationSchema;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: UserData) => {
    setApiError("");
    startTransition(async () => {
      try {
        if (fromType == "Sign Up") {
          const { signUpError, addUserError } = await SignUpSupabase(values);

          if (signUpError) {
            setApiError(signUpError.message);
          } else if (addUserError) {
            setApiError(addUserError.message);
          } else {
            const user = await GetUser()
            updateUser(user)
            router.replace(ROUTES.HOME)
          }
        } else {
          const { signInError } = await SignInSupabase(values);
          if (signInError) {
            setApiError(signInError.message);
          }else {
            const user = await GetUser()
            updateUser(user)
            router.replace(ROUTES.HOME)
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setApiError(error.message);
        }
      }
    });
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
      {/* <div className="relative flex justify-center text-sm mt-6">
        <span className="px-2 bg-white text-gray-500">Or continue with</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            ></path>
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            ></path>
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            ></path>
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            ></path>
          </svg>
          Google
        </button>
        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
          </svg>
          Facebook
        </button>
      </div> */}

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
