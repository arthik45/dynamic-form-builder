import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import FormSubmission from './pages/FormSubmission';
import MyForms from './pages/MyForms';
import ViewSubmissions from './pages/ViewSubmissions';

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/createform" element={<CreateForm />} />
      <Route
        path="/forms/:formId"
        element={<FormSubmission />}
      />
      <Route path="/admin/myforms" element={<MyForms />} />
      <Route
        path="/admin/forms/:formId/submissions"
        element={<ViewSubmissions />}
      />
    </Routes>

  )
}

export default App