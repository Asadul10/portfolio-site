import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = ({ children, className }: SelectContentProps) => {
  return (
    <div className={cn("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md", className)}>
      {children}
    </div>
  );
};

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <option value="">{placeholder || "Select..."}</option>;
};

const SelectItem = ({ value, children, className }: SelectItemProps) => {
  return (
    <option
      value={value}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      {children}
    </option>
  );
};

const SelectLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}>
      {children}
    </div>
  );
};

const SelectSeparator = ({ className }: { className?: string }) => {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />;
};

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;
const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
