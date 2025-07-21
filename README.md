# FamilyGrocer 🛒 - A Real-Time Collaborative Grocery List App

<p align="center">
<!--   <img src="https://i.imgur.com/your-project-screenshot.png" alt="FamilyGrocer Dashboard Screenshot" width="700"/> -->
</p>

<p align="center">
  A full-stack MERN application designed to solve a real-world problem: managing a shared family grocery list. This app allows multiple family members to join a private group, add items to a shared list in real-time, and receive instant email notifications about updates.
</p>

<p align="center">
<!--   <strong><a href="https://your-live-app-url.onrender.com">View Live Demo</a></strong> -->
</p>

---

## ✨ Key Features

* **👨‍👩‍👧‍👦 Family-Centric Groups**: Users can either create a new family group and receive a unique, shareable code, or join an existing family with that code.
* **🔐 Secure Authentication**: Full JWT (JSON Web Token) authentication and authorization flow ensures that only authenticated family members can access their group's data.
* **✍️ Real-Time CRUD Operations**: A seamless, single-page interface allows users to Create, Read, Update, and Delete grocery items.
* **📧 Instant Email Notifications**: When any member adds an item, the backend automatically sends a beautifully formatted HTML email to every member of the family using **Nodemailer** and a Google App Password for security.
* **✅ Clean & Modern UI**: A responsive and intuitive user interface built with React and modern CSS.

## 🛠️ Tech Stack

This project was built using the MERN stack and other modern technologies:

| Frontend                               | Backend                               | Database         | Authentication & Notifications |
| -------------------------------------- | ------------------------------------- | ---------------- | ------------------------------ |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white) | ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) | ![Nodemailer](https://img.shields.io/badge/Nodemailer-4A9A4A?style=for-the-badge&logo=nodemailer&logoColor=white) |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) |                                       |                  |                                |

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm installed
* A MongoDB Atlas account and connection string
* A Google Account with 2-Step Verification enabled to generate an App Password

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4.  **Set Up Environment Variables:**
    * In the `server` directory, create a `.env` file.
    * Add the following variables with your credentials:
        ```env
        PORT=5001
        MONGO_URI=your_mongodb_atlas_uri
        JWT_SECRET=your_super_secret_jwt_key
        EMAIL_USER=your_gmail_address@gmail.com
        EMAIL_PASS=your_16_character_google_app_password
        ```

5.  **Run the Application:**
    * **Start the backend server:** In the `server` directory, run `npm run dev`.
    * **Start the frontend client:** In a separate terminal, go to the `client` directory and run `npm start`.

The application will now be running on `http://localhost:3000`.

## 🚢 Deployment

This application is deployed on **Render** as two separate services for optimal performance and scalability:
* **Backend**: Deployed as a **Web Service** running Node.js.
* **Frontend**: Deployed as a **Static Site** built with React.

A **Rewrite Rule** on the frontend service (`/api/*` -> `your-backend-url.onrender.com/api/*`) seamlessly proxies API requests to the backend.

---

### Contact

Shubham Keshri - [shubhamkeshri1892@gmail.com](mailto:shubhamkeshri1892@gmail.com)

Project Link: [https://github.com/your-username/your-repo-name](https://familygrocer.onrender.com/)
