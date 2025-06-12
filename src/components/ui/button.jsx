import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
    (
        { className, variant = "default", size = "default", ...props },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-indigo-500",
                    variant === "default" && "bg-indigo-500 text-white hover:bg-indigo-600",
                    variant === "outline" && "bg-transparent text-foreground hover:bg-accent",
                    variant === "ghost" && "bg-transparent text-foreground hover:bg-accent",
                    size === "default" && "h-10 px-4 py-2",
                    size === "sm" && "h-9 px-3",
                    size === "lg" && "h-11 px-8",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button }; 