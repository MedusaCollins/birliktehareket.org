import { z } from "zod";

export type PostList = {
  subject: string;
  posts: Post[];
};

// Post tipini güncelliyoruz
export const Post = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  organizer: z.string().min(1, "Organizer is required"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .max(5, "Maximum 5 images"),
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
          .date()
          .refine((value) => !isNaN(value.getTime()), "Invalid date"),
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
      createdBy: z.object({
        userId: z.string(),
        username: z.string(),
        userImage: z.string(),
        ownWalkCount: z.number(),
      }), // Kullanıcı bilgilerini burada belirtiyoruz
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
  userInfo: User | null;
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
};

export type ProfileHandlerReturn = {
  id: string;
  displayData: User | null;
  section: "attendedwalks" | "organizedwalks" | "savedwalks";
  handleLoadingChange: (
    newSection: "attendedwalks" | "organizedwalks" | "savedwalks",
  ) => void;
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

export type Post = z.infer<typeof Post>;
