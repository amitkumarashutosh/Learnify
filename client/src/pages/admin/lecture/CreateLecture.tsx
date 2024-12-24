import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lecture from "./Lecture";
import { LectureType } from "@/types/course";
import { courseAPI } from "@/app/features/api/courseAPI";
import { toast } from "sonner";

const CreateLecture = () => {
  const [title, setTitle] = useState<string>("");
  const [lectures, setLectures] = useState<LectureType[]>([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams();

  const createLecture = async () => {
    try {
      if (!title) {
        toast.error("Title is required");
        return;
      }
      setIsLoading(true);
      const response = await courseAPI.addLecture(params.courseId!, title);
      if (response.lecture) {
        setLectures([...lectures, response.lecture]);
        toast.success("Lecture created successfully");
        setTitle("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create lecture");
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseLectures = async () => {
    try {
      const response = await courseAPI.getLectures(params.courseId!);
      if (response.lectures) {
        setLectures(response.lectures);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourseLectures();
  }, []);

  return (
    <div className="flex-1 mx-10 mt-16">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Add Lectures to Your Course</h1>
        <p className="text-sm">
          It's time to create your first lecture. Add content, resources, and
          any relevant materials to make it engaging for your learners.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your Course Name"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${params.courseId}`)}
          >
            Back
          </Button>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button onClick={createLecture}>Create Lecture</Button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Table>
          <TableCaption>A list of your recent courses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Lecture</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lectures?.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                index={index + 1}
                lecture={lecture}
                courseId={params.courseId!}
                title={lecture.title}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CreateLecture;
