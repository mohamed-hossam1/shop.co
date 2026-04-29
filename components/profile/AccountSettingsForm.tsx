"use client";

import { useFormik } from "formik";
import { useTransition, useState } from "react";
import { UpdateUserProfile } from "@/actions/userAction";
import * as Yup from "yup";
import { useUser } from "@/stores/userStore";
import Toast from "@/components/ui/Toast";

interface AccountSettingsFormProps {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
});

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  disabled = false,
  formik, 
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  disabled?: boolean;
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
      } ${disabled ? "bg-black/5 cursor-not-allowed text-black/40 border-transparent" : ""}`}
      placeholder={placeholder}
      type={type}
      name={id}
      value={formik.values[id]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      disabled={disabled}
    />
    {formik.touched[id] && formik.errors[id] && (
      <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">
        {formik.errors[id]}
      </div>
    )}
  </div>
);

export default function AccountSettingsForm({
  initialName,
  initialEmail,
  initialPhone,
}: AccountSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const { updateUser } = useUser();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const onSubmit = async (values: {
    name: string;
    email: string;
    phone: string;
  }) => {
    startTransition(async () => {
      const res = await UpdateUserProfile(values);

      if (!res.success) {
        setToast({ message: res.message || "Failed to update profile", type: "error" });
      } else {
        updateUser({
          name: values.name,
          phone: values.phone,
          email: values.email,
        });
        setToast({ message: "Profile updated successfully", type: "success" });
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      name: initialName,
      email: initialEmail,
      phone: initialPhone,
    },
    validationSchema: validationSchema,
    onSubmit,
  });

  return (
    <div className="bg-white border border-black p-8 sm:p-12 font-satoshi relative overflow-hidden">
      <div className="mb-10">
        <h2 className="text-2xl font-black font-integral uppercase tracking-wider text-black">
          Account Details
        </h2>
        <div className="h-1 w-12 bg-black mt-2" />
      </div>

      <form className="space-y-8" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            id="name"
            label="Full Name"
            placeholder="John Doe"
            formik={formik} 
          />
          <InputField
            id="email"
            label="Email Address"
            placeholder="email@example.com"
            disabled={true}
            formik={formik} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="01xxxxxxxxx"
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
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
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
