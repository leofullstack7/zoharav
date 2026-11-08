import Image from "next/image";

export function Monogram({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/mark.png"
      alt=""
      width={72}
      height={72}
      className={className}
      priority={priority}
    />
  );
}
