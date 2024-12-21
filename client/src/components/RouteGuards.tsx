import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};
