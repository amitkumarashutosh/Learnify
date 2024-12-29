import { purchaseAPI } from "@/app/features/api/purchaseAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoursePurchaseType } from "@/types/course";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [purchasedCourse, setPurchasedCourse] = useState<CoursePurchaseType[]>(
    []
  );

  const courseData = purchasedCourse.map((course) => ({
    price: course.amount,
  }));

  const totalRevenue = purchasedCourse.reduce(
    (acc, course) => acc + course.amount,
    0
  );

  const totalSales = purchasedCourse.length;

  const fetchAllPurchases = async () => {
    setIsLoading(true);
    try {
      const response = await purchaseAPI.getAllPurchasedCourses();
      setPurchasedCourse(response.purchasedCourse);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllPurchases();
  }, []);

  if (isLoading) {
    return <Loader2 className="h-10 w-10 animate-spin" />;
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-16">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
        </CardContent>
      </Card>

      {/* Course Prices Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30} // Rotated labels for better visibility
                textAnchor="end"
                interval={0} // Display all labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2" // Changed color to a different shade of blue
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
