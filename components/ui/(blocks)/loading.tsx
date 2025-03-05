"use client";

import { Skeleton } from "../skeleton";

const loading = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <div className="flex flex-col overflow-hidden">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 overflow-hidden">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col space-y-3 transition-all p-4 rounded-md group h-fit w-[310px]"
            >
              <div>
                <Skeleton className="h-[166px] w-[278px] rounded-xl mb-2" />
              </div>

              <div className="space-y-3">
                <div>
                  <Skeleton className="h-4 w-[150px] mb-3" />

                  <h1 className="text-lg font-semibold text-slate-800 truncate">
                    <Skeleton className="h-4 w-[230px] mb-1" />
                  </h1>
                </div>
                <Skeleton className="h-2.5 w-full mb-5" />

                <Skeleton className="h-3 w-[100px]" />

                <Skeleton className="h-3 w-[180px]" />

                <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                  <div className="flex items-center space-x-1 truncate">
                    <Skeleton className="h-4 w-[150px]" />
                  </div>

                  <div className="flex items-center space-x-1 truncate">
                    <Skeleton className="w-[70px] h-4 text-slate-500" />
                  </div>
                </div>
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
