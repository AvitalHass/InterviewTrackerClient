import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/use-auth";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
}

function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
