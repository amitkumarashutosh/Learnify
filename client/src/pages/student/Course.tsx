import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Course as CourseType } from "@/types/course";
import { Link } from "react-router-dom";

const Course = ({ course }: { course: CourseType }) => {
  if (!course) return null;
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          {typeof course?.thumbnail === "string" ? (
            <img
              src={course?.thumbnail}
              alt="course-thumbnail"
              className="w-full h-36 object-cover rounded-t-lg"
            />
          ) : (
            <img
              src="https://img-c.udemycdn.com/course/750x422/3873464_403c_3.jpg"
              alt="course-thumbnail"
              className="w-full h-36 object-cover rounded-t-lg"
            />
          )}
        </div>
        <CardContent className="px-5 py-4 space-y-3">
          <h1 className="hover:underline font-bold text-lg truncate">
            {course?.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={course.creator?.avatar}
                  alt="creator-avatar"
                />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm">
                {course.creator?.username || "Unknown"}
              </h1>
            </div>
            <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
              {course?.level}
            </Badge>
          </div>
          <div className="text-lg font-bold">
            <span>₹{course?.price}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
