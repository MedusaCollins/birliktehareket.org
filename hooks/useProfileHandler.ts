import { Post, ProfileHandlerReturn, User } from "@/lib/types";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useProfileHandler(): ProfileHandlerReturn {
  const { id } = useParams<{ id: string }>();
  const [section, setSection] = useState<
    "attendedwalks" | "organizedwalks" | "savedwalks"
  >("organizedwalks");
  const [displayData, setDisplayData] = useState<User | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const sectionTitles: Record<
    "attendedwalks" | "organizedwalks" | "savedwalks",
    "Attended Walks" | "Organized Walks" | "Saved Walks"
  > = {
    attendedwalks: "Attended Walks",
    organizedwalks: "Organized Walks",
    savedwalks: "Saved Walks",
  };
  const handleLoadingChange = (
    newSection: "attendedwalks" | "organizedwalks" | "savedwalks",
  ) => {
    setSection(newSection);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
  };

  useEffect(() => {
    async function fetchUserInfo(userId: string) {
      try {
        const response = await axios.post("/api/user", { userId });
        setDisplayData(response.data.userInfo);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/404");
      }
    }
    fetchUserInfo(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const walkDetails = displayData?.walkDetails;

  const walkSections = {
    attendedwalks: walkDetails?.supportedWalk as Post[] | undefined,
    organizedwalks: walkDetails?.ownWalk as Post[] | undefined,
    savedwalks: walkDetails?.savedWalk as Post[] | undefined,
  };
  return {
    id,
    displayData,
    section,
    handleLoadingChange,
    isLoading,
    sectionTitles,
    walkDetails,
    walkSections,
  };
}
