"use client";

import { useFormik } from "formik";
import { useTransition, useState } from "react";
import { UpdateUserPassword } from "@/actions/userAction";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import Toast from "@/components/ui/Toast";

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
  <div className="w-full space-y-2">
    <label htmlFor={id} className="text-[10px] uppercase font-black text-black/40 tracking-[0.2em] block">
      {label}
    </label>
    <input
      id={id}
      className={`w-full px-4 py-4 border border-black/10 font-bold text-black focus:border-black outline-none transition-all duration-300 placeholder:text-black/20 ${
        formik.touched[id] && formik.errors[id] ? "border-red-500" : ""
      }`}
      placeholder={placeholder}
      type={type}
      name={id}
      value={formik.values[id]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
    {formik.touched[id] && formik.errors[id] && (
      <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">
        {formik.errors[id]}
      </div>
    )}
  </div>
);

export default function PasswordSettingsForm() {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const onSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    startTransition(async () => {
      const res = await UpdateUserPassword(values);

      if (!res.success) {
        setToast({ message: res.message || "Failed to update password", type: "error" });
      } else {
        setToast({ message: "Password updated! Redirecting to sign in...", type: "success" });
        setTimeout(() => {
          router.replace(ROUTES.SIGNIN);
        }, 2000);
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
    <div className="bg-white border border-black p-8 sm:p-12 font-satoshi relative overflow-hidden">
      <div className="mb-10">
        <h2 className="text-2xl font-black font-integral uppercase tracking-wider text-black">
          Security
        </h2>
        <div className="h-1 w-12 bg-black mt-2" />
        <p className="text-black/40 text-xs mt-4 font-bold uppercase tracking-widest">Update your login password</p>
      </div>

      <form className="space-y-8" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            id="oldPassword"
            label="Current Password"
            placeholder="••••••••"
            formik={formik}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            id="newPassword"
            label="New Password"
            placeholder="••••••••"
            formik={formik}
          />
          <InputField
            id="confirmPassword"
            label="Confirm New Password"
            placeholder="••••••••"
            formik={formik}
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-black/5">
          <button
            type="submit"
            className={`px-10 py-4 bg-black text-white text-xs font-black uppercase tracking-[0.2em] border border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isPending || !formik.dirty || !formik.isValid}
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin group-hover:border-black"></div>
                <span>Updating...</span>
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={!!toast}
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
