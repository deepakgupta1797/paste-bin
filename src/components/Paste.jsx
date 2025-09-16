import React, { useState } from "react";
import { FiEdit, FiTrash2, FiCopy, FiShare2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromPastes } from "../redux/pasteSlice";
import toast from "react-hot-toast";
import { selectCurrentUser } from "../redux/authSlice";
import BackButton from "./BackButton";

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);
  const filteredData = pastes.filter(
    (paste) =>
      paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paste.tags &&
        paste.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const handleEdit = (pasteId) => {
    const pasteToEdit = pastes.find((p) => p._id === pasteId);
    if (
      currentUser?.role !== "admin" &&
      pasteToEdit?.userId !== currentUser?.id
    ) {
      toast.error("You are not authorized to edit this paste.");
      return;
    }
    navigate(`/pastes/create?pasteId=${pasteId}`);
  };

  const handleShare = async (paste) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: paste.title,
          text: paste.content,
          url: `${window.location.origin}/pastes/${paste?._id}`,
        });
        toast.success("Paste shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Error sharing paste.");
          console.error("Error sharing: ", err);
        }
      }
    } else {
      handleCopy(`Check out this paste: ${paste.title}\n${paste.content}\nLink:
         ${window.location.origin}/pastes/${paste?._id}`);
      toast.success("Share data copied to clipboard.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-800">All Pastes</h1>
        <button
          onClick={() => navigate('/pastes/create')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create New Paste
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((paste) => {
            const canEditOrDelete =
              currentUser &&
              (currentUser.role === "admin" || paste.userId === currentUser.id);
            return (
              <div
                key={paste?._id}
                className="bg-white border border-gray-200
               p-4 rounded-lg shadow-md hover:shadow-lg 
               transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3
                    className="text-xl font-semibold text-indigo-700 mb-2 truncate"
                    title={paste.title}
                  >
                    {paste.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    Created: {new Date(paste.createdAt).toLocaleDateString()}
                    {paste.userId && (
                      <span className="ml-2">
                        by UserID: {paste.userId.slice(0, 6)}...
                      </span>
                    )}
                  </p>
                  {paste.tags && paste.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {paste.tags.map((tag) => (
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
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(paste?._id)}
                    className={`px-3 py-1 text-xs font-medium bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center gap-1 ${canEditOrDelete ? "" : "opacity-50 cursor-not-allowed"}`}
                    disabled={!canEditOrDelete}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleView(paste?._id)}
                    className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleCopy(paste?.content)}
                    className="px-3 py-1 text-xs font-medium bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <FiCopy /> Copy
                  </button>
                  <button
                    onClick={() => handleShare(paste)}
                    className="px-3 py-1 text-xs font-medium bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center gap-1"
                  >
                    <FiShare2 /> Share
                  </button>
                  <button
                    onClick={() => handleDelete(paste?._id)}
                    className={`px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1 ${canEditOrDelete ? "" : "opacity-50 cursor-not-allowed"}`}
                    disabled={!canEditOrDelete}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-4">
            No pastes found.
            </p>
        )}
      </div>
    </div>
  );
};

export default Paste;
