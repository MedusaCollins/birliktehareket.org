import { z } from "zod";

export type PostList = {
  subject: string;
  posts: Post[];
};

export const Post = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  organizer: z.string().min(1, "Organizer is required"),
  images: z.union([
    z.array(z.string().url("Invalid image URL")).max(5, "Maximum 5 images"),
    z
      .string()
      .min(1, "At least one image is required")
      .url("Invalid image URL"),
  ]),
  detail: z.object({
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    location: z.object({
      start: z.string().min(1, "Start location is required"),
      end: z.string().min(1, "End location is required"),
    }),
    minimumPeopleExpectation: z.coerce.number().min(1, "Must be at least 1"),
    subject: z.string().min(1, "Subject is required"),
  }),
  moderators: z
    .array(
      z.object({
        userId: z.string(),
        date: z
          .string()
          .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
      }),
    )
    .optional(),
  supporters: z
    .array(
      z.object({
        userId: z.string(),
        date: z
          .string()
          .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
      }),
    )
    .optional(),
  updates: z
    .array(
      z.object({
        date: z
          .string()
          .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
        title: z.string(),
        message: z.string(),
        userId: z.string(),
        images: z.array(z.string().url("Invalid image URL")).optional(),
      }),
    )
    .optional(),
  postInfo: z
    .object({
      createdAt: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
      createdBy: z.string(),
    })
    .optional(),
});

export type User = {
  id: string;
  email: string;
  username: string;
  image: string;
  createdAt: string;
  walkDetails: WalkDetails;
};

export type WalkDetails = {
  savedWalk: string[];
  ownWalk: string[];
  supportedWalk: string[];
};

export type AuthContextType = {
  isLoggedIn: boolean;
  userNotFound: boolean;
  userInfo: User | null;
  profileData: User | null;
  checkAuthStatus: () => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
  getProfileData: (id: string) => Promise<void>;
  logout: () => Promise<void>;
};

export type PostContextType = {
  post: Post | undefined;
  loading: boolean;
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  fetchPost: (id: string) => Promise<void>;
};

export type Post = z.infer<typeof Post>;
