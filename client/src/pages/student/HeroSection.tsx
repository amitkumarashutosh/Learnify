import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const exploreCoursesHandler = () => {
    navigate(`/course/search?query`);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 dark:from-gray-800 dark:via-gray-900 dark:to-black py-28 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-extrabold leading-tight mb-6">
          Discover Your Next Learning Adventure
        </h1>
        <p className="text-gray-200 dark:text-gray-400 text-lg mb-10">
          Explore, Learn, and Grow with expertly curated courses tailored just
          for you.
        </p>

        <form
          onSubmit={searchHandler}
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-xl overflow-hidden max-w-xl mx-auto mb-8"
        >
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for courses..."
            aria-label="Search Courses"
            className="flex-grow text-base border-none focus:ring-0 px-6 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-600"
          />
          <Button
            type="submit"
            aria-label="Search"
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-8 py-3 font-semibold text-base hover:bg-indigo-700 dark:hover:bg-indigo-800 transition duration-300"
          >
            Search
          </Button>
        </form>
        <Button
          onClick={exploreCoursesHandler}
          aria-label="Explore Courses"
          className="bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 px-6 py-3 rounded-full font-medium text-base shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
