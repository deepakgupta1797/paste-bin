import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";

const fetchUsersAPI = async () => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: 1,
            name: "Alice",
            email: "alice@example.com",
            role: "user",
            profilePicUrl: "",
          },
          {
            id: 2,
            name: "Bob",
            email: "bob@example.com",
            role: "user",
            profilePicUrl: "",
          },
          {
            id: 3,
            name: "Charlie",
            email: "charlie@example.com",
            role: "admin",
            profilePicUrl: "",
          },
        ]),
      1000
    )
  );
};

const updateUserRoleAPI = async (userId, newRole) => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, userId, newRole }), 500)
  );
};

const fetchAdminProfileAPI = async (adminId) => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: adminId,
          name: "Charlie",
          email: "charlie@example.com",
          role: "admin",
          profilePicUrl: "",
        }),
      1000
    )
  );
};

const updateAdminDetailsAPI = async (adminId, details) => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: true,
          adminId,
          details,
        }),
      500
    )
  );
};


const adminResetUserPasswordAPI = async (adminId, targetUserId, newPassword) => {
  console.log(`API: Admin ${adminId} is resetting password for user ${targetUserId} to ${newPassword}`);
  return new Promise((resolve) =>
   
    setTimeout(() => resolve({
       success: true,
        message: `Password for user ${targetUserId} has been reset.` }
      ), 500)
  );
};

const updateAdminProfilePicAPI = async (adminId, profilePicUrl) => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: true,
          adminId,
          profilePicUrl,
        }),
      500
    )
  );
};

