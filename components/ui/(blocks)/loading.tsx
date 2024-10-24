import { Skeleton } from "../skeleton";

const loading = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <div className="flex flex-col space-y-3 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border-b-2 pb-5 px-2 max-w-[1200px] w-screen h-[346px]"
          >
            <Skeleton className="h-4 w-[100px]" />
            <div className="flex overflow-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-3 p-5 rounded-md group h-fit w-[287px]"
                >
                  <Skeleton className="h-[148px] w-[247px] rounded-xl mb-2" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[230px] mb-5" />
                    <Skeleton className="h-3 w-[200px]" />
                    <Skeleton className="h-2.5 w-[247px]" />
                    <Skeleton className="h-2.5 w-[210px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return <></>;
  }
};

export default loading;
