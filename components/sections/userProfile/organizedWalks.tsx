import WalkList from "./WalkList";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";

export default function OrganizedWalks(): JSX.Element {
  const { id } = useParams();
  const { profileData, userInfo } = useAuth();

  const isOwnProfile = userInfo?.id === id;

  const displayData = isOwnProfile ? userInfo : profileData;

  if (!displayData) return <div></div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <WalkList walkIds={displayData.walkDetails.ownWalk} title="Organized Walks" />
    </div>
  );
}
