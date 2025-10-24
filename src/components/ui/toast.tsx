import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
}

interface ToastTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface ToastDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

interface ToastActionProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface ToastCloseProps {
  className?: string;
  onClick?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
          variant === 'destructive' 
            ? 'destructive border-destructive bg-destructive text-destructive-foreground'
            : 'border bg-background text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Toast.displayName = 'Toast';

const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm font-semibold', className)}
      {...props}
    >
      {children}
    </div>
  )
);
ToastTitle.displayName = 'ToastTitle';

const ToastDescription = React.forwardRef<HTMLDivElement, ToastDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    >
      {children}
    </div>
  )
);
ToastDescription.displayName = 'ToastDescription';

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, children, onClick, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
);
ToastAction.displayName = 'ToastAction';

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  )
);
ToastClose.displayName = 'ToastClose';

const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ToastViewport = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
    {children}
  </div>
);

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
