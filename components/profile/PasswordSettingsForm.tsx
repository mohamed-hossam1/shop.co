"use client";

import { useFormik } from "formik";
import { useTransition } from "react";
import { UpdateUserPassword } from "@/actions/userAction";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const InputField = ({
  id,
  label,
  type = "password",
  placeholder,
  formik,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  formik: any;
}) => (
  <div className="w-full">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-primary mb-2"
    >
      {label}
    </label>
    <input
      id={id}
      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-prring-primary transition-all duration-300 ${
        formik.touched[id as keyof typeof formik.values] &&
        formik.errors[id as keyof typeof formik.values] &&
        "border-red-500"
      }`}
      placeholder={placeholder}
      type={type}
      name={id}
      value={formik.values[id as keyof typeof formik.values]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
    <div className="text-red-500 mt-2">
      {formik.touched[id as keyof typeof formik.values] &&
        formik.errors[id as keyof typeof formik.values]}
    </div>
  </div>
);

export default function PasswordSettingsForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    startTransition(async () => {
      const { error } = await UpdateUserPassword(values);

      if (error) {
      } else {
        router.replace(ROUTES.SIGNIN);
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) =>
      onSubmit({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }),
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-xl font-bold text-primary mb-6">Change Password</h2>
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="oldPassword"
            label="Current Password"
            placeholder="Enter your current password"
            formik={formik}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="newPassword"
            label="New Password"
            placeholder="Enter your new password"
            formik={formik}
          />
          <InputField
            id="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            formik={formik}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className={`bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#394867]  flex gap-2 justify-center items-center text-white py-3 px-6 rounded-xl font-semibold  transition-all duration-500 shadow-lg hover:shadow-xl ${
              isPending
                ? "bg-primary/70 hover:bg-primary/70 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={isPending || !formik.dirty || !formik.isValid}
          >
            {isPending ? (
              <div className="h-5 w-5 border-b-2 border-current rounded-full animate-spin"></div>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
