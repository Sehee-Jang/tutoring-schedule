import { useToast } from "../../hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../ui/toast";
import { cn } from "../../lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              "bg-gray-900 text-white border-none shadow-lg rounded-lg p-4",
              "animate-in fade-in slide-in-from-bottom-5 duration-300"
            )}
          >
            <div className='grid gap-1'>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className='fixed bottom-4 right-4 z-[100] w-[360px] max-w-full flex flex-col gap-2 outline-none' />
    </ToastProvider>
  );
}
