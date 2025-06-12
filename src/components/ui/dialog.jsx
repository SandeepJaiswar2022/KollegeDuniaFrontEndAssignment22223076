import * as React from "react"
import { cn } from "../../lib/utils"

export function Dialog({ open, onOpenChange, children }) {
    const [isOpen, setIsOpen] = React.useState(open || false)

    React.useEffect(() => {
        setIsOpen(open)
    }, [open])

    const handleClose = () => {
        setIsOpen(false)
        if (onOpenChange) onOpenChange(false)
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative bg-background rounded-lg shadow-lg w-full max-w-lg mx-auto">
                        {children}
                        <button
                            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export function DialogContent({ className, children, ...props }) {
    return (
        <div className={cn("p-6", className)} {...props}>
            {children}
        </div>
    )
} 