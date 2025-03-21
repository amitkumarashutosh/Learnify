import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { startRegistration } from "@simplewebauthn/browser";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { ProfileUpdateInput } from "@/types/auth";
import { authAPI } from "@/app/features/api/authAPI";
import { setUser } from "@/app/features/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [updateData, setUpdateData] = useState<ProfileUpdateInput>({});
  const [isSecure, setIsSecure] = useState<boolean>(false);
  const [isPasskeyExist, setIsPasskeyExist] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [registerPasskeyLoading, setRegisterPasskeyLoading] =
    useState<boolean>(false);
  const [securePasskeyLoading, setSecurePasskeyLoading] =
    useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        setUpdateData({ ...updateData, avatar: file });
      }
    } else if (e.target.type === "text") {
      setUpdateData({ ...updateData, username: e.target.value });
    }
  };

  const updateUserHandler = async () => {
    if (!updateData.username && !updateData.avatar) {
      toast.error("No changes made.");
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.updateProfile(updateData);
      if (response.success === true) {
        toast.success("Profile updated successfully.");
        dispatch(setUser(response.user));
      }
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUser = async () => {
    try {
      const response = await authAPI.profile();
      if (response.user?.passkeys && response.user.passkeys.length > 0)
        setIsPasskeyExist(true);
      if (response.success === true) {
        dispatch(setUser(response.user));
      }
    } catch (error) {}
  };

  const handleRegisterPasskey = async () => {
    try {
      setRegisterPasskeyLoading(true);
      const data = await fetch("/api/passkey/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await data.json();

      if (!response.success) {
        return toast.error(response.message);
      }
      const registerPasskey = await startRegistration({
        optionsJSON: response.options,
      });
      if (!registerPasskey) {
        return toast.error("Invalid while register passkey");
      }

      const verifyPasskey = await fetch("/api/passkey/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: registerPasskey }),
      });

      if (verifyPasskey) {
        setIsPasskeyExist(true);
        return toast.success("Passkey register successfully.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setRegisterPasskeyLoading(false);
    }
  };

  const isUserSecure = async () => {
    try {
      const response = await authAPI.getUserSecure();
      if (response.success) {
        if (response.secure) setIsSecure(response.secure);
        else setIsSecure(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleTwoFactorAuth = async () => {
    try {
      if (!isPasskeyExist) return toast.success("Register passkey first.");

      setSecurePasskeyLoading(true);
      const response = await authAPI.updateTwoFactorAuth();
      if (response.success) {
        if (response.secure) setIsSecure(response.secure);
        else setIsSecure(false);
        toast.success(
          `Two-Factor Authentication ${isSecure ? "Disabled" : "Enabled"}.`
        );
      } else {
        toast.error("Failed to update Two-Factor Authentication.");
      }
    } catch (error) {
      console.error("Error updating Two-Factor Authentication:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSecurePasskeyLoading(false);
    }
  };

  const handlePasskeys = () => {
    if (!isPasskeyExist) {
      return toast.success("Register passkey first.");
    }
    navigate("/passkeys");
  };

  useEffect(() => {
    fetchUser();
    isUserSecure();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 my-20">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage src={user?.avatar || ""} alt="User Avatar" />
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.username || "N/A"}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email || "N/A"}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role?.toUpperCase() || "N/A"}
              </span>
            </h1>
          </div>
          <div>
            <div className="mt-2 flex items-center gap-4 ">
              <Label htmlFor="tfa" className="text-md">
                Two-Factor Auth:
              </Label>
              <Button
                size="sm"
                className=""
                onClick={handleTwoFactorAuth}
                disabled={securePasskeyLoading}
              >
                {securePasskeyLoading
                  ? "Loading..."
                  : isSecure
                  ? "Disable"
                  : "Enable"}
              </Button>
            </div>
            <Button
              variant={"destructive"}
              className="w-[218px] mt-2"
              onClick={handlePasskeys}
            >
              Manage Passkeys
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    defaultValue={user?.username || ""}
                    onChange={onChangeHandler}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                {loading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </Button>
                ) : (
                  <Button onClick={updateUserHandler}>Save Changes</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            disabled={registerPasskeyLoading}
            size="sm"
            className="ml-2"
            onClick={handleRegisterPasskey}
          >
            {registerPasskeyLoading ? "Please wait..." : " Register Passkey"}
          </Button>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses?.length === 0 ? (
            <h1>You haven't enrolled yet</h1>
          ) : (
            user?.enrolledCourses?.map((course: any) => (
              <Course key={course?._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
