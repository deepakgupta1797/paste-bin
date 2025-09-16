import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addChat, deleteChat } from "../redux/chatSlice";
import { selectCurrentUser } from "../redux/authSlice";
import { FiTrash2 } from "react-icons/fi";
import BackButton from "../components/BackButton";

const Chats = ({ blogId }) => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const filteredChats = useMemo(
    () => chats.filter((chat) => chat.blogId === blogId),
    [chats, blogId]
  );
  const currentUser = useSelector(selectCurrentUser);
  const [message, setMessage] = useState("");

  const handleAddChat = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!currentUser) {
      alert("You must be logged in to chat.");
      return;
    }
    dispatch(
      addChat({
        id: Date.now().toString(),
        blogId,
        userId: currentUser.id,
        username: currentUser.username,
        message,
        createdAt: new Date().toISOString(),
      })
    );
    setMessage("");
  };

  const handleDeleteChat = (id, userId) => {
    if (
      currentUser &&
      (currentUser.role === "admin" || currentUser.id === userId)
    ) {
      dispatch(deleteChat(id));
    }
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-xl mx-auto">
      <div className="mb-4">
        <BackButton />
      </div>
      <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
        Chats
      </h3>
      <form onSubmit={handleAddChat} className="flex gap-2 mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow min-w-0 p-2 border rounded dark:bg-gray-800 dark:text-gray-100"
          placeholder="Type your message..."
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
      <div className="space-y-3">
        {filteredChats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No chats yet.</p>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded px-3 py-2"
            >
              <div>
                <span className="font-medium text-indigo-700 dark:text-indigo-400">
                  {chat.username}
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-300">
                  {new Date(chat.createdAt).toLocaleString()}
                </span>
                <div className="text-gray-800 dark:text-gray-100">
                  {chat.message}
                </div>
              </div>
              {currentUser &&
                (currentUser.role === "admin" ||
                  currentUser.id === chat.userId) && (
                  <button
                    onClick={() => handleDeleteChat(chat.id, chat.userId)}
                    className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chats;