function Admin({ isUserAdmin, currentAdmin }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentAdminId = currentAdmin?.id;
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    profilePicUrl: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingUserPassword, setEditingUserPassword] = useState(null); 
  const [isSubmittingUserPasswordReset, setIsSubmittingUserPasswordReset] = useState(false);

  if (!isUserAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Access Denied
          </h1>
        <p className="text-lg text-gray-700">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await fetchUsersAPI();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setError("Failed to load users.");
      } finally {
        setIsLoading(false);
      }
    };

    const loadAdminProfile = async () => {
      if (!currentAdminId) {
        setError("Admin ID not available.");
        return;
      }
      try {
        const profile = await fetchAdminProfileAPI(currentAdminId);
        setAdminProfile(profile);
      } catch (error) {
        console.error("Error fetching admin profile:", error.message);
        setError("Failed to load admin profile.");
      }
    };
    loadUsers();
    loadAdminProfile();
  }, [currentAdminId]);

  const handleRoleChange = async (userId, newRole) => {
    setMessage("");
    setError("");
    try {
      const result = await updateUserRoleAPI(userId, newRole);
      if (result.success) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        setMessage(`User role updated to ${newRole}.`);
      }
    } catch (error) {
      console.error("Error updating user role:", error.message);
      setError("Failed to update user role.");
    }
  };

  const handleUserPasswordReset = async (targetUserId) => {
    if (!editingUserPassword ||
      editingUserPassword.userId !==
       targetUserId || 
       !editingUserPassword.newPassword) {
      setError("Please enter a new password for the user.");
      return;
    }
    setIsSubmittingUserPasswordReset(true);
    setMessage("");
    setError("");
    try {
      
      if (!currentAdmin?.id) {
        setError("Admin authentication error. Cannot reset password.");
        setIsSubmittingUserPasswordReset(false);
        return;
      }
      const result = await adminResetUserPasswordAPI(currentAdmin.id, targetUserId, editingUserPassword.newPassword);
      if (result.success) {
        setMessage(result.message || `Password for user ${targetUserId} reset successfully.`);
        setEditingUserPassword(null); 
      } else {
        setError(result.message || "Failed to reset user password.");
      }
    } catch (err) {
      console.error("Error resetting user password:", err.message);
      setError("An error occurred while resetting the password.");
    } finally {
      setIsSubmittingUserPasswordReset(false);
    }
  };

  const adminDetailFormik = useFormik({
    initialValues: {
      name: adminProfile.name || "",
      email: adminProfile.email || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
      .required("Name is required"),
      email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setMessage("");
      try {
        const result = await updateAdminDetailsAPI(currentAdminId, values);
        if (result.success) {
          setMessage("Admin details updated successfully.");
          setAdminProfile((prev) => ({ ...prev, ...values }));
        } else {
          setError("Failed to update admin details.");
        }
      } catch (error) {
        console.error("Error updating admin details:", error.message);
        setError("Failed to update admin details.");
      }
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  const adminProfilePicFormik = useFormik({
    initialValues: {
      profilePicUrl: null,
      preview: adminProfile.profilePicUrl || "",
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!values.profilePicUrl) {
        setError("Please select a profile picture file.");
        setSubmitting(false);
        return;
      }
      setError("");
      setMessage("");
      try {
        const mockNewUrl = `https://example.com/uploads/${values.profilePicUrl.name}`;
        const result = await updateAdminProfilePicAPI(
          currentAdminId,
          mockNewUrl
        );

        if (result.success) {
          setAdminProfile((prev) => ({ ...prev, profilePicUrl: mockNewUrl }));
          setMessage("Admin profile picture updated successfully.");
          resetForm({ values: { profilePicUrl: null, preview: mockNewUrl } });
        } else {
          setError("Failed to update admin profile picture.");
        }
      } catch (error) {
        console.error("Error updating admin profile picture:", error.message);
        setError("Failed to update admin profile picture.");
      }
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading admin data...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Admin Dashboard
        </h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700
         border border-green-300 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700
         border border-red-300 rounded">
          {error}
        </div>
      )}

      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Admin Profile Management
        </h2>

        
        <form
          onSubmit={adminDetailFormik.handleSubmit}
          className="space-y-4 mb-8"
        >
          <h3 className="text-xl font-medium text-gray-600">
            Update Details
            </h3>
          <div>
            <label
              htmlFor="adminName"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="adminName"
              name="name"
              type="text"
              onChange={adminDetailFormik.handleChange}
              onBlur={adminDetailFormik.handleBlur}
              value={adminDetailFormik.values.name}
              className="mt-1 p-2 w-full border border-gray-300 
              rounded-md shadow-sm"
            />
            {adminDetailFormik.touched.name && 
            adminDetailFormik.errors.name ? (
              <div className="text-red-500 text-xs mt-1">
                {adminDetailFormik.errors.name}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="adminEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="adminEmail"
              name="email"
              type="email"
              onChange={adminDetailFormik.handleChange}
              onBlur={adminDetailFormik.handleBlur}
              value={adminDetailFormik.values.email}
              className="mt-1 p-2 w-full border border-gray-300 
              rounded-md shadow-sm"
            />
            {adminDetailFormik.touched.email &&
            adminDetailFormik.errors.email ? (
              <div className="text-red-500 text-xs mt-1">
                {adminDetailFormik.errors.email}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={adminDetailFormik.isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md 
            hover:bg-blue-600 disabled:bg-gray-400"
          >
            {adminDetailFormik.isSubmitting ? "Updating..." : "Update Details"}
          </button>
        </form>

        
        <div className="space-y-4 mb-8"> 
            <h3 className="text-xl font-medium text-gray-600">
              Manage Admin Password
              </h3>
            <Link
                to="/change-password"
                className="inline-block px-4 py-2 bg-orange-500 
                text-white rounded-md hover:bg-orange-600 focus:outline-none 
                focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
                Change Password
            </Link>
        </div>

        <form
          onSubmit={adminProfilePicFormik.handleSubmit}
          className="space-y-4"
        >
          <h3 className="text-xl font-medium text-gray-600">
            Update Profile Picture
          </h3>
          {adminProfilePicFormik.values.preview && (
            <img
              src={adminProfilePicFormik.values.preview}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover mb-2"
            />
          )}
          <input
            id="profilePicUrl"
            name="profilePicUrl"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              adminProfilePicFormik.setFieldValue("profilePicUrl", file);
              if (file) {
                adminProfilePicFormik.setFieldValue(
                  "preview",
                  URL.createObjectURL(file)
                );
              } else {
                adminProfilePicFormik.setFieldValue(
                  "preview",
                  adminProfile.profilePicUrl || ""
                );
              }
            }}
            className="block w-full text-sm text-gray-500 
            file:mr-4 file:py-2 file:px-4 file:rounded-full 
            file:border-0 file:text-sm file:font-semibold 
            file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            disabled={adminProfilePicFormik.isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white 
            rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {adminProfilePicFormik.isSubmitting
              ? "Uploading..."
              : "Update Picture"}
          </button>
        </form>
      </section>

      
      
      <section className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          User Management
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium 
                  text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium 
                  text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium 
                  text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium
                   text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm 
                  font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm 
                  text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm 
                  text-gray-500">
                    {user.id === currentAdminId ? ( 
                      <span className="px-2 inline-flex text-xs leading-5 
                      font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role} (You)
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="p-1 border border-gray-300 
                        rounded-md text-sm"
                      >
                        <option 
                        value="user">
                          user
                          </option>
                        <option
                         value="admin">
                          admin
                          </option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap
                   text-sm font-medium">
                    {user.id !== currentAdminId && ( 
                      
                      <>
                        {editingUserPassword?.userId === user.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="password"
                              placeholder="New Password"
                              value={editingUserPassword.newPassword}
                              onChange={(e) => setEditingUserPassword({ ...editingUserPassword,
                                 newPassword: e.target.value })}
                              className="p-1 border border-gray-300 rounded-md text-sm w-32"
                            />
                            <button
                              onClick={() => handleUserPasswordReset(user.id)}
                              disabled={isSubmittingUserPasswordReset}
                              className="px-2 py-1 text-xs bg-green-500 text-white 
                              rounded hover:bg-green-600 disabled:bg-gray-300"
                            >
                              {isSubmittingUserPasswordReset ? "Saving..." : "Save"}
                            </button>
                            <button onClick={() => setEditingUserPassword(null)}
                             className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingUserPassword({ userId: user.id, newPassword: '' })}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reset Password
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 py-4">
            No users found.
            </p>
        )}
      </section>
    </div>
  );
}

export default Admin;