# Paste Bin

A modern, full-stack web application for creating and sharing code snippets, blog posts, and real-time chat. Built with React and Node.js.

##  Features

- **Paste Management** - Create, view, and manage code snippets
- **Blog System** - Write and publish blog posts with rich content
- **Real-time Chat** - Chat rooms with message management
- **User Authentication** - Secure login/signup with role-based access
- **Admin Panel** - Administrative features for user and content management
- **Responsive Design** - Mobile-first design with dark/light theme support
- **Search Functionality** - Find pastes and content across the platform

##  Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - State management with modern Redux patterns
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Formik + Yup** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client for API calls

### Backend
- **Node.js + Express** - RESTful API server
- **MongoDB + Mongoose** - Database and ODM
- **CORS** - Cross-origin resource sharing

### Deployment
- **Frontend**: Firebase Hosting
- **Backend**: Render
- **Database**: MongoDB Atlas

##  Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components
│   ├── redux/         # Redux slices and state management
│   ├── routes/        # Protected route components
│   └── utils/         # Utilities and store configuration
├── server/            # Backend API server
├── public/            # Static assets
└── dist/             # Built frontend files
```

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paste-bin
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

### Development

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

##  Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

### Backend
- `npm start` - Start the server

##  Deployment

### Frontend (Firebase Hosting)
```bash
npm run build
firebase deploy --only hosting
```

### Backend (Render)
Push changes to the main branch, and Render will automatically deploy.

## Development Tools

- **ESLint** - Code linting with React-specific rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **Lint-staged** - Run linters on staged files
- **Jest** - Testing framework

##  Features Overview

### Authentication
- User registration and login
- Role-based access control (Admin/User)
- Protected routes for authenticated users

### Content Management
- Create and manage code pastes
- Blog post creation with rich text
- Search functionality across content

### Chat System
- Real-time chat rooms
- Message management
- Admin controls for room management

### Admin Features
- User management
- Content moderation
- System administration

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the ISC License.

##  Live Demo

- **Frontend**: [https://paste-bin-38df5.web.app](https://paste-bin-38df5.web.app)
- **Backend API**: [https://paste-bin-wpv0.onrender.com](https://paste-bin-wpv0.onrender.com)
