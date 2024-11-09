import WalkList from "./WalkList";
import { useAuth } from "@/context/AuthContext";

export default function SavedWalks(): JSX.Element {
  const { userInfo } = useAuth();

  if (!userInfo) return <div></div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <WalkList walkIds={userInfo.walkDetails.savedWalk} title="Saved Walks" />
    </div>
  );
}
