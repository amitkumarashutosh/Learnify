import { courseAPI } from "@/app/features/api/courseAPI";
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
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = import.meta.env.VITE_API_URL;

interface UploadVideoInfo {
  videoUrl: string;
  publicId: string;
}

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState<string>("");
  const [uploadVideoInfo, setUploadVideoInfo] =
    useState<UploadVideoInfo | null>(null);
  const [isFree, setIsFree] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [btnDisable, setBtnDisable] = useState<boolean>(true);
  const params = useParams();
  const { courseId, lectureId } = params as {
    courseId: string;
    lectureId: string;
  };
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a video file to upload.");
      return;
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "File size exceeds the 50MB limit. Please choose a smaller file."
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploadProgress(true);

    try {
      const res = await axios.post(
        `${MEDIA_API}/api/media/upload-video`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        console.log(res.data.data.public_id);
        setUploadVideoInfo({
          videoUrl: res.data.data.url,
          publicId: res.data.data.public_id,
        });
        setBtnDisable(false);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadProgress(false);
    }
  };

  const editLectureHandler = async () => {
    if (!lectureTitle || !uploadVideoInfo) {
      toast.error("Video and title is required");
      return;
    }

    try {
      setIsUpdateLoading(true);
      const res = await courseAPI.updateLecture(
        courseId,
        lectureId,
        lectureTitle,
        uploadVideoInfo.videoUrl,
        uploadVideoInfo.publicId,
        isFree
      );
      if (res.success) {
        toast.success("Lecture updated successfully");
        navigate(`/admin/course/${courseId}/lecture`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to update the lecture.");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const removeLectureHandler = async () => {
    try {
      setRemoveLoading(true);
      const res = await courseAPI.deleteLecture(courseId, lectureId);
      if (res.success) {
        toast.success("Lecture deleted successfully");
        navigate(`/admin/course/${courseId}/lecture`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to remove the lecture.");
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription className="mb-1">
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={removeLoading}
            variant="destructive"
            onClick={removeLectureHandler}
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="lecture-title">Title</Label>
          <Input
            id="lecture-title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to JavaScript"
          />
        </div>
        <div className="my-5">
          <Label htmlFor="video-upload">
            Video <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={fileChangeHandler}
              className="w-fit"
            />
            {uploadProgress && <Loader2 className=" h-5 w-5 animate-spin" />}
          </div>
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onCheckedChange={() => setIsFree(!isFree)}
            id="free-video"
          />
          <Label htmlFor="free-video">Is this video FREE</Label>
        </div>

        <div className="mt-4">
          <Button
            disabled={isUpdateLoading || btnDisable}
            onClick={editLectureHandler}
          >
            {isUpdateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
