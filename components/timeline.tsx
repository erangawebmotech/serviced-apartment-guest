import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";
import { Badge } from "./ui/badge";

const Timeline = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />)
Timeline.displayName = "Timeline";

const TimelineItem = forwardRef<
  HTMLDivElement,
  React.LiHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('group relative pb-8 pl-8 sm:pl-44', className)}
    {...props}
  />
));
TimelineItem.displayName = 'TimelineItem';

const TimelineHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref}
  className={cn('group-last:before:hidden sm:before:left-0 sm:after:left-0 before:left-2 after:left-2 after:box-content before:absolute after:absolute flex sm:flex-row flex-col items-start before:self-start before:bg-slate-300 after:bg-foreground mb-1 sm:before:ml-[10rem] sm:after:ml-[10rem] before:px-px after:border-4 after:border-primary-foreground/95 after:rounded-full after:w-2 before:h-full after:h-2 before:-translate-x-1/2 before:translate-y-3 after:-translate-x-1/2 after:translate-y-1.5',
    className)} {...props} />)
TimelineHeader.displayName = "TimelineHeader";


const TimelineTitle = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('font-bold text-primary text-xl', className)}
    {...props}
  >
    {children}
  </div>
));
TimelineTitle.displayName = 'TimelineTitle';


const TimelineTime = ({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof Badge>) => {
  return (
    <Badge
      className={cn(
        'inline-flex left-0 sm:absolute justify-center items-center mb-3 sm:mb-0 w-36 h-6 font-semibold text-xs uppercase translate-y-0.5',
        className
      )}
      variant={variant}
      {...props}
    >
      {props.children}
    </Badge>
  );
};
TimelineTime.displayName = 'TimelineTime';

const TimelineDescription = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-muted-foreground', className)}
    {...props}
  />
));
TimelineDescription.displayName = 'TimelineDescription';

export { Timeline, TimelineItem, TimelineHeader, TimelineTitle, TimelineTime, TimelineDescription }