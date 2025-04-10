import type { FC, InputHTMLAttributes } from "react";
import { cn } from "@/helpers/utils";
import { useFormContext, useFormState } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  type?: "text" | "email" | "password" | "url";
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const Input: FC<Props> = ({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className,
  ...props
}) => {
  const { register } = useFormContext();
  const { errors } = useFormState();

  return (
    <label className="relative flex flex-col">
      {label && (
        <span className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300 text-left">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <input
        {...register(name || "")}
        type={type}
        name={name}
        id={name}
        className={cn(
          "border-none p-2 w-full rounded-md outline outline-slate-700 hover:outline-slate-600 focus:outline-slate-500 focus:ring-2 focus:ring-slate-500 transition duration-200 ease-in-out text-ellipsis",
          {
            "!outline-red-500": !!errors[name]?.message,
          },
          "dark:bg-slate-800 dark:text-slate-200 dark:outline-slate-700 dark:hover:outline-slate-600 dark:focus:outline-slate-500 dark:focus:ring-slate-500",
          className,
        )}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {errors[name]?.message && (
        <span className="text-sm text-red-500 absolute -bottom-5">
          {errors[name]?.message?.toString() || "This field is required"}
        </span>
      )}
    </label>
  );
};

export default Input;
