import Chats from "../pages/Chats";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { addToPastes, updateToPastes } from "../redux/pasteSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "../redux/authSlice";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allPastes = useSelector((state) => state.paste.pastes);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formInitialValues, setFormInitialValues] = useState({
    title: "",
    content: "",
    tags: [{ name: "" }],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to create or edit pastes.");
      navigate("/login");
      return;
    }

    if (pasteId) {
      const pasteToEdit = allPastes.find((p) => p._id === pasteId);
      if (pasteToEdit) {
        if (
          currentUser?.role !== "admin" &&
          pasteToEdit.userId !== currentUser?.id
        ) {
          toast.error("You are not authorized to edit this paste.");
          navigate("/pastes");
          return;
        }
        setFormInitialValues({
          title: pasteToEdit.title,
          content: pasteToEdit.content,
          tags:
            Array.isArray(pasteToEdit.tags) && pasteToEdit.tags.length > 0
              ? pasteToEdit.tags.map((tag) => ({ name: tag }))
              : [{ name: "" }],
        });
      } else {
        toast.error("Paste not found for editing.");
        setSearchParams({});
        setFormInitialValues({ title: "", content: "", tags: [{ name: "" }] });
      }
    } else {
      setFormInitialValues({ title: "", content: "", tags: [{ name: "" }] });
    }
  }, [
    pasteId,
    allPastes,
    setSearchParams,
    isAuthenticated,
    currentUser,
    navigate,
  ]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    content: Yup.string()
      .required("Content is required")
      .min(10, "Content must be at least 10 characters"),
    tags: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string()
            .min(2, "Tag too short")
            .max(20, "Tag too long")
            .matches(
              /^[a-zA-Z0-9\s-]*$/,
              "Tag can only contain letters, numbers, spaces, and hyphens"
            ),
        })
      )
      .max(5, "Maximum 5 tags allowed"),
  });

  const handleSubmit = (values, { resetForm }) => {
    if (!isAuthenticated || !currentUser) {
      toast.error("You must be logged in to perform this action.");
      navigate("/login");
      return;
    }

    const processedTags = values.tags
      .map((tagObj) => tagObj.name.trim())
      .filter(Boolean);

    if (pasteId) {
      const existingPaste = allPastes.find((p) => p._id === pasteId);
      if (
        currentUser?.role !== "admin" &&
        existingPaste.userId !== currentUser.id
      ) {
        toast.error("You are not authorized to update this paste.");
        return;
      }
      dispatch(updateToPastes({ ...values, tags: processedTags, id: pasteId }));
      toast.success("Paste updated successfully.");
    } else {
      dispatch(
        addToPastes({ ...values, tags: processedTags, userId: currentUser.id })
      );
      toast.success("Paste created successfully.");
    }
    resetForm();
    setSearchParams({});
    navigate("/pastes");
  };

  return (
    <div>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {pasteId ? "Edit Your Paste" : "Create a New Paste"}
        </h1>
        <Formik
          enableReinitialize
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isSubmitting,
            dirty,
            isValid,
            handleReset,
            setFieldValue,
            form,
          }) => (
            <Form>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter paste title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="content"
                >
                  Content
                </label>
                <Field
                  id="content"
                  name="content"
                  as="textarea"
                  placeholder="Enter paste content"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="tags"
                >
                  Tags
                </label>
                <FieldArray name="tags">
                  {({ push, remove }) => (
                    <div>
                      {Array.isArray(form.values.tags) &&
                        form.values.tags.length > 0 &&
                        form.values.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <Field
                              name={`tags.${index}.name`}
                              placeholder="Enter tag name"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      <button
                        type="button"
                        onClick={() => push({ name: "" })}
                        className="px-3 py-1 text-sm bg-green-500 
                      text-white rounded hover:bg-green-600"
                      >
                        Add Tag
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="tags"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || !dirty || !isValid || !isAuthenticated
                  }
                  className="w-full flex justify-center py-3 px-4 border
                 border-transparent
                  rounded-md shadow-sm text-sm font-medium
                   text-white bg-indigo-600 hover:bg-indigo-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : pasteId
                    ? "Update Paste"
                    : "Create Paste"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {/* Render all pastes with chats below each */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPastes.length > 0 ? (
            allPastes.map((paste) => (
              <div key={paste._id}>
                {/* ...existing paste card rendering... */}
                <Chats blogId={paste._id} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No pastes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
