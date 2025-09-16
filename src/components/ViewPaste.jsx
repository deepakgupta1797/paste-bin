import React from "react";
import { FiCopy } from "react-icons/fi";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import BackButton from "./BackButton";

const ViewPaste = () => {
  const { id } = useParams();
  const allPastes = useSelector((state) => state.paste.pastes);

  const paste = allPastes.find((p) => p._id === id);

  const handleCopyContent = async () => {
    if (!paste || !paste.content) {
      toast.error("No content to copy.");
      return;
    }
    try {
      await navigator.clipboard.writeText(paste.content);
      toast.success("Content copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy content.");
      console.error("Failed to copy: ", err);
    }
  };

  if (!paste) {
    return (
      <div
        className="p-6 md:p-8 text-center
       bg-white rounded-lg shadow-xl max-w-lg mx-auto"
      >
        <h2
          className="text-2xl font-semibold
         text-red-600 mb-3"
        >
          Paste Not Found
        </h2>
         <div className={`p-6 md:p-8 text-center
       bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg mx-auto`}>
      <h2 className={`text-2xl font-semibold
         text-red-600 dark:text-red-400 mb-3`}>Paste Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400">The paste you are looking for does not exist or may have been deleted.</p>
        </div>
        <Link
          to="/pastes"
          className={`mt-6 inline-block px-6 py-2 
          text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500
        rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-400`}
        >
          Back to All Pastes
        </Link>
      </div>
    );
  }

  return (
  <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl max-w-3xl mx-auto border border-gray-200 dark:border-gray-700">
    <BackButton />
      <div className="mb-8">
        <label
          htmlFor="view-title"
          className="block text-sm font-medium text-indigo-700 dark:text-indigo-400 mb-1"
          >
          Title
        </label>
        <input
          id="view-title"
          className={`p-3 rounded-lg border-2
            border-gray-300 dark:border-gray-600 w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 cursor-not-allowed`}
          type="text"
          value={paste.title || ""}
          disabled
          readOnly
        />
      </div>

  <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        Created: {new Date(paste.createdAt).toLocaleString()}
        {paste.userId && (
          <span className="ml-2">
            by UserID: {paste.userId.slice(0, 6)}...
            </span>
        )}
      </p>
      {paste.tags && paste.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400"
          >
            Tags:
            </span>
          {paste.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm bg-indigo-100 dark:bg-gray-800 text-indigo-700 dark:text-gray-200 px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mb-8">
        <label
          htmlFor="view-content"
          className="block text-sm font-medium text-indigo-700 dark:text-indigo-400 mb-1"
        >
          Content
        </label>
        <textarea
          id="view-content"
         className={`rounded-lg border-2 border-gray-300 dark:border-gray-600 w-full 
          p-3 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 cursor-not-allowed`}
          value={paste.content}
          disabled
          readOnly
          rows={15}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleCopyContent}
          className={`px-4 py-2 bg-green-500 
          text-white rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500
          focus:outline-none focus:ring-2
           focus:outline-none focus:ring-2
            focus:ring-green-500 focus:ring-opacity-500 flex items-center gap-1`}
        >
          <FiCopy /> Copy Content
        </button>
      </div>
    </div>
  );
};

export default ViewPaste;
