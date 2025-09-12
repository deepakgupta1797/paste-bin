import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { selectCurrentUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";

const updateUserPasswordAPI = async (userId, currentPassword, newPassword) => {
  console.log(
    "API: Updating password for user:",
    userId,
    "current:",
    currentPassword,
    "new:",
    newPassword
  );
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentPassword === "wrongcurrent") {
        return reject({
          success: false,
          message: "Incorrect current password. Please try again.",
        });
      }

      resolve({
        success: true,
        message: "Password updated successfully!",
      });
    }, 1000);
  });
};

const PasswordFieldWithVisibility = ({ name, label, formik }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <BackButton />
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          {...formik.getFieldProps(name)}
          className="p-3 w-full border border-gray-300 rounded-md 
          focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0
           pr-3 flex items-center text-sm leading-5 
           text-gray-500 hover:text-gray-700"
          aria-label={
            showPassword
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {formik.touched[name] && formik.errors[name] ? (
        <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
      ) : null}
    </div>
  );
};

const ChangePasswordPage = () => {
  const currentUser = useSelector(selectCurrentUser);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters long")
        .notOneOf(
          [Yup.ref("currentPassword"), null],
          "New password must be different from the current password."
        ),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword"), null],
          "New and confirm passwords must match."
        )
        .required("Confirm new password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      setStatus(undefined);
      if (!currentUser || !currentUser.id) {
        setStatus({
          error: "User information not found. Please log in again.",
        });
        setSubmitting(false);
        return;
      }

      try {
        const result = await updateUserPasswordAPI(
          currentUser.id,
          values.currentPassword,
          values.newPassword
        );
        if (result.success) {
          toast.success(result.message || "Password updated successfully!");
          resetForm();
        } else {
          setStatus({ error: result.message || "Failed to update password." });
        }
      } catch (apiError) {
        console.error("Error updating password:", apiError);
        setStatus({
          error:
            apiError.message ||
            "An unexpected error occurred. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center 
    justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Change Your Password
        </h2>

        {formik.status && formik.status.error && (
          <div
            className="my-3 p-3 bg-red-100 text-red-700 
          border border-red-300 rounded text-sm text-center"
          >
            {formik.status.error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <PasswordFieldWithVisibility
            name="currentPassword"
            label="Current Password"
            formik={formik}
          />
          <PasswordFieldWithVisibility
            name="newPassword"
            label="New Password"
            formik={formik}
          />
          <PasswordFieldWithVisibility
            name="confirmPassword"
            label="Confirm New Password"
            formik={formik}
          />
          <div>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
              className="w-full flex justify-center py-3 px-4 border
               border-transparent rounded-md shadow-sm text-sm font-medium
                text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
