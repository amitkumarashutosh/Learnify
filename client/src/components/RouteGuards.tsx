import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { purchaseAPI } from "@/app/features/api/purchaseAPI";
import { Loader2 } from "lucide-react";

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

export const PrivateAdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user?.role === "instructor" ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Add this new route guard
export const PurchasedCourseRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { courseId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!courseId) return;
      try {
        const response = await purchaseAPI.getCourseDetailWithPurchaseStatus(
          courseId
        );

        setHasPurchased(response.purchased);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPurchaseStatus();
  }, [courseId]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <Loader2 className="animate-spin w-5 h-5 mt-10" />;
  }

  if (!hasPurchased) {
    return <Navigate to={`/course-detail/${courseId}`} replace />;
  }

  return <>{children}</>;
};
