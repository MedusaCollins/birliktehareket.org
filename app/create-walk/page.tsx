"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

type CreateWalkFormData = z.infer<typeof Post>;

export default function CreateWalk() {
  const { toast } = useToast();
  const { userInfo } = useAuth();
  const router = useRouter();

  if (!userInfo) {
    router.push("/auth/login");
  }

  const form = useForm<CreateWalkFormData>({
    resolver: zodResolver(Post),
    defaultValues: {
      title: "",
      description: "",
      organizer: "",
      images: [],
      detail: {
        startDate: "",
        location: {
          start: "",
          end: "",
        },
        minimumPeopleExpectation: 1,
        subject: "",
      },
    },
  });

  async function onSubmit(data: CreateWalkFormData) {
    const walkData = {
      title: data.title,
      description: data.description,
      organizer: data.organizer,
      images: [data.images],
      detail: data.detail,
      moderators: [{ userId: userInfo?.id, date: new Date().toISOString() }],
      userId: userInfo?.id,
    };
    try {
      const res = await axios.post("/api/posts/create", walkData);
      toast({ description: "Walk created successfully!", variant: "default" });
      if (userInfo)
        userInfo.walkDetails.ownWalk = [
          ...userInfo.walkDetails.ownWalk,
          res.data.walk.id,
        ];
      form.reset();
      router.push(`profile/${userInfo?.id}/organizedwalks`);
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
      }
    }
  }

  const handleAuth = () => {
    return userInfo
      ? true
      : toast({
        title: "Oops!",
        description: "You must be logged in to create a walk.",
        variant: "destructive",
        duration: 2000,
      });
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-50 p-6">
      <Card className="mx-auto w-full max-w-2xl shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Create a Walk
          </CardTitle>
          <CardDescription>
            Provide the details to organize a new walk.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter walk title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the walk" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>{" "}
                    {/*URL and only 1 image FOR NOW - open issue maybe*/}
                    <FormControl>
                      <Input placeholder="Enter an image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organizer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of the organizer "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="detail.startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value)
                                .toISOString()
                                .split("T")[0]
                              : ""
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="detail.minimumPeopleExpectation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum People Expectation</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter minimum people expectation"
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="detail.location.start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter starting location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="detail.location.end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ending location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="detail.subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Environment, Politics"
                        {...field}
                      />
                      {/* This gonna be a select option open issue maybe*/}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" onClick={handleAuth} className="w-full">
                Create Walk
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
