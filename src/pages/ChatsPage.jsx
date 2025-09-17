import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addChatAsync, deleteChatAsync, setCurrentRoom, fetchChats } from "../redux/chatSlice";
import { selectCurrentUser } from "../redux/authSlice";
import { FiTrash2, FiSend, FiUsers, FiCornerUpLeft } from "react-icons/fi";
import BackButton from "../components/BackButton";

const ChatsPage = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats) || [];
  const currentRoom = useSelector((state) => state.chat.currentRoom);
  const currentUser = useSelector(selectCurrentUser);
  const [message, setMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [replyTo, setReplyTo] = useState(null); // For reply functionality
  const [customRooms, setCustomRooms] = useState([]); // Track created rooms
  const messagesEndRef = useRef(null);

  // Fetch chats on component mount
  useEffect(() => {
    dispatch(fetchChats());
    // Load custom rooms from localStorage
    const savedRooms = localStorage.getItem('chatRooms');
    if (savedRooms) {
      setCustomRooms(JSON.parse(savedRooms));
    }
  }, [dispatch]);

  // Get unique room names including custom rooms
  const availableRooms = useMemo(() => {
    const rooms = new Set(chats.map(chat => chat.roomId).filter(Boolean));
    rooms.add('general'); // Always include general room
    
    // Add custom rooms that may not have messages yet
    customRooms.forEach(room => rooms.add(room));
    
    return Array.from(rooms).sort();
  }, [chats, customRooms]);

  // Filter chats for current room
  const roomChats = useMemo(() => {
    return chats
      .filter(chat => chat.roomId === currentRoom)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [chats, currentRoom]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [roomChats]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!currentUser) {
      alert("You must be logged in to chat.");
      return;
    }

    const chatData = {
      userId: currentUser.id,
      username: currentUser.username,
      message: message.trim(),
      roomId: currentRoom,
    };

    // Add reply information if replying to a message
    if (replyTo) {
      chatData.replyTo = replyTo._id;
    }

    dispatch(addChatAsync(chatData));
    setMessage("");
    setReplyTo(null); // Clear reply after sending
  };

  const handleDeleteChat = (id, userId) => {
    if (
      currentUser &&
      (currentUser.role === "admin" || currentUser.id === userId)
    ) {
      dispatch(deleteChatAsync(id));
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    const roomName = newRoomName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!availableRooms.includes(roomName)) {
      // Add to custom rooms
      const updatedRooms = [...customRooms, roomName];
      setCustomRooms(updatedRooms);
      
      // Save to localStorage
      localStorage.setItem('chatRooms', JSON.stringify(updatedRooms));
      
      // Switch to the new room
      dispatch(setCurrentRoom(roomName));
      setNewRoomName("");
      setShowCreateRoom(false);
    } else {
      alert('Room already exists!');
    }
  };

  const handleRoomChange = (roomId) => {
    dispatch(setCurrentRoom(roomId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Room List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <FiUsers /> Chat Rooms
                </h2>
                <button
                  onClick={() => setShowCreateRoom(!showCreateRoom)}
                  className="text-sm px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  + New
                </button>
              </div>

              {/* Create Room Form */}
              {showCreateRoom && (
                <form onSubmit={handleCreateRoom} className="mb-4">
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Room name..."
                    className="w-full p-2 text-sm border rounded mb-2 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                  />
                  <button
                    type="submit"
                    className="w-full text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Create Room
                  </button>
                </form>
              )}

              {/* Room List */}
              <div className="space-y-2">
                {availableRooms.map((room) => {
                  const roomMessageCount = chats.filter(chat => chat.roomId === room).length;
                  return (
                    <button
                      key={room}
                      onClick={() => handleRoomChange(room)}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 border ${
                        currentRoom === room
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">#</span>
                        <span className="font-medium">{room}</span>
                        {currentRoom === room && (
                          <span className="ml-auto text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs opacity-75">
                        {roomMessageCount} {roomMessageCount === 1 ? 'message' : 'messages'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              
              {/* Chat Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  # {currentRoom}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {roomChats.length} messages
                </p>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {roomChats.length > 0 ? (
                  roomChats.map((chat) => (
                    <div
                      key={chat._id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Reply indicator */}
                      {chat.replyTo && (
                        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded border-l-4 border-indigo-500">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Replying to @{chat.replyToUsername}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 italic truncate">
                            {chat.replyToMessage}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {(chat.username || "A").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                                {chat.username || "Anonymous"}
                              </span>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(chat.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              {chat.message}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => setReplyTo(chat)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-full transition-colors"
                            title="Reply to message"
                          >
                            <FiCornerUpLeft size={16} />
                          </button>
                          {currentUser &&
                            (currentUser.role === "admin" || currentUser.id === chat.userId) && (
                              <button
                                onClick={() => handleDeleteChat(chat._id, chat.userId)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors"
                                title="Delete message"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                      No messages yet
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500">
                      Be the first to start the conversation in #{currentRoom}!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                {currentUser ? (
                  <div>
                    {/* Reply indicator */}
                    {replyTo && (
                      <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-grow">
                            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
                              Replying to @{replyTo.username}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 truncate">
                              {replyTo.message}
                            </div>
                          </div>
                          <button
                            onClick={() => setReplyTo(null)}
                            className="ml-2 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                            title="Cancel reply"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                        {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={replyTo ? `Reply to ${replyTo.username}...` : `Message #${currentRoom}...`}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                      >
                        <FiSend /> {replyTo ? 'Reply' : 'Send'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      You must be logged in to participate in the chat
                    </p>
                    <a
                      href="/login"
                      className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Login to Chat
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;