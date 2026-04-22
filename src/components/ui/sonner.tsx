'use client';

import { CheckCircle2, CircleAlert, Info, Loader2, TriangleAlert } from 'lucide-react';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const iconBase = 'h-[15px] w-[15px]' as const;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      duration={4000}
      offset={24}
      visibleToasts={3}
      gap={10}
      icons={{
        success: <CheckCircle2 className={iconBase} strokeWidth={2} />,
        error: <CircleAlert className={iconBase} strokeWidth={2} />,
        warning: <TriangleAlert className={iconBase} strokeWidth={2} />,
        info: <Info className={iconBase} strokeWidth={2} />,
        loading: <Loader2 className={`${iconBase} animate-spin`} strokeWidth={2} />,
      }}
      {...props}
    />
  );
};

export { Toaster };
