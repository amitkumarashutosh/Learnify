import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { LectureType } from "@/types/course";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Lecture = ({
  lecture,
  courseId,
  title,
  index,
}: {
  lecture: LectureType;
  courseId: string;
  title: string;
  index: number;
}) => {
  const navigate = useNavigate();
  return (
    <TableRow>
      <TableCell>{index}.</TableCell>
      <TableCell>{lecture.title}</TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`${lecture._id}`)}
        >
          <Edit />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Lecture;
