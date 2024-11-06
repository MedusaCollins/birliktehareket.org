import PostList from "../landing/postList";

export default function AttendedWalks(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center">
      <PostList params={{ title: "rally" }} />
    </div>
  );
}
