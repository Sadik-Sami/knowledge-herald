# 📰 Knowledge Herald – Tech News Portal (Frontend)

**Knowledge Herald** is a modern tech news platform built with React and the MERN stack, designed to deliver curated tech articles, premium content, and an interactive user dashboard. It includes role-based access, subscription plans, publisher support, and admin analytics.

🌐 **Live Demo**: [https://knowledge-herald.web.app](https://knowledge-herald.web.app)  
📸 **Preview Screenshots**:  
![Home](https://your-image-host.com/homepage-screenshot.png)
![Dashboard](https://your-image-host.com/dashboard-screenshot.png)
![Article Details](https://your-image-host.com/article-screenshot.png)

---

## 📚 Table of Contents

- [📁 Project Structure](#-project-structure)
- [🚀 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🧾 Routes Overview](#-routes-overview)
- [🔧 Setup & Installation](#-setup--installation)
- [🖌️ UI Libraries](#️-ui-libraries)
- [🧪 Testing (Optional)](#-testing-optional)
- [📁 Deployment](#-deployment)
- [🙌 Contribution](#-contribution)
- [📜 License](#-license)
- [📧 Contact](#-contact)

---

## 📁 Project Structure

The project is organized for clarity and scalability using atomic design and React best practices.

```

src/
├── assets/             # Lottie animations, images
├── components/         # All shared and page-specific components
│   ├── Home/           # Hero, FAQ, Trending, Testimonials
│   ├── auth/           # Login/Register forms
│   ├── Dashboard/      # Admin/user dashboard widgets
│   ├── modals/         # Terms of Service and confirmation modals
│   └── ui/             # Tailwind+Shadcn based styled components
├── context/            # Auth context using React Context API
├── data/               # Static sample data like tags
├── firebase/           # Firebase configuration
├── hooks/              # Reusable React hooks (auth, axios, subscription)
├── layout/             # Layout wrappers for dashboard pages
├── lib/                # Utility functions (form validation, etc.)
├── pages/              # Page routes (Home, About, ArticleDetails, etc.)
├── providers/          # Theme provider (light/dark toggle)
├── routes/             # Protected and role-based route wrappers
├── App.jsx             # App router and layout wrapper
├── main.jsx            # ReactDOM entry point
├── index.css           # Global styles with Tailwind

````

---

## 🚀 Features

### 🔓 Public Users
- Beautiful homepage with featured articles, publishers, and testimonials
- Browse all articles and read article details
- Responsive layout across all devices
- Scroll animation, Lottie icons, and lazy-loaded images

### 🔐 Authentication
- Firebase email/password auth
- Persistent login using Context API
- Access control for protected and admin routes

### 💳 Subscription System
- View and purchase premium plans
- Protected route access for premium content
- Payment success landing page

### 🧑‍💼 User Dashboard
- View your articles
- Add new articles
- Edit/Delete your content
- Access premium articles after subscription

### 🛠 Admin Dashboard
- Add new publishers
- View all articles and users
- Statistics chart (article counts, users, etc.)
- Manage subscriptions and roles

---

## 🛠 Tech Stack

| Category         | Tech Used                              | Description                                |
|------------------|-----------------------------------------|--------------------------------------------|
| Frontend         | React, Vite                             | Fast modern SPA with component structure   |
| Styling          | Tailwind CSS, Shadcn/ui                 | Utility-first + accessible styled UI       |
| Authentication   | Firebase                                | Email/password auth                        |
| State Management | Context API, Custom Hooks               | Clean global state for auth/subscription   |
| Routing          | React Router DOM                        | Route management with nested layout        |
| HTTP Requests    | Axios                                   | REST API calls with auth interceptors      |
| Animation        | Lottie React                            | Engaging animations (login, FAQ, etc.)     |
| Icons            | Lucide React                            | Consistent icons across the app            |

---

## 🧾 Routes Overview

| Path                          | Description                          |
|------------------------------|--------------------------------------|
| `/`                          | Homepage with article highlights     |
| `/login`, `/register`        | Firebase-powered auth forms          |
| `/all-articles`              | Full article feed                    |
| `/article/:id`               | Dynamic article page                 |
| `/dashboard`                 | Role-based dashboard                 |
| `/dashboard/my-articles`     | Authored articles list               |
| `/dashboard/add-article`     | Form to create new post              |
| `/dashboard/statistics`      | Admin-only analytics page            |
| `/dashboard/all-users`       | Admin-only user manager              |
| `/subscription`              | Pricing plans                        |
| `/payment-success`           | Redirect after successful payment    |
| `/about`, `/contact`         | Informational pages                  |
| `*`                          | Custom 404 error page                |

---

## 🔧 Setup & Installation

1. **Clone the project**
   
   ```
   git clone https://github.com/yourusername/knowledge-herald-frontend.git
   cd knowledge-herald-frontend
   ```


2. **Install dependencies**

   ```
   npm install
   ```

3. **Firebase Setup**

   * Add your Firebase config to `src/firebase/firebase.init.js`
   * Enable Email/Password login in Firebase Console

4. **Create `.env` file**

   ```
   VITE_API_BASE_URL=https://your-backend-api.com
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   ```

5. **Run the app**

   ```
   npm run dev
   ```

---

## 🖌️ UI Libraries

* ✅ [Shadcn/ui](https://ui.shadcn.com) – Styled components
* ✅ [Tailwind CSS](https://tailwindcss.com) – Custom design system
* ✅ [Lucide Icons](https://lucide.dev) – Iconography
* ✅ [Lottie React](https://lottiefiles.com) – JSON animations

---

## 🧪 Testing (Optional)

This project currently does not include automated tests, but you can easily add:

* [Vitest](https://vitest.dev/) for unit testing
* [React Testing Library](https://testing-library.com/)

---

## 📁 Deployment

This project supports multiple hosting platforms:

| Platform         | Notes                                                    |
| ---------------- | -------------------------------------------------------- |
| Firebase Hosting | Already configured via `firebase.json` and `.firebaserc` |
| Netlify / Vercel | Add SPA redirect (`_redirects` file or `404.html`)       |
| Render / Surge   | Works with any SPA-compatible host                       |

---

## 🙌 Contribution

💡 **Want to improve the project?**
Feel free to fork, clone, and open a PR.

```
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📧 Contact

* 👨‍💻 **Developer**: Sadik Sami
* ✉️ **Email**: [sadik.al.sami.2002@gmail.com](mailto:sadik.al.sami.2002@gmail.com)
* 🌐 **Live Site**: [https://knowledge-herald.web.app](https://knowledge-herald.web.app/)
* 🌍 **LinkedIn**: [linkedin.com/in/sadiksami](https://www.linkedin.com/in/sadik-al-sami-b65311204/)
* 🧰 **Portfolio**: [sadiksami.dev](https://sadik-dev.vercel.app/)

---

## 🙏 Acknowledgements

* Inspired by platforms like **Medium**, **TechCrunch**, and **The Verge**
* Special thanks to open-source contributors

```
