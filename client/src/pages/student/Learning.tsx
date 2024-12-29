import { authAPI } from "@/app/features/api/authAPI";
import Course from "./Course";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
import { Loader2 } from "lucide-react";

const MyLearning = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myLearning, setMyLearning] = useState<User>();

  const fetchUserCourses = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.profile();
      if (response.success) {
        setMyLearning(response.user);
      }
    } catch (error) {
      console.error("Error fetching user courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, []);

  if (isLoading) {
    return <Loader2 className="mx-auto mt-20 animate-spin" />;
  }
  return (
    <div className="max-w-4xl mx-auto my-20 px-4 md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>
      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning?.enrolledCourses?.length === 0 ? (
          <p>You are not enrolled in any course.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myLearning &&
              myLearning.enrolledCourses &&
              myLearning?.enrolledCourses.map((course: any) => (
                <Course key={course?._id} course={course} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
