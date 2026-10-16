import Image from "next/image";
import { cn } from "@/lib/utils";

const sources = {
  mark: { src: "/brand/mashariki-law-mark.png", width: 864, height: 752 },
  full: { src: "/brand/mashariki-law-logo.png", width: 864, height: 896 },
} as const;

type Props = {
  variant?: keyof typeof sources;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ variant = "mark", className, priority = false }: Props) {
  const image = sources[variant];

  return (
    <Image
      src={image.src}
      alt=""
      width={image.width}
      height={image.height}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
