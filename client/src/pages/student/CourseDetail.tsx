import { purchaseAPI } from "@/app/features/api/purchaseAPI";
import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Course, LectureType } from "@/types/course";
import { BadgeInfo, Loader2, Lock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const [courseDetail, setCourseDetail] = useState<Course>();
  const [purchased, setPurchased] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
    if (!purchased) {
      navigate(`/course/${courseId}`);
    }
  };

  const fetchPurchasedCourse = async () => {
    setIsLoading(true);
    try {
      const res = await purchaseAPI.getCourseDetailWithPurchaseStatus(
        courseId!
      );
      if (res.success) {
        setCourseDetail(res.course);
        setPurchased(res.purchased);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedCourse();
  }, []);

  if (isLoading) {
    return <Loader2 className="mx-auto mt-20 animate-spin" />;
  }

  return (
    <div className="space-y-5 mt-16">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {courseDetail?.title}
          </h1>
          <p className="text-base md:text-lg">{courseDetail?.subtitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {courseDetail?.creator?.username}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            Last updated
            <p> {courseDetail?.updatedAt?.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {courseDetail?.enrolledStudents?.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          {courseDetail?.description && (
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: courseDetail?.description }}
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {courseDetail?.lectures?.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseDetail?.lectures?.map((lecture: LectureType) => (
                <div
                  key={lecture?._id}
                  className="flex items-center gap-3 text-sm"
                >
                  <span>
                    {true ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>{lecture?.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                {courseDetail?.lectures?.length && (
                  <ReactPlayer
                    url={courseDetail?.lectures[0]?.videoUrl}
                    controls
                    width="100%"
                    height="100%"
                    playing={true}
                  />
                )}
              </div>
              <h1>Lecture title</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                Course Price: ₹{courseDetail?.price}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId!} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
