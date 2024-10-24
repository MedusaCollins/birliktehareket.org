// VerificationCodeForm.tsx
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verificationCodeSchema } from "@/lib/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type verificationCodeFormData = z.infer<typeof verificationCodeSchema>;

interface VerificationCodeFormProps {
  onFormSubmit: (data: verificationCodeFormData) => Promise<void>;
  onResendCode: () => void;
}

const VerificationCodeForm: React.FC<VerificationCodeFormProps> = ({
  onFormSubmit,
  onResendCode,
}) => {
  const { toast } = useToast();
  const formCode = useForm<verificationCodeFormData>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      verificationCode: "",
    },
    shouldUnregister: false,
  });

  const onSubmitCode = async (data: verificationCodeFormData) => {
    try {
      await onFormSubmit(data);
      formCode.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
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
    }
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Enter Verification Code</h1>
        <p className="text-balance text-muted-foreground">
          A verification code has been sent to your email. Please enter it below
          to reset your password.
        </p>
      </div>
      <Form {...formCode}>
        <form
          onSubmit={formCode.handleSubmit(onSubmitCode)}
          className="space-y-4"
        >
          <FormField
            control={formCode.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="verificationCode">
                  Verification Code
                </FormLabel>
                <FormControl>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="Enter verification code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Verify and Reset Password
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Didn&apos;t receive a code?{" "}
        <button type="button" className="underline" onClick={onResendCode}>
          Resend Code
        </button>
      </div>
    </div>
  );
};

export default VerificationCodeForm;
