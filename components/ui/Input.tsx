import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded border border-line-strong bg-paper-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint",
          "focus:border-ink focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
