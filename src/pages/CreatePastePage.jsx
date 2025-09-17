import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { addPaste, updatePaste } from "../redux/pasteSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "../redux/authSlice";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import BackButton from "../components/BackButton";

const CreatePastePage = () => {
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
        existingPaste?.userId !== currentUser?.id
      ) {
        toast.error("You are not authorized to update this paste.");
        return;
      }
      const updatedPasteData = {
        title: values.title,
        content: values.content,
        _id: pasteId,
        createdAt: existingPaste?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: existingPaste?.userId || currentUser?.id,
        tags: processedTags,
      };
      dispatch(updatePaste(updatedPasteData));
      toast.success("Paste updated successfully!");
    } else {
      const newPasteData = {
        title: values.title,
        content: values.content,
        userId: currentUser?.id,
        tags: processedTags,
      };
      dispatch(addPaste(newPasteData));
      toast.success("Paste created successfully!");
    }
    resetForm();
    setSearchParams({});
    navigate("/pastes");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        {pasteId ? "Edit Your Paste" : "Create a New Paste"}
      </h1>
      <BackButton />
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <Field
                name="title"
                type="text"
                placeholder="Enter Title Here"
                className={`p-3 rounded-md border-2 border-gray-300
                   dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 
                w-full focus:ring-indigo-500 focus:border-indigo-500`}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Content
              </label>
              <Field
                name="content"
                as="textarea"
                placeholder="Enter Paste Here"
                rows={10}
                className="p-3 rounded-md border-2 border-gray-300 w-full focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <FieldArray name="tags">
                {({ insert, remove, push, form }) => (
                  <div>
                    {form.values.tags &&
                      form.values.tags.length > 0 &&
                      form.values.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <Field
                            name={`tags.${index}.name`}
                            placeholder="Enter tag"
                            type="text"
                            className={`p-2 rounded-md border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                             flex-grow focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className={`px-2 py-1 text-sm bg-red-500 text-white
                              rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500`}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      onClick={() => push({ name: "" })}
                      className={`px-3 py-1 text-sm bg-green-500 dark:bg-green-600
                      text-white rounded hover:bg-green-600 dark:hover:bg-green-500`}
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
                className="w-full flex justify-center py-3 px-4 border border-transparent
                 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500
                  hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 
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
  );
};

export default CreatePastePage;
