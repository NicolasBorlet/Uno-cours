// ProtectedRoute.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const checkTokenValidity = async (): Promise<boolean> => {
  const token = localStorage.getItem("userToken");
  return !!token;
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const isValid = await checkTokenValidity();
      if (!isValid) {
        // localStorage.removeItem("userToken");
        navigate("/login");
      }
      setIsLoading(false);
    };

    validateToken();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;