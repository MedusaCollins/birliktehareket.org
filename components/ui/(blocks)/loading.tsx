import { Skeleton } from "../skeleton";

const loading = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-full w-3/4 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/4" />
          </div>
        </div>
        <div className="col-span-1 grid grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default loading;
