import React from "react";
import { cn } from "@/helpers";
import type { ButtonHTMLAttributes } from "react";
import IconLoading from "../icons/IconLoading";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  prependIcon?: React.ReactNode;
  appendIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<Props> = ({
  fullWidth,
  prependIcon,
  appendIcon,
  className,
  isLoading,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "bg-slate-900 text-white px-4 py-2 rounded-md",
        "hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2",
        "transition duration-200 ease-in-out cursor-pointer flex items-center justify-center gap-2",
        {
          "w-full block": fullWidth,
          "opacity-40 cursor-not-allowed pointer-events-none": isLoading,
        },
        className,
      )}
      disabled={isLoading}
      {...props}
    >
      {prependIcon && <span>{prependIcon}</span>}

      <span className="w-full text-center text-nowrap overflow-hidden text-ellipsis font-bold uppercase">
        {isLoading ? "Loading..." : children}
      </span>

      {isLoading && (
        <span>
          <IconLoading className="animate-spin transition-all" />
        </span>
      )}
      {appendIcon && !isLoading && <span>{appendIcon}</span>}
    </button>
  );
};

export default Button;
