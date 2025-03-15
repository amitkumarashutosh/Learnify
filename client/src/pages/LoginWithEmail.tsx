import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/features/authSlice";
import { useNavigate } from "react-router-dom";

const LoginWithEmail = () => {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      setSendLoading(true);
      const data = await fetch("/api/user/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const response = await data.json();
      if (response.success) {
        setShowOtp(true);
        return toast.success(response.message);
      }
      toast.error(response.message);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setVerifyLoading(true);
      const data = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const response = await data.json();
      if (response.success) {
        dispatch(setUser(response.user));
        navigate("/");
        return toast.success(response.message);
      }
      toast.error(response.message);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-80 p-6 bg-white rounded-2xl shadow-lg">
        <Input
          type="email"
          placeholder="Enter your email"
          className="mb-4"
          value={email}
          disabled={showOtp}
          onChange={handleEmailChange}
        />
        {sendLoading ? (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
          </Button>
        ) : (
          showOtp === false && (
            <Button className="w-full mb-4" onClick={handleSendEmail}>
              Submit
            </Button>
          )
        )}

        {showOtp && (
          <InputOTP value={otp} onChange={setOtp} maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        )}
        {showOtp &&
          (verifyLoading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </Button>
          ) : (
            <Button className="w-full mt-4" onClick={handleVerifyEmail}>
              Submit
            </Button>
          ))}
      </div>
    </div>
  );
};

export default LoginWithEmail;
