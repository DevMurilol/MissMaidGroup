import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return <Tag className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", className)}>{children}</Tag>;
}
