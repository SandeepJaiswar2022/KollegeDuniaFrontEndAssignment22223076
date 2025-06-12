import React from "react";
import { cn } from "../../lib/utils";

const DatePicker = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            type="date"
            ref={ref}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
});

DatePicker.displayName = "DatePicker";

export { DatePicker }; 