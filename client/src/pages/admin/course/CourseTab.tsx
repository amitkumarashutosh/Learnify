import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { courseAPI } from "@/app/features/api/courseAPI";
import { toast } from "sonner";
import { categories } from "@/constants";

const CourseTab = () => {
  const [input, setInput] = useState<Partial<Course>>({});
  const [previewThumbnail, setPreviewThumbnail] = useState<string>("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publish, setPublish] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const navigate = useNavigate();
  const params = useParams();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput({ ...input, category: e.target.value });
  };

  const selectCourseLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput({ ...input, level: e.target.value });
  };

  const selectThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () =>
        setPreviewThumbnail(fileReader.result as string);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    if (input.title) formData.append("title", input.title);
    if (input.subtitle) formData.append("subtitle", input.subtitle);
    if (input.description) formData.append("description", input.description);
    if (input.category) formData.append("category", input.category);
    if (input.level) formData.append("level", input.level);
    if (input.price) formData.append("price", input.price.toString());
    if (input.thumbnail) formData.append("thumbnail", input.thumbnail);

    try {
      setIsSaving(true);
      const response = await courseAPI.updateCourse(params.courseId!, formData);
      if (response.course) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Failed to save course");
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatusHandler = async () => {
    try {
      setIsPublishing(true);
      const response = await courseAPI.updateCourseStatus(
        params.courseId!,
        !publish
      );
      if (response.success) {
        setPublish(!publish);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Failed to update course status");
    } finally {
      setIsPublishing(false);
    }
  };

  const deleteCourseHandler = async () => {
    try {
      setIsDeleting(true);
      const response = await courseAPI.deleteCourse(params.courseId!);
      if (response.success) {
        toast.success(response.message);
        navigate("/admin/course");
      }
    } catch (error) {
      toast.error("Failed to delete course");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseAPI.getCourse(params.courseId!);
        setInput(response);

        if (response.isPublished) setPublish(response.isPublished);
        if (typeof response.thumbnail === "string") {
          setImage(response.thumbnail);
        }
      } catch (error) {}
    };
    fetchCourse();
  }, [navigate]);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="mb-2">Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          {isPublishing ? (
            <Button disabled>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button variant={"outline"} onClick={updateStatusHandler}>
              {publish ? "Unpublish" : "Publish"}
            </Button>
          )}
          {isDeleting ? (
            <Button disabled>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={deleteCourseHandler} className="mt-2">
              Remove
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="Ex. Introduction to React"
              value={input.title}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subtitle"
              placeholder="Ex. A comprehensive guide to React"
              value={input.subtitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex flex-col gap-1 mt-1">
              <Label>Category</Label>
              <select
                value={input.category || ""}
                onChange={selectCategory}
                className="w-[180px] border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.label}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <Label>Course Level</Label>
              <select
                value={input.level || ""}
                onChange={selectCourseLevel}
                className="w-[180px] border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="" disabled>
                  Select a course level
                </option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advance">Advance</option>
              </select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="price"
                value={input.price}
                onChange={changeEventHandler}
                placeholder="₹199"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Course Thumbnail"
              />
            )}
            {!previewThumbnail && image && (
              <img src={image} className="w-64 my-2" alt="Course Thumbnail" />
            )}
          </div>
          <div className="space-x-2">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            {isSaving ? (
              <>
                <Button disabled>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              </>
            ) : (
              <Button onClick={updateCourseHandler}>Save</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
