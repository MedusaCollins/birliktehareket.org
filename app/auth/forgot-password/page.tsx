"use client";

import EmailForm from "@/components/sections/auth/forgot-password/form/email";
import VerificationCodeForm from "@/components/sections/auth/forgot-password/form/verification";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "@/lib/validations/authSchemas";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/helpers/toastNotification";
import ResetPasswordForm from "@/components/sections/auth/forgot-password/form/reset";
import { useRouter } from "next/navigation";

type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type verificationCodeFormData = z.infer<typeof verificationCodeSchema>;
type resetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ForgotPassword = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [section, setSection] = useState<"email" | "code" | "reset">("email");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);

  const handleEmailSubmit = async (data: forgotPasswordFormData) => {
    try {
      await axios.post("/api/auth/forgot-password/request", data);
      setSavedEmail(data.email);
      setSection("code");
      toast(auth.passwordResetRequest);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCodeSubmit = async (data: verificationCodeFormData) => {
    try {
      await axios.post("/api/auth/forgot-password/verify", {
        email: savedEmail,
        verificationCode: data.verificationCode,
      });
      setSection("reset");
      toast(auth.verificationCodeConfirmed);
    } catch (error) {
      handleError(error);
    }
  };

  const handleResetSubmit = async (data: resetPasswordFormData) => {
    try {
      await axios.post("/api/auth/forgot-password/reset", {
        email: savedEmail,
        newPassword: data.newPassword,
      });
      toast(auth.passwordUpdated);
      await axios.post("/api/auth/login", {
        email: savedEmail,
        password: data.newPassword,
      });
      router.push("/");
    } catch (error) {
      handleError(error);
    }
  };

  const handleResendCode = async () => {
    try {
      const email = savedEmail;
      if (!email) {
        console.error("No email saved");
        return;
      }
      await axios.post("/api/auth/forgot-password/request", { email });
      toast(auth.passwordResetRequest);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
    ) {
      toast({
        description: (error.response.data as { message: string }).message, // message'ı güvenle kullanabilirsin
        variant: "destructive",
        duration: 2000,
      });
    } else {
      toast({
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 2000,
      });
      console.error(error);
    }
  };

  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        {section === "email" ? (
          <EmailForm onFormSubmit={handleEmailSubmit} />
        ) : section === "code" ? (
          <VerificationCodeForm
            onFormSubmit={handleCodeSubmit}
            onResendCode={handleResendCode}
          />
        ) : (
          <ResetPasswordForm onFormSubmit={handleResetSubmit} />
        )}
      </div>
      <div className="hidden bg-muted lg:block">
        {/* Image remains the same */}
      </div>
    </div>
  );
};

export default ForgotPassword;
