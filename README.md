# Whispr.

A modern, full-stack social chat application built with React, Node.js, Express, MongoDB, and Stream Chat SDK.  
whispr. lets you connect with friends, send and accept friend requests, chat in real-time, and manage your social network with a beautiful, responsive UI.

---

## 🚀 Features

- **Authentication:** Sign up, login, email verification, password reset (with secure email link).
- **User Onboarding:** Complete your profile with avatar, age, and location.
- **Friend System:**  
  - Send, accept, and manage friend requests  
  - View all friends, pending requests, and sent requests  
  - Responsive tabs for easy navigation
- **Real-Time Chat:**  
  - Powered by [Stream Chat](https://getstream.io/chat/)  
  - 1-to-1 messaging with friends  
  - Modern chat UI with message input, history, and unread indicators
- **Notifications:**  
  - See friend requests, acceptances, and other activities  
  - Responsive notification page
- **Recent Activity:**  
  - View recent actions (requests, acceptances, etc.)
- **Discover People:**  
  - Find and connect with new users
- **Responsive Design:**  
  - Fully mobile and tablet friendly  
  - Custom scrollbars, floating action buttons, and adaptive layouts
- **Theme Support:**  
  - Light, dark, and emerald themes (DaisyUI/Tailwind)
- **Security:**  
  - JWT authentication, secure password reset, and protected routes

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI, React Query, Lucide Icons, Stream Chat React SDK
- **Backend:** Node.js, Express, MongoDB, JWT, Nodemailer
- **Real-Time Chat:** Stream Chat SDK
- **Other:** React Router, React Hot Toast, Axios

---

## 💡 Usage

- **Sign up** and verify your email.
- **Complete onboarding** to set up your profile.
- **Discover people** and send friend requests.
- **Accept or decline requests** from the Friends page.
- **Start chatting** with accepted friends.
- **Reset your password** via email if needed.
- **Switch themes** for your preferred look.

---

## 📂 Project Structure

```
/backend
  /controllers
  /models
  /routes
  /utils
  server.js
/frontend
  /src
    /components
    /pages
    /lib
    /hooks
    App.jsx
    main.jsx
  tailwind.config.js
  index.css
```

---

## ✨ UI Highlights

- **Sidebar navigation** with icons and user profile
- **Responsive friends page** with tabs for All, Requests, and Sent
- **Chat page** with sidebar, recent conversations, and real-time messaging
- **Custom scrollbars** and floating action buttons for mobile
- **Animated toasts** for feedback

---

## 🔒 Security

- Passwords hashed with bcrypt
- JWT for authentication
- Email verification and secure password reset
- Only accepted friends can chat

---

## 📢 Credits

- [Stream Chat](https://getstream.io/chat/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Query](https://tanstack.com/query/latest)

---
