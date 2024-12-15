import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePostContext } from "@/context/PostContext";

export default function ImagePreview() {
  const { post, selectedImage, setSelectedImage } = usePostContext();

  if (!post) return null;

  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-between h-full">
        <Image
          src={selectedImage}
          alt="post image"
          className="mx-auto rounded-xl"
          width={525}
          height={50}
        />
        <Carousel>
          <CarouselContent>
            {post.images.map((image: string, index: number) => {
              return (
                <CarouselItem
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className="basis-1/3"
                >
                  <Image
                    src={image}
                    alt="post image"
                    className="mx-auto rounded-xl"
                    width={225}
                    height={100}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
