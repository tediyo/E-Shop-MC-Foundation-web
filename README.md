# 🔐 Ecommerce Web - Auth Service Testing

A Next.js frontend application for testing the authentication microservice.

## 🚀 Features

- **User Registration** - Complete registration form with all fields
- **User Login** - Secure authentication with JWT tokens
- **Profile Management** - View user profile and token information
- **Real-time Testing** - Test all auth endpoints through a beautiful UI
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **State Management**: React useState

## 📋 Prerequisites

1. **Auth Service Running** - Your auth service must be running on `localhost:3001`
2. **MongoDB** - Database must be accessible
3. **Node.js** - Version 18 or higher

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:3000`

## 🧪 Testing Flow

### Step 1: Register a New User
1. Fill out the registration form
2. Include all required fields (firstName, lastName, email, password)
3. Add optional fields (phone, dateOfBirth, gender, address)
4. Click "Create Account"

### Step 2: Login with Credentials
1. Switch to the Login tab
2. Enter your email and password
3. Click "Login"
4. You'll receive access and refresh tokens

### Step 3: View Profile
1. After login, you'll see your profile
2. View personal information and verification status
3. See your JWT tokens
4. Test the "Refresh Profile Data" button

### Step 4: Logout
1. Click the "Logout" button
2. Your session will be cleared
3. You'll be redirected to the login tab

## 🔧 Configuration

### API Endpoints
The frontend is configured to proxy requests to your auth service:

- **Registration**: `POST /api/auth/register` → `http://localhost:3001/api/v1/auth/register`
- **Login**: `POST /api/auth/login` → `http://localhost:3001/api/v1/auth/login`
- **Profile**: `GET /api/auth/me` → `http://localhost:3001/api/v1/auth/me`
- **Logout**: `POST /api/auth/logout` → `http://localhost:3001/api/v1/auth/logout`

### Environment Variables
Create a `.env.local` file if you need to customize:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📱 UI Components

- **Navigation Tabs** - Switch between Register, Login, and Profile
- **Form Validation** - Real-time validation with React Hook Form
- **Toast Notifications** - Success and error messages
- **Responsive Grid** - Adapts to different screen sizes
- **Status Indicators** - Visual feedback for authentication state

## 🐛 Troubleshooting

### Common Issues

1. **"Network Error"** - Make sure your auth service is running on port 3001
2. **"Validation Error"** - Check that all required fields are filled
3. **"Unauthorized"** - Verify your access token is valid
4. **"CORS Error"** - Ensure your auth service has CORS configured

### Debug Mode
Check the browser console for detailed error messages and network requests.

## 🚀 Next Steps

After testing the auth service:

1. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

2. **Deploy the Frontend**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify

3. **Add More Features**
   - Password reset functionality
   - Email verification
   - Two-factor authentication
   - Social login

## 📚 API Documentation

For detailed API documentation, refer to your auth service endpoints:

- **Base URL**: `http://localhost:3001/api/v1`
- **Health Check**: `GET /health`
- **Authentication**: All routes under `/auth/*`

## 🤝 Contributing

This is a testing application for the auth service. Feel free to:

- Add more test scenarios
- Improve the UI/UX
- Add error handling
- Implement additional auth features

## 📄 License

This project is part of the ecommerce microservices architecture.
