import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of skeleton lines to render */
  count?: number;
  /** Layout: stacked vertical or inline horizontal */
  layout?: "vertical" | "horizontal";
}

/**
 * Accessible loading skeleton with shimmer animation.
 * Respects prefers-reduced-motion by showing a static placeholder.
 */
function Skeleton({ className, count = 1, layout = "vertical", ...props }: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(
        "animate-shimmer rounded-lg bg-gradient-to-r from-muted via-muted/80 to-muted bg-[length:200%_100%]",
        layout === "horizontal" ? "h-4 flex-1" : "h-4 w-full",
        className
      )}
      aria-hidden="true"
    />
  ));

  return (
    <div
      className={cn(
        "gap-3",
        layout === "horizontal" ? "flex items-center" : "flex flex-col"
      )}
      role="status"
      aria-label="Loading content"
    >
      {items}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export { Skeleton };
