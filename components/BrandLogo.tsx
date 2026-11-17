import Image from "next/image";
import { cn } from "@/lib/utils";

// The single Mashirika Law logo used across the site. To replace it, drop the new
// artwork at this path (transparent PNG, roughly square, at least 512px wide) and
// update width/height to its pixel size. app/icon.png (512x512) is the favicon and
// should be regenerated from the same artwork.
const logo = { src: "/brand/mashirika-law-mark.png", width: 864, height: 752 } as const;

type Props = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: Props) {
  return (
    <Image
      src={logo.src}
      alt=""
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
