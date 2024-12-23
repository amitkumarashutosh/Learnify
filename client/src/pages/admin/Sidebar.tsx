import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="hidden lg:flex flex-col bg-gray-50 w-[250px] sm:w-[300px] border-r border-gray-300 dark:border-gray-700 p-5 h-screen sticky top-0">
      <div className="space-y-2 mt-16">
        <Link
          to="course"
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
        >
          <SquareLibrary size={22} />
          <h1>Courses</h1>
        </Link>
        <Link
          to="dashboard"
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
        >
          <ChartNoAxesColumn size={22} />
          <h1>Dashboard</h1>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
