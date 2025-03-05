import { z } from "zod";
import { ObjectId } from "mongodb";

export type PostList = {
  subject: string;
  posts: Post[];
};

export type Post = {
  _id: ObjectId;
  title: string;
  images: string[];
  description: string;
  detail: {
    startDate: string;
    location: {
      start: string;
      end: string;
    };
    minimumPeopleExpectation: number;
    subject: string;
  };
  organizer: string;
  moderators: { userId: string; date: string }[];
  supporters: { userId: string; date: string }[];
  updates: {
    date: string;
    title: string;
    message: string;
    userId: string;
    images: string[];
  }[];
  postInfo: {
    createdAt: string;
    createdBy: {
      userId: string;
      username: string;
      userImage: string;
      ownWalkCount: number;
    };
  };
};

export type User = {
  id: string;
  email: string;
  username: string;
  image: string;
  createdAt: string;
  walkDetails: WalkDetails;
};

export type WalkDetails = {
  savedWalk: Post[];
  ownWalk: Post[];
  supportedWalk: Post[];
};

export type AuthContextType = {
  isLoggedIn: boolean;
  userInfo: User | null;
  loading: boolean;
  fetchUserInfo: (id: string, updateProfile?: boolean) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
};

export type PostContextType = {
  post: Post | undefined;
  loading: boolean;
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  fetchPost: (id: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
};

export type ProfileHandlerReturn = {
  id: string;
  userId: string | undefined;
  displayData: User | null;
  section: "attendedwalks" | "organizedwalks" | "savedwalks";
  handleLoadingChange: (newSection: "attendedwalks" | "organizedwalks" | "savedwalks") => void;
  isLoading: boolean;
  sectionTitles: {
    [key: string]: "Attended Walks" | "Organized Walks" | "Saved Walks";
  };
  walkDetails: User["walkDetails"] | undefined;
  walkSections: {
    attendedwalks: Post[] | undefined;
    organizedwalks: Post[] | undefined;
    savedwalks: Post[] | undefined;
  };
};

export const CreatePost = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  organizer: z.string().min(1, "Organizer is required"),
  images: z.union([
    z.array(z.string().url("Invalid image URL")).max(5, "Maximum 5 images"),
    z.string().min(1, "At least one image is required").url("Invalid image URL"),
  ]),
  detail: z.object({
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
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
        date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
      })
    )
    .optional(),
  supporters: z.array(
    z.object({
      userId: z.string(),
      date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    })
  ),
  postInfo: z.object({
    createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    createdBy: z.object({
      userId: z.string(),
      username: z.string(),
      userImage: z.string(),
      ownWalkCount: z.number(),
    }),
  }),
  updates: z.array(
    z.object({
      date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
      title: z.string().min(1, "Title is required"),
      message: z.string().min(1, "Message is required"),
      userId: z.string(),
      images: z.array(z.string().url("Invalid image URL")).optional(),
    })
  ),
});

export const PostUpdate = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  detail: z.object({
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    location: z.object({
      start: z.string().min(3, "Start location is required"),
      end: z.string().min(3, "End location is required"),
    }),
  }),
  moderators: z.array(
    z.object({
      userId: z.string(),
      date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
        .optional(),
    })
  ),
});

export type PostUpdate = z.infer<typeof PostUpdate>;
export type CreatePost = z.infer<typeof CreatePost>;
