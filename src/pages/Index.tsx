import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to projects page
  return <Navigate to="/projects" replace />;
};

export default Index;
