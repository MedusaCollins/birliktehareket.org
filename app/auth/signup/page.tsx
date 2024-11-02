"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validations/authSchemas";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { account } from "@/lib/helpers/toastNotification";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    try {
      await axios.post("/api/auth/signup", data);
      toast(account.created);

      await axios.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      form.reset();
      setIsLoggedIn(true);
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
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
    <div className="flex justify-center items-center w-full h-screen">
      <Card className="mx-auto max-w-md md:w-full">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Max" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} />
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
                    <div className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <div onClick={handleShowPass} className="absolute bottom-2 right-3">
                        {showPassword ? (
                          <EyeOpenIcon className="w-5 h-5" />
                        ) : (
                          <EyeClosedIcon className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
