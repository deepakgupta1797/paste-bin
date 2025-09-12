import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logoutUser,
} from "../redux/authSlice";

const HomePage = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const blogs = useSelector((state) => state.blog.blogs);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageContainerClass = "container mx-auto px-4 py-8";
  // const sectionTitleClass =
  //   "text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4";
  // const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
  // const cardClass =
  //   "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700";
  // const cardTitleClass =
  //   "text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-1 truncate";
  // const cardMetaClass = "text-xs text-gray-500 dark:text-gray-400 mb-2";
  // const cardTagClass =
  //   "text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full";
  // const cardButtonContainerClass =
  //   "flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700";
  // const cardButtonClass = "px-3 py-1 text-xs font-medium text-white rounded-md";
  // const viewAllLinkClass =
  //   "text-sm text-indigo-600 dark:text-indigo-400 hover:underline";

  // const allPastes = useSelector((state) => state.paste.pastes);
  // const allBlogs = useSelector((state) => state.blog.blogs);

  const recentPastes = [...pastes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
  };

  const handleCopy = async (content, type = "Content") => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${type} copied to clipboard!`);
    } catch (err) {
      toast.error(`Failed to copy ${type.toLowerCase()}.`);
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = async (item, type) => {
    const url =
      type === "paste"
        ? `${window.location.origin}/pastes/${item._id}`
        : `${window.location.origin}/blogs/${item._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out this ${type}: ${item.title}`,
          url: url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error(`Error sharing ${type}.`);
        }
      }
    } else {
      handleCopy(`Check out this ${type}: ${item.title}\n${url}`, "Share link");
    }
  };

  const renderItem = (item, type) => (
    <div
      key={item._id}
      className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl 
      transition-shadow duration-300 ease-in-out border border-gray-200
       flex flex-col"
    >
      <h3
        className="text-lg font-semibold
       text-indigo-600 mb-1 truncate"
        title={item.title}
      >
        <Link
          to={type === "paste" ? `/pastes/${item._id}` : `/blogs/${item._id}`}
          className="hover:underline"
        >
          {item.title}
        </Link>
      </h3>
      <p className="text-xs text-gray-500 mb-2">
        Created: {new Date(item.createdAt).toLocaleDateString()}
      </p>
      {item.tags && item.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs
             bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() =>
            handleCopy(
              item.content,
              type === "paste" ? "Paste content" : "Blog content"
            )
          }
          className="px-3 py-1 text-xs font-medium 
         bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Copy
        </button>
        <button
          onClick={() => handleShare(item, type)}
          className="px-3 py-1 text-xs font-medium 
        bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Share
        </button>
      </div>
    </div>
  );

  return (
    <div className={pageContainerClass}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Welcome To PasteBin
        </h1>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Hi, {currentUser?.name}! ({currentUser?.role})
            </span>
          </div>
        ) : null}
      </div>

      {isAuthenticated && (
        <div className="mb-8 flex gap-4">
          <Link
            to="/pastes/create"
            className={`px-4 py-2 bg-blue-500 dark:bg-blue-600
             text-white rounded-md
             hover:bg-blue-600 dark:hover:bg-blue-500`}
          >
            Create New Paste
          </Link>
          <Link
            to="/blogs/create"
            className={`px-4 py-2 bg-teal-500 dark:bg-teal-600 text-white
              rounded-md hover:bg-teal-600 dark:hover:bg-teal-500`}
          >
            Create New Blog Post
          </Link>
        </div>
      )}

      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Recent Pastes
          </h2>
          <Link
            to="/pastes"
            className="text-sm text-indigo-600 hover:underline"
          >
            View All Pastes &rarr;
          </Link>
        </div>
        {recentPastes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 
          lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {" "}
            {/* Responsive columns & increased gap */}
            {recentPastes.map((paste) => renderItem(paste, "paste"))}
          </div>
        ) : (
          <p className="text-gray-500">No recent pastes available.</p>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Recent Blog Posts
          </h2>
          <Link to="/blogs" className="text-sm text-indigo-600 hover:underline">
            View All Blogs &rarr;
          </Link>
        </div>
        {recentBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2
           lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {" "}
            {/* Responsive columns & increased gap */}
            {recentBlogs.map((blog) => renderItem(blog, "blog"))}
          </div>
        ) : (
          <p className="text-gray-500">No recent blog posts available.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
