import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginInput, SignupInput } from "../types/auth";
import { authAPI } from "@/app/features/api/authAPI";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/app/features/authSlice";
import axios from "axios";

type TabValue = "login" | "register";

export function Login() {
  const [loginInput, setLoginInput] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [signupInput, setSignupInput] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabValue>("register");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: TabValue
  ) => {
    const { name, value } = e.target;

    if (type === "login") {
      setLoginInput({
        ...loginInput,
        [name]: value,
      });
    } else if (type === "register") {
      setSignupInput({
        ...signupInput,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    type: "login" | "signup"
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (type === "login") {
        const response = await authAPI.login(loginInput);
        if (response.success === true) {
          toast.success(response.message);
          dispatch(setUser(response.user));
          navigate("/");
        }
      } else if (type === "signup") {
        const response = await authAPI.signup(signupInput);
        if (response.success === true) {
          toast.success(response.message);
          setActiveTab("login");
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <form onSubmit={(e) => handleSubmit(e, "signup")}>
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Create a new account by filling in the details below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Username</Label>
                  <Input
                    type="text"
                    placeholder="admin"
                    name="username"
                    value={signupInput.username}
                    onChange={(e) => handleInputChange(e, "register")}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    name="email"
                    value={signupInput.email}
                    onChange={(e) => handleInputChange(e, "register")}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="******"
                    name="password"
                    value={signupInput.password}
                    onChange={(e) => handleInputChange(e, "register")}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                {loading ? (
                  <Button disabled className="w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                )}
                <p className="text-sm">
                  Already have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setActiveTab("login")}
                  >
                    Login here
                  </span>
                </p>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="login">
          <form onSubmit={(e) => handleSubmit(e, "login")}>
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Access your account by entering your credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    name="email"
                    value={loginInput.email}
                    onChange={(e) => handleInputChange(e, "login")}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="******"
                    name="password"
                    value={loginInput.password}
                    onChange={(e) => handleInputChange(e, "login")}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                {loading ? (
                  <Button disabled className="w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                )}
                <p className="text-sm">
                  Don't have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setActiveTab("register")}
                  >
                    Register here
                  </span>
                </p>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
