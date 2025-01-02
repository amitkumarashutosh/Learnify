import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { purchaseAPI } from "@/app/features/api/purchaseAPI";
import { useState } from "react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }: { courseId: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const purchaseCourseHandler = async () => {
    setIsLoading(true);
    try {
      const res = await purchaseAPI.createChechoutSession(courseId);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
