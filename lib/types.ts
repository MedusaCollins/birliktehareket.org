export type PostList = {
  subject: string;
  posts: Post[];
};

export type Post = {
  title: string;
  description: string;
  organizer: string;
  moderators?: {
    userId: string;
  }[];
  images: string[];
  detail: {
    date: Date;
    location: { start: string; end: string };
    minimumPeopleExpectation: number;
    subject: string;
  };
  supporters?: {
    userId: string;
    date: Date;
  }[];
  updates?: {
    date: Date;
    message: string;
    userId: string;
    images?: string[];
  }[];
};
