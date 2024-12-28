import { cn } from "@/lib/utils";

interface MascotMessageProps {
  message: string;
  className?: string;
}

export function MascotMessage({ message, className }: MascotMessageProps) {
  return (
    <p className={cn(
      "text-sm sm:text-base md:text-lg font-bold leading-relaxed",
      "text-gray-800 text-center sm:text-left",
      className
    )}>
      {message}
    </p>
  );
}