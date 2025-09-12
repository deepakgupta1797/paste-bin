import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeBlogPost } from "../redux/blogSlice";
import toast from "react-hot-toast";
import { selectCurrentUser } from "../redux/authSlice";
import { Link } from "react-router-dom";

const BlogPage = () => {
  const blogs = useSelector((state) => state.blog.blogs);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const filteredData = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.tags &&
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const handleEdit = (blogId) => {
    const blogToEdit = blogs.find((b) => b._id === blogId);
    if (
      currentUser?.role !== "admin" &&
      blogToEdit?.userId !== currentUser?.id
    ) {
      toast.error("You are not authorized to edit this blog post.");
      return;
    }
    navigate(`/blogs/create?blogId=${blogId}`);
  };

  const handleView = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const handleDelete = (blogId) => {
    const blogToDelete = blogs.find((b) => b._id === blogId);
    if (
      currentUser?.role !== "admin" &&
      blogToDelete?.userId !== currentUser?.id
    ) {
      toast.error("You are not authorized to delete this blog post.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      dispatch(removeBlogPost(blogId));
    }
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Content copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy content.");
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = async (blog) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: `Check out this blog post: ${blog.title}`,
          url: `${window.location.origin}/blogs/${blog?._id}`,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Error sharing blog post.");
        }
      }
    } else {
      handleCopy(`Check out this blog post:
         ${blog.title}\n${window.location.origin}/blogs/${blog?._id}`);
      toast.info("Blog post link copied (Web Share API not available).");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Blog Posts</h1>
        {currentUser && (
          <Link
            to="/blogs/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md 
          hover:bg-indigo-700 transition-colors"
          >
            Create New Blog Post
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((blog) => {
            const canEditOrDelete =
              currentUser &&
              (currentUser.role === "admin" || blog.userId === currentUser.id);
            return (
              <div
                key={blog?._id}
                className="bg-white border border-gray-200 
                p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow
                 duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3
                    className="text-xl font-semibold text-indigo-700
                     mb-2 truncate"
                    title={blog.title}
                  >
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    Created: {new Date(blog.createdAt).toLocaleDateString()}
                    {blog.userId && (
                      <span className="ml-2">
                        by UserID: {blog.userId.slice(0, 6)}...
                      </span>
                    )}
                  </p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-200 text-gray-700
                           px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p
                    className="text-sm text-gray-700 mb-3 h-20 
                  overflow-hidden text-ellipsis"
                  >
                    {blog.content}
                  </p>
                </div>
                <div
                  className="flex flex-wrap gap-2 mt-4 pt-3
                 border-t border-gray-200"
                >
                  {canEditOrDelete && (
                    <button
                      onClick={() => handleEdit(blog?._id)}
                      className="px-3 py-1 text-xs font-medium
                       bg-yellow-500 text-white
                     rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleView(blog?._id)}
                    className="px-3 py-1 text-xs font-medium bg-blue-500 
                    text-white rounded-md
                    hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleCopy(blog?.content)}
                    className="px-3 py-1 text-xs font-medium 
                    bg-green-500 text-white 
                   rounded-md hover:bg-green-600"
                  >
                    Copy Content
                  </button>
                  <button
                    onClick={() => handleShare(blog)}
                    className="px-3 py-1 text-xs font-medium bg-purple-500
                     text-white
                   rounded-md hover:bg-purple-600"
                  >
                    Share
                  </button>
                  {canEditOrDelete && (
                    <button
                      onClick={() => handleDelete(blog?._id)}
                      className="px-3 py-1 text-xs font-medium bg-red-500 
                      text-white
                     rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 py-4">
            No blog posts found matching your criteria.
            {blogs.length === 0 && "Why not create one?"}
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
