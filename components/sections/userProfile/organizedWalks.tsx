import WalkList from "./WalkList";
import { useAuth } from "@/context/AuthContext";

export default function OrganizedWalks(): JSX.Element {
  const { userInfo } = useAuth();

  if (!userInfo) return <div></div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <WalkList walkIds={userInfo.walkDetails.ownWalk} title="Organized Walks" />
    </div>
  );
}
