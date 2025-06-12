import * as React from "react";

export function Popover({ children }) {
  const [open, setOpen] = React.useState(false);
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type.displayName === "PopoverTrigger") {
      return React.cloneElement(child, { onClick: () => setOpen((o) => !o) });
    }
    if (child.type.displayName === "PopoverContent") {
      return open ? React.cloneElement(child, { onClose: () => setOpen(false) }) : null;
    }
    return child;
  });
}

export const PopoverTrigger = React.forwardRef(({ asChild, ...props }, ref) => {
  if (asChild && React.Children.count(props.children) === 1) {
    return React.cloneElement(props.children, { ref, ...props });
  }
  return (
    <button ref={ref} {...props} />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={`absolute z-50 mt-2 bg-popover text-popover-foreground rounded-md shadow-lg p-4 ${className || ""}`}
    {...props}
  >
    {children}
    <button className="absolute top-2 right-2 text-muted-foreground" onClick={onClose}>&times;</button>
  </div>
));
PopoverContent.displayName = "PopoverContent"; 