import * as React from "react"
import { cn } from "../../lib/utils"
import { Dialog, DialogContent } from "./dialog"

const SheetContext = React.createContext()

export function Sheet({ open, onOpenChange, children }) {
    return (
        <SheetContext.Provider value={{ open, onOpenChange }}>
            <Dialog open={open} onOpenChange={onOpenChange}>{children}</Dialog>
        </SheetContext.Provider>
    )
}

export function SheetTrigger({ asChild, children, ...props }) {
    return React.cloneElement(children, {
        ...props,
        onClick: (e) => {
            if (children.props.onClick) children.props.onClick(e)
            if (props.onClick) props.onClick(e)
        },
    })
}

export function SheetContent({ side = "right", className, children, ...props }) {
    return (
        <DialogContent
            className={cn(
                "fixed z-50 flex flex-col bg-background p-6 shadow-lg transition-all",
                side === "right" && "right-0 top-0 h-full w-80 border-l",
                side === "left" && "left-0 top-0 h-full w-80 border-r",
                side === "top" && "top-0 left-0 w-full border-b",
                side === "bottom" && "bottom-0 left-0 w-full border-t",
                className
            )}
            {...props}
        >
            {children}
        </DialogContent>
    )
}

export function SheetHeader({ className, ...props }) {
    return <div className={cn("mb-4", className)} {...props} />
}

export function SheetTitle({ className, ...props }) {
    return <h2 className={cn("text-lg font-semibold", className)} {...props} />
} 