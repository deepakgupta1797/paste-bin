import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import BackButton from "../components/BackButton";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    name: "",
    username: "",
    emailid: "",
    password: "",
    confirmPassword: "",
    role: "user",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    emailid: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string()
      .oneOf(["user", "admin"], "Invalid role")
      .required("Role is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setSubmitting(true);
    setStatus(undefined);
    try {
      // Send signup data to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          role: values.role,
          name: values.name,
          email: values.emailid,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      setStatus({
        error: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center 
    justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8`}
    >
      <BackButton />
      <div
        className={`max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg`}
      >
        <div>
          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="PasteBin Logo"
              className="w-16 h-16 object-contain mb-4"
            />
            <h2
              className={`text-center text-3xl
             font-extrabold text-gray-900 dark:text-gray-100`}
            >
              Create your account
            </h2>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className={`mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <Field
                  name="username"
                  type="text"
                  className={`mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                   rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="emailid"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Id
                </label>
                <Field
                  name="emailid"
                  type="text"
                  className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                   rounded-md shadow-sm focus:ring-indigo-500
                   focus:border-indigo-500"
                />
                <ErrorMessage
                  name="emailid"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div>
                {status && status.error && (
                  <div className="text-red-500 text-sm text-center mb-4">
                    {status.error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2
                  px-4 border border-transparent rounded-md dark:bg-indigo-500
                   shadow-sm text-sm font-medium text-white 
                    bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400`}
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
