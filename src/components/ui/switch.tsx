import * as React from "react";

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    return (
      <button
        type='button'
        role='switch'
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-blue-600" : "bg-gray-300"
        } ${className}`}
        onClick={() => onCheckedChange && onCheckedChange(!checked)}
        ref={ref}
        {...props}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
