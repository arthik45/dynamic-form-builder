# Dynamic Form Builder & Scalable Form Submission System

A full-stack Dynamic Form Builder application that allows administrators to create, customize, publish, and manage dynamic forms. Users can access published forms, submit responses, and administrators can efficiently manage form submissions.

Built as part of the **Full Stack Developer Technical Assessment** using React.js, Redux Toolkit, Node.js, Express.js, and MongoDB.

## 🚀 Live Demo

- **Frontend:** https://dynamic-form-builder-eight.vercel.app/
- **Backend API:** https://dynamic-form-builder-1-ox48.onrender.com
- **GitHub Repository:** https://github.com/arthik45/dynamic-form-builder

## 🔐 Admin Login Credentials

Use the following demo credentials to access the admin dashboard and test the application.

| Credential | Details |

1. Admin Email: admin@gmail.com
2. Admin Password: 12345678


## ✨ Features

### 1. Admin Authentication
- Admin login functionality.
- JWT-based authentication.
- Protected admin routes and APIs.
- Authorization for admin-only operations.

### 2. Dynamic Form Builder
- Create forms with a form name and description.
- Add and configure dynamic fields.
- Edit and delete fields.
- Reorder fields.
- Configure field labels, keys, placeholders, default values, and required status.
- Configure options for Select, Radio, and Checkbox fields.
- Save forms as Draft.
- Publish forms for public submissions.

### 3. Supported Field Types

The form builder is designed to support the following field types:

- TEXT
- EMAIL
- NUMBER
- PHONE
- TEXTAREA
- DATE
- SELECT
- RADIO
- CHECKBOX

### 4. Dynamic Form Rendering
- Access forms using a unique form URL.
- Fetch form definitions from the backend.
- Dynamically render fields based on the saved form configuration.
- Validate user inputs before submission.
- Support different field types without creating individual hardcoded forms.

Example:

`/forms/:formId`

### 5. Form Submission Management
- Submit responses to published forms.
- Validate submitted data on the backend.
- Store submissions in MongoDB.
- View submissions for individual forms.
- View individual submission details.
- Delete submissions.
- Pagination for submission lists.

### 6. Form Management
- View created forms.
- Track total submissions.
- View form publishing status.
- Edit and delete forms.
- Manage form configurations.

## 🛠️ Technology Stack

### Frontend
- React.js
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt / bcryptjs

### Deployment
- Vercel – Frontend
- Render – Backend 
- MongoDB Atlas – Database

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/arthik45/dynamic-form-builder.git

cd dynamic-form-builder
```

### 2. Backend Setup

```bash
cd server

npm install
```

Create a `.env` file inside the server directory.

Configure the following environment variables using the actual names expected by the backend:

```env
PORT =5000
MONGO_URL=mongodb+srv://arthiksk:arthik123@cluster0.8lvmecr.mongodb.net/cateringDB
JWT_SECRET=your_secret_key

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=12345678
```

Start the backend:

```bash
npm run dev
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

`http://localhost:5173`

## 🗄️ Database Design

MongoDB is used as the database.

The application uses separate collections for managing users, forms, and submissions.

### User Collection
Stores administrator authentication information.

- Name
- Email
- Password (hashed)
- Role

### Form Collection
Stores form definitions and configurations.

- Form name
- Description
- Fields array
- Field type
- Field label
- Field key
- Placeholder
- Default value
- Required status
- Field options
- Form status (Draft / Published)
- Created by
- Timestamps

### Submission Collection
Stores user responses.

- Form ID
- Submitted data
- Submission timestamp

## 🔄 Redux Toolkit Architecture

Redux Toolkit is used for application-level state management.

Different slices are maintained for separate responsibilities:

- **Auth Slice:** Handles authentication, user information, and login state.
- **Forms Slice:** Handles form creation, listing, updating, deletion, and form data.
- **Submissions Slice:** Handles submission retrieval, pagination, and deletion.

Redux Toolkit async thunks are used for API requests with loading, success, and error states.

Local component state is used for temporary form inputs, field configuration, and UI interactions.

## 🔒 Security & Validation

- JWT-based authentication.
- Protected admin routes.
- Password hashing.
- Backend-side form submission validation.
- Required field validation.
- Email format validation.
- Number and phone validation.
- Allowed option validation for Select, Radio, and Checkbox fields.
- Environment variables for sensitive configuration.
- Input validation and sanitization.

Frontend validation is used for user experience, while backend validation independently verifies submitted data.

## 📈 Scalability & System Design

The application is designed with scalability considerations for handling a large number of forms and submissions.

### 1. Handling 50,000+ Forms
- Use indexed MongoDB fields for efficient form lookups.
- Retrieve forms by their unique IDs.
- Apply pagination when listing forms.
- Separate form configuration from submission data.

### 2. Handling 10 Million+ Submissions
- Maintain submissions in a separate collection.
- Create indexes on `formId` and submission timestamps.
- Retrieve submissions using pagination.
- Avoid loading all submission records into memory.

### 3. High Concurrent Submission Traffic
- Keep backend APIs stateless using JWT authentication.
- Deploy multiple backend instances behind a load balancer.
- Use database connection pooling.
- Apply API rate limiting.
- Optimize frequently accessed database queries.

### 4. Background Jobs
For additional operations such as email notifications, reports, and other heavy processing:

- Introduce Redis and BullMQ for background job processing.
- Process notification tasks asynchronously.
- Keep form submission APIs responsive.

### 5. Database Optimization
- Create indexes for frequently queried fields.
- Use pagination instead of fetching complete datasets.
- Apply MongoDB projections to retrieve only required fields.
- Monitor slow queries and optimize database operations.


## 👨‍💻 Developer

**Arthik M**

Full Stack Developer

GitHub: https://github.com/arthik45

---

Thank you for reviewing my project. I appreciate the opportunity to demonstrate my full-stack development skills through this technical assessment.
