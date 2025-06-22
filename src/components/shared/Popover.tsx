import React from "react";
import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PopoverContentProps {
  children: ReactNode;
  className?: string;
}

interface PopoverTriggerProps {
  children: ReactNode;
}

export const Popover = ({ children, open, onOpenChange }: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = (val: boolean) => {
    if (isControlled) {
      onOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
  };

  return (
    <PopoverContext.Provider value={{ open: actualOpen, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};
  

const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: (val: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null }, // null 허용
});

export const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  const { open, setOpen, triggerRef } = React.useContext(PopoverContext);

  return (
    <div
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className='inline-flex items-center'
    >
      {children}
    </div>
  );
};
  

export const PopoverContent = ({
  children,
  className = "",
}: PopoverContentProps) => {
  const { open, setOpen, triggerRef } = React.useContext(PopoverContext);
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
  }, [open, triggerRef.current]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!open) return null;

  return createPortal(
    <div
      ref={ref}
      className={`absolute z-[9999] ${className}`}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {children}
    </div>,
    document.body
  );
};
  

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;

export default Popover;
