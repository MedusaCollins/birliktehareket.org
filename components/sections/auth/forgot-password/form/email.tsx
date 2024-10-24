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
import { forgotPasswordSchema } from "@/lib/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface EmailFormProps {
  onFormSubmit: (data: forgotPasswordFormData) => Promise<void>; // Async fonksiyon türü
}

const EmailForm: React.FC<EmailFormProps> = ({ onFormSubmit }) => {
  const formEmail = useForm<forgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmitEmail = async (data: forgotPasswordFormData) => {
    try {
      await onFormSubmit(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to receive a password reset code
        </p>
      </div>
      <Form {...formEmail}>
        <form
          onSubmit={formEmail.handleSubmit(onSubmitEmail)}
          className="space-y-4"
        >
          <FormField
            control={formEmail.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Send Reset Code
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Remember your password?{" "}
        <Link href="/auth/login" className="underline">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default EmailForm;
