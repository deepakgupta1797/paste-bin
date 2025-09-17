import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



// Replace with your actual MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Paste model
const PasteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  userId: String,
});
const Paste = mongoose.model('Paste', PasteSchema);

// User model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Store hashed passwords!
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', UserSchema);

// Blog model
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  authorId: String,
  createdAt: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', BlogSchema);

// Chat model - Standalone chat system with reply support
const ChatSchema = new mongoose.Schema({
  userId: String,
  username: String,
  message: String,
  roomId: { type: String, default: 'general' }, // Chat room/group (default: 'general')
  replyTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat', 
    default: null 
  }, // Reference to parent message for replies
  replyToMessage: String, // Cache of parent message content for quick display
  replyToUsername: String, // Cache of parent message username
  createdAt: { type: Date, default: Date.now },
});
const Chat = mongoose.model('Chat', ChatSchema);

// API routes with error handling
// Pastes
app.get('/api/pastes', async (req, res) => {
  try {
    const pastes = await Paste.find();
    res.json(pastes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pastes', async (req, res) => {
  try {
    const paste = new Paste(req.body);
    await paste.save();
    res.json(paste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pastes/:id', async (req, res) => {
  try {
    const paste = await Paste.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(paste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/pastes/:id', async (req, res) => {
  try {
    await Paste.findByIdAndDelete(req.params.id);
    res.json({ message: 'Paste deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: email },
        // Also allow login if username field is actually an email
        { username: email },
        { email: username }
      ]
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
    // For demo: compare plain text passwords (replace with hash check in production)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
    // Return user info (never return password)
    res.json({
      id: user._id,
      username: user.username,
      name: user.name || user.username,
      role: user.role,
      email: user.email || '',
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chats
app.get('/api/chats', async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chats', async (req, res) => {
  try {
    const chatData = req.body;
    
    // If it's a reply, populate reply information
    if (chatData.replyTo) {
      const parentMessage = await Chat.findById(chatData.replyTo);
      if (parentMessage) {
        chatData.replyToMessage = parentMessage.message;
        chatData.replyToUsername = parentMessage.username;
      }
    }
    
    const chat = new Chat(chatData);
    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/chats/:id', async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/chats/:id', async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all chats in a room (delete chat room)
app.delete('/api/chat-rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    await Chat.deleteMany({ roomId });
    res.json({ message: `Room '${roomId}' and its messages deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));