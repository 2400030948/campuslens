import { ACCENT_PALETTE, initials, cn } from "@/lib/utils";

interface CollegeMarkProps {
  name: string;
  accentIndex: number;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
};

export default function CollegeMark({ name, accentIndex, size = "md" }: CollegeMarkProps) {
  const palette = ACCENT_PALETTE[accentIndex % ACCENT_PALETTE.length];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded font-display font-semibold",
        palette?.bg,
        palette?.text,
        SIZE_CLASSES[size]
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
