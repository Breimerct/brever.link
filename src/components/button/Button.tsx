import React from "react";
import { cn } from "@/helpers/utils";
import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  prependIcon?: React.ReactNode;
  appendIcon?: React.ReactNode;
}

const Button: React.FC<Props> = ({
  fullWidth,
  prependIcon,
  appendIcon,
  className,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        "bg-slate-900 text-white px-4 py-2 rounded-md",
        "hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2",
        "transition duration-200 ease-in-out cursor-pointer flex items-center justify-center gap-2",
        {
          "w-full block": fullWidth,
        },
        className,
      )}
    >
      {prependIcon && <span>{prependIcon}</span>}
      <span className="w-full text-center text-nowrap overflow-hidden text-ellipsis font-bold uppercase">
        {children}
      </span>
      {appendIcon && <span>{appendIcon}</span>}
    </button>
  );
};

export default Button;
