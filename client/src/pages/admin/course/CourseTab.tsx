import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { courseAPI } from "@/app/features/api/courseAPI";

const CourseTab = () => {
  const [input, setInput] = useState<Partial<Course>>({});
  const [previewThumbnail, setPreviewThumbnail] = useState<string>("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const selectCategory = (value: string) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value: string) => {
    setInput({ ...input, level: value });
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

  const isPublished = false;
  const isLoading = false;

  const updateCourseHandler = async () => {
    const formData = new FormData();
    if (input.title) formData.append("title", input.title);
    if (input.subtitle) formData.append("subtitle", input.subtitle);
    if (input.description) formData.append("description", input.description);
    if (input.category) formData.append("category", input.category);
    if (input.level) formData.append("level", input.level);
    if (input.price) formData.append("price", input.price.toString());

    if (input.thumbnail) formData.append("thumbnail", input.thumbnail);

    // Submit formData to the server here
  };

  const publishStatusHandler = async () => {
    //   try {
    //   const response = await publishCourse({courseId, query:action});
    //   if(response.data){
    //     refetch();
    //     toast.success(response.data.message);
    //   }
    // } catch (error) {
    //   toast.error("Failed to publish or unpublish course");
    //   }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseAPI.getCourse(params.courseId!);
        setInput(response);
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
          <Button variant={"outline"}>
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button>Remove course</Button>
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
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select
                defaultValue={input.category}
                onValueChange={selectCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select
                defaultValue={input.level}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
            {isLoading ? (
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
