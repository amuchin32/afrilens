import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Dashboard from "../admin/Dashboard";
const AdminPage = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("afrilens_token");
  if (loading && token) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"sans-serif"}}>Loading...</div>;
  if (!user && !token) return <Navigate to="/login" />;
  if (!user && token) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"sans-serif"}}>Loading...</div>;
  return <Dashboard />;
};
export default AdminPage;
