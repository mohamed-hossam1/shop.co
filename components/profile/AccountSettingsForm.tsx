"use client";

import { useFormik } from "formik";
import { useTransition } from "react";
import { UpdateUserProfile } from "@/app/actions/userAction";
import * as Yup from "yup";
import { useUser } from "@/stores/userStore";

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
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-primary mb-2">
      {label}
    </label>
    <input
      id={id}
      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-prring-primary transition-all duration-300 ${
        formik.touched[id as keyof typeof formik.values] &&
        formik.errors[id as keyof typeof formik.values] &&
        "border-red-500"
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      placeholder={placeholder}
      type={type}
      name={id}
      value={formik.values[id as keyof typeof formik.values]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      disabled={disabled}
    />
    <div className="text-red-500 mt-2">
      {formik.touched[id as keyof typeof formik.values] &&
        formik.errors[id as keyof typeof formik.values]}
    </div>
  </div>
);

export default function AccountSettingsForm({
  initialName,
  initialEmail,
  initialPhone,
}: AccountSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const { updateUser } = useUser();

  const onSubmit = async (values: {
    name: string;
    email: string;
    phone: string;
  }) => {
    startTransition(async () => {
      const { error } = await UpdateUserProfile(values);

      if (error) {
        console.error("Update failed:", error);
      } else {
        updateUser({
          name: values.name,
          phone: values.phone,
          email: values.email,
        });
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
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-xl font-bold text-primary mb-6">
        Account Information
      </h2>
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="name"
            label="Display Name"
            placeholder="Enter your name"
            formik={formik} 
          />
          <InputField
            id="email"
            label="Email"
            placeholder={"Emairl"}
            disabled={true}
            formik={formik} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            formik={formik} 
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className={` flex gap-2 justify-center items-center text-white py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#394867]  transition-all duration-500 shadow-lg hover:shadow-xl ${
              isPending
                ? "bg-primary/70 hover:bg-primary/70 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={isPending || !formik.dirty || !formik.isValid}
          >
            {isPending ? (
              <div className="h-5 w-5 border-b-2 border-current rounded-full animate-spin"></div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
