import { Menu, School } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import DarkMode from "./DarkMode";
import { User } from "@/types/auth";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop  */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-10 h-full px-2">
        <div className="flex items-center gap-2">
          <School size="30" />
          <h1 className="font-bold text-2xl">Learnify</h1>
        </div>
        {/* user icon and dropdown menu */}
        <div className="hidden md:flex items-center gap-6 cursor-pointer">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Learning</DropdownMenuItem>
                  {user.role === "instructor" && (
                    <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DarkMode />
        </div>

        {/* mobile */}
        <div className="md:hidden">
          <MobileNavbar user={user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

interface MobileNavbarProps {
  user: User | null;
}

const MobileNavbar = ({ user }: MobileNavbarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-3">
          <SheetTitle>
            {" "}
            <Link to="/">E-Learning</Link>
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4 w-full">
          <Link to="/learning">My Learning</Link>
          <Link to="/profile">Edit Profile</Link>
          <Link to="/login">Log out </Link>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button>Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
