import { progressAPI } from "@/app/features/api/progressAPI";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Course, LectureType } from "@/types/course";
import { LectureProgress } from "@/types/progress";
import { CheckCircle2, CirclePlay, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const CourseProgress = () => {
  const [courseDetails, setCourseDetails] = useState<Course>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lectures, setLectures] = useState<LectureType[]>([]);
  const [currentLecture, setCurrentLecture] = useState<LectureType | null>(
    null
  );
  const [progress, setProgress] = useState<LectureProgress[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const params = useParams();
  const courseId = params.courseId;

  const fetchCourseProgress = async () => {
    setIsLoading(true);
    try {
      const response = await progressAPI.getCourseProgress(courseId!);
      if (response.success) {
        setCourseDetails(response.courseDetails);
        setProgress(response.progress || []);
        if (response.courseDetails.lectures) {
          setLectures(response.courseDetails.lectures);
          setCurrentLecture(response.courseDetails.lectures[0]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLectureProgress = async (lectureId: string) => {
    try {
      await progressAPI.updateLectureProgress(courseId!, lectureId);

      setProgress((prevProgress) => {
        const existingLectureIndex = prevProgress.findIndex(
          (lecture) => lecture.lectureId === lectureId
        );

        if (existingLectureIndex !== -1) {
          const updatedProgress = [...prevProgress];
          updatedProgress[existingLectureIndex].viewed = true;
          return updatedProgress;
        } else {
          return [...prevProgress, { lectureId, viewed: true }];
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectLecture = (lecture: LectureType) => {
    setCurrentLecture(lecture);
  };

  const isLectureCompleted = (lectureId: string) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  useEffect(() => {
    fetchCourseProgress();
  }, []);

  if (isLoading) return <Loader2 className="mx-auto mt-20 animate-spin" />;

  return (
    <div className="max-w-7xl mx-auto p-4 mt-16">
      {/* Display course name  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseDetails?.title}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section  */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              ref={videoRef}
              src={
                currentLecture?.videoUrl ||
                (courseDetails?.lectures && courseDetails?.lectures[0].videoUrl)
              }
              controls
              className="w-full h-auto md:rounded-lg"
              onTimeUpdate={() => {
                const video = videoRef.current;
                if (video) {
                  const progress = (video.currentTime / video.duration) * 100;
                  if (progress >= 70) {
                    const lectureId =
                      currentLecture?._id || courseDetails?.lectures?.[0]?._id;
                    if (lectureId) {
                      handleLectureProgress(lectureId);
                    }
                  }
                }
              }}
            />
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2 pl-2">
            <h3 className="font-medium text-lg">
              {currentLecture?.title ||
                (courseDetails?.lectures && courseDetails?.lectures[0].title)}
            </h3>
          </div>
        </div>
        {/* Lecture Sidebar  */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {lectures.map((lecture, index) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:dark:bg-gray-800"
                    : ""
                } `}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {index + 1}. {lecture?.title}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
