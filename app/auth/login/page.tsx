"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/validations/authSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { account } from "@/lib/helpers/toastNotification";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

type loginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const form = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: loginFormData) {
    try {
      await axios.post("/api/auth/login", data);
      toast(account.login);
      form.reset();
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          description: error.response.data.message,
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
  }

  const handleShowPass = () => setShowPassword(!showPassword);

  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 relative"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <div
                      onClick={handleShowPass}
                      className="absolute top-1/2 right-3"
                    >
                      {showPassword ? (
                        <EyeOpenIcon className="w-5 h-5" />
                      ) : (
                        <EyeClosedIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline select-none"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={""}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover aspect-square  dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
