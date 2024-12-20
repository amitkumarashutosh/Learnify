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

interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput extends LoginInput {
  username: string;
}

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "login" | "signup"
  ) => {
    const { name, value } = e.target;

    if (type === "login") {
      setLoginInput({
        ...loginInput,
        [name]: value,
      });
    } else if (type === "signup") {
      setSignupInput({
        ...signupInput,
        [name]: value,
      });
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    type: "login" | "signup"
  ) => {
    e.preventDefault();
    if (type === "login") {
      console.log("Login Input:", loginInput);
    } else if (type === "signup") {
      console.log("Signup Input:", signupInput);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <Tabs defaultValue="register" className="w-[400px]">
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
                    onChange={(e) => handleInputChange(e, "signup")}
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
                    onChange={(e) => handleInputChange(e, "signup")}
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
                    onChange={(e) => handleInputChange(e, "signup")}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                <Button type="submit" className="w-full">
                  Register
                </Button>
                <p className="text-sm">
                  Already have an account?{" "}
                  <span className="text-blue-600 cursor-pointer">
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
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <p className="text-sm">
                  Don't have an account?{" "}
                  <span className="text-blue-600 cursor-pointer">
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
