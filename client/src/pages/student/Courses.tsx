import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { courseAPI } from "@/app/features/api/courseAPI";
import { Course as CourseType } from "@/types/course";
import Course from "./Course";
import { Loader2 } from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await courseAPI.getPublishedCourses();
      if (res.success) {
        setCourses(res.courses);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isLoading) {
    return <Loader2 className="mx-auto mt-20 animate-spin" />;
  }

  return (
    <div className="bg-gray-50 dark:bg-[#141414]">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: courses.length }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : courses?.map((course) => (
                <Course key={course._id} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
