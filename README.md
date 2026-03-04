# SMGS - Student Management System

A full-stack web application for managing students, faculty, and academic records. Built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### For Students
- View and track attendance
- Check marks and academic performance
- Access course information and timetables
- Personal profile management

### For Faculty
- Record student attendance
- Enter and manage student marks
- View class information
- Track student performance

### For Admins
- **Create faculty accounts** via admin dashboard
- Manage all users (students, faculty, admins)
- View system statistics and reports
- Control access and permissions

## 📋 Project Structure

```
smgs/
├── client/              # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/  # UI components & pages
│   │   ├── pages/       # Page components (Auth, Index, Faculty, Student, Admin)
│   │   ├── hooks/       # Custom hooks (useAuth)
│   │   ├── utils/       # Utilities (API client)
│   │   └── ...
│   ├── package.json
│   └── README.md
├── server/              # Express backend (Node.js)
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── seeds/       # Database seeders (admin user)
│   │   ├── index.ts     # Server entry point
│   │   ├── mongo.ts     # MongoDB connection
│   │   └── ...
│   ├── package.json
│   ├── vercel.json      # Vercel deployment config
│   └── README.md
├── DEPLOY.md            # Deployment guide (Vercel, Render, Railway)
└── package.json         # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js and npm
- MongoDB Atlas account
- Git

### Development (Local)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/smgs.git
   cd smgs
   ```

2. **Install dependencies:**
   ```bash
   # Server
   cd server
   npm install
   
   # Client (in a new terminal)
   cd client
   npm install
   ```

3. **Setup environment variables:**
   
   **Server** (`server/.env`):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=smgs
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   CORS_ORIGIN=*
   ```
   
   **Client** (`client/.env`):
   ```env
   VITE_API_BASE=http://localhost:5000
   ```

4. **Create admin account:**
   ```bash
   cd server
   npm run seed:admin
   ```
   Creates:
   - Email: `admin@smgs.com`
   - Password: `Admin@123456` (change in production!)

5. **Start both services:**
   ```bash
   # Server terminal
   cd server && npm run dev
   
   # Client terminal
   cd client && npm run dev
   ```
   
   - Server runs on `http://localhost:5000`
   - Client runs on `http://localhost:5173`

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Admin login: `admin@smgs.com` / `Admin@123456`

## 🔐 Authentication & Roles

### Role Types
1. **Student** - Self-register, view own attendance and marks
2. **Faculty** - Created by admin, record attendance and marks
3. **Admin** - Created via seed script, manage all users

### Key Security Features
- Faculty **cannot self-register** (only admins can create faculty accounts)
- Admin must verify identity before creating faculty
- JWT-based session management
- Passwords hashed with bcrypt
- Environment variables protect secrets (never committed)

## 📚 API Documentation

### Core Endpoints

**Authentication:**
- `POST /api/auth/signup` - Student registration
- `POST /api/auth/signin` - Login (all roles)
- `POST /api/auth/admin/create-faculty` - Create faculty (admin only)
- `GET /api/auth/session` - Check session

**User Management:**
- `GET /api/profiles?user_id=` - Get user profile
- `GET /api/students?profile_id=` - Get student info

**Academic Records:**
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Record attendance
- `GET /api/marks` - Get marks
- `POST /api/marks` - Record marks
- `GET /api/subjects` - List subjects

**Health:**
- `GET /health` - Server status

See [server/README.md](server/README.md) for full API documentation.

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router v6 (navigation)
- Tailwind CSS (styling)
- shadcn/ui (component library)

### Backend
- Node.js + Express
- TypeScript
- MongoDB Atlas (database)
- JWT (authentication)
- bcrypt (password hashing)
- CORS (cross-origin requests)

## 📦 Deployment

For detailed deployment instructions, see [DEPLOY.md](DEPLOY.md).

### Quick Deploy (Vercel)
1. Push code to GitHub
2. Deploy server to Vercel (set `MONGODB_URI` and `JWT_SECRET`)
3. Deploy client to Vercel (set `VITE_API_BASE` to server URL)
4. Run seed script: `npm run seed:admin`

### Supported Platforms
- **Vercel** (recommended) - Free tier available
- **Render** + Netlify - Alternative option
- **Railway** - Simple deployment
- **Fly.io** - Global deployment

## 🧪 Testing

```bash
# Client tests
cd client && npm run test

# Backend tests
cd server && npm run test
```

## 📝 Admin Dashboard

After logging in as admin:

1. Click "Admin Dashboard" button
2. Fill in faculty details (name, email, password)
3. Enter your admin password to verify
4. Faculty account is created and ready to use

## 🐛 Troubleshooting

### API Calls Fail
- Ensure backend is running on correct port
- Check `VITE_API_BASE` environment variable
- Verify CORS settings on backend

### Can't Log in as Admin
- Run `npm run seed:admin` in server directory
- Verify MongoDB connection
- Check that `MONGODB_URI` is correct

### Faculty Signup Disabled?
- Faculty accounts must be created by admins
- This is intentional for security

See [DEPLOY.md](DEPLOY.md) for more troubleshooting.

## 🔒 Security Notes

- Never commit `.env` files to git
- Always use HTTPS in production
- Change default admin password immediately
- Rotate MongoDB and JWT secrets regularly
- Keep dependencies updated

## 📄 License

MIT

## 👥 Contributing

1. Clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## 📞 Support

For issues or questions:
1. Check [DEPLOY.md](DEPLOY.md) troubleshooting section
2. Review [server/README.md](server/README.md) and [client/README.md](client/README.md)
3. Check existing GitHub issues

---

**Happy studying! 📚**
