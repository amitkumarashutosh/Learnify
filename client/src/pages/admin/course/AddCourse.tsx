import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseAPI } from "@/app/features/api/courseAPI";
import { CourseInput } from "@/types/course";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { categories } from "@/constants";

const AddCourse = () => {
  const [courseInput, setCourseInput] = useState<CourseInput>({
    title: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getSelectedCategory = (value: string) => {
    setCourseInput({ ...courseInput, category: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseInput({ ...courseInput, [e.target.name]: e.target.value });
  };

  const createCourseHandler = async () => {
    try {
      setIsLoading(true);
      const response = await courseAPI.createCourse(courseInput);
      if (response.success === true) {
        toast.success(response.message);
        navigate("/admin/course");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 mx-10 mt-16">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course, add some basic course details for your new course
        </h1>
        <p className="text-sm">
          This is the first step to creating your course. You will add more.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={courseInput.title}
            onChange={handleInputChange}
            placeholder="Your Course Name"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button onClick={createCourseHandler}>Create</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
