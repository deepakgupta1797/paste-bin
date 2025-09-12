import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addBlogPost, updateBlogPost } from "../redux/blogSlice";
import { selectCurrentUser, selectIsAuthenticated } from "../redux/authSlice";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import BackButton from "../components/BackButton";

const CreateBlogPostPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const blogId = searchParams.get("blogId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allBlogs = useSelector((state) => state.blog.blogs);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formInitialValues, setFormInitialValues] = useState({
    title: "",
    content: "",
    tags: [{ name: "" }],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to create or edit blog posts.");
      navigate("/login");
      return;
    }

    if (blogId) {
      const blogToEdit = allBlogs.find((b) => b._id === blogId);
      if (blogToEdit) {
        if (
          currentUser?.role !== "admin" &&
          blogToEdit.userId !== currentUser?.id
        ) {
          toast.error("You are not authorized to edit this blog post.");
          navigate("/blogs");
          return;
        }
        setFormInitialValues({
          title: blogToEdit.title,
          content: blogToEdit.content,
          tags:
            Array.isArray(blogToEdit.tags) && blogToEdit.tags.length > 0
              ? blogToEdit.tags.map((tag) => ({ name: tag }))
              : [{ name: "" }],
        });
      } else {
        toast.error("Blog post not found for editing.");
        setSearchParams({});
        setFormInitialValues({ title: "", content: "", tags: [{ name: "" }] });
      }
    } else {
      setFormInitialValues({ title: "", content: "", tags: [{ name: "" }] });
    }
  }, [
    blogId,
    allBlogs,
    setSearchParams,
    isAuthenticated,
    currentUser,
    navigate,
  ]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(5, "Title must be at least 5 characters"),
    content: Yup.string()
      .required("Content is required")
      .min(50, "Content must be at least 50 characters"),
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

    if (blogId) {
      const existingBlog = allBlogs.find((b) => b._id === blogId);
      if (
        currentUser?.role !== "admin" &&
        existingBlog?.userId !== currentUser?.id
      ) {
        toast.error("You are not authorized to update this blog post.");
        return;
      }
      const updatedBlogData = {
        title: values.title,
        content: values.content,
        _id: blogId,
        createdAt: existingBlog?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: existingBlog?.userId || currentUser?.id,
        tags: processedTags,
      };
      dispatch(updateBlogPost(updatedBlogData));
    } else {
      const newBlogData = {
        title: values.title,
        content: values.content,
        _id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        createdAt: new Date().toISOString(),
        userId: currentUser?.id,
        tags: processedTags,
      };
      dispatch(addBlogPost(newBlogData));
    }
    resetForm();
    setSearchParams({});
    navigate("/blogs");
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {blogId ? "Edit Your Blog Post" : "Create a New Blog Post"}
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Blog Title
              </label>
              <Field
                name="title"
                type="text"
                placeholder="Enter Blog Title"
                className="p-3 rounded-md border-2 border-gray-300
                w-full focus:ring-indigo-500 focus:border-indigo-500"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Blog Content
              </label>
              <Field
                name="content"
                as="textarea"
                placeholder="Write your blog post here..."
                rows={15}
                className="p-3 rounded-md border-2 border-gray-300 w-full
                 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <FieldArray name="tags">
                {({ insert, remove, push, form }) => (
                  <div className="space-y-2">
                    {form.values.tags &&
                      form.values.tags.length > 0 &&
                      form.values.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Field
                            name={`tags.${index}.name`}
                            placeholder="Enter tag"
                            type="text"
                            className="p-2 rounded-md border-2 border-gray-300 flex-grow 
                            focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="px-2 py-1 text-sm bg-red-500 text-white 
                          rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      onClick={() => push({ name: "" })}
                      className="px-3 py-1 text-sm bg-green-500 text-white 
                      rounded hover:bg-green-600"
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
               rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 
               hover:bg-indigo-700 focus:outline-none focus:ring-2
                focus:ring-offset-2 focus:ring-indigo-500 
                disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Submitting..."
                  : blogId
                  ? "Update Blog Post"
                  : "Create Blog Post"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateBlogPostPage;