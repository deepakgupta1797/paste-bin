import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../redux/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import BackButton from "../components/BackButton";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    username: "",
    password: "",
    selectedRole: "user",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username or Email is required"),
    password: Yup.string().required("Password is required"),
    selectedRole: Yup.string()
      .oneOf(["user", "admin"], "Invalid role")
      .required("Role selection is required"),
  });

  const handleLogin = async (values, { setSubmitting, setStatus }) => {
    setSubmitting(true);
    setStatus(undefined);
    try {
      // Call backend login API with both username and email fields
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: values.username,
            email: values.username, // send as both username and email
            password: values.password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      // Dispatch loginUser with backend user object
      dispatch(loginUser(data));
      navigate("/");
    } catch (error) {
      setStatus({
        error:
          error.message ||
          "Login failed. Please check your credentials and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
        <div>
          <BackButton />
          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="PasteBin Logo"
              className="w-16 h-16 object-contain mb-4"
            />
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Sign in to your account
            </h2>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username / Email
                </label>
                <Field
                  name="username"
                  type="text"
                  className={`mt-1 p-3 w-full border border-gray-300 rounded-md
                 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400`}
                />
                <ErrorMessage
                  name="username"
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
                    className={`mt-1 p-3 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 pr-10`}
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
                {status && status.error && (
                  <div className="text-red-500 text-sm text-center mb-4">
                    {status.error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border 
                   border-transparent rounded-md shadow-sm text-sm font-medium 
                              text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400`}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
