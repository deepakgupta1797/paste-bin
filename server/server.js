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

// Chat model
const ChatSchema = new mongoose.Schema({
  blogId: String, // or pasteId if you want chats for pastes
  userId: String,
  username: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Chat = mongoose.model('Chat', ChatSchema);

// API routes
app.get('/api/pastes', async (req, res) => {
  const pastes = await Paste.find();
  res.json(pastes);
});

app.post('/api/pastes', async (req, res) => {
  const paste = new Paste(req.body);
  await paste.save();
  res.json(paste);
});

// Users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Blogs
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});
app.post('/api/blogs', async (req, res) => {
  const blog = new Blog(req.body);
  await blog.save();
  res.json(blog);
});

// Chats
app.get('/api/chats', async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
});
app.post('/api/chats', async (req, res) => {
  const chat = new Chat(req.body);
  await chat.save();
  res.json(chat);
});

// Add more routes for update, delete, etc. as needed

app.listen(5000, () => console.log('Server running on port 5000'));
