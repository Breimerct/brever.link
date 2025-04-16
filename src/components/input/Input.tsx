import { useId, type FC, type InputHTMLAttributes } from "react";
import { cn } from "@/helpers/utils";
import { useFormContext, useFormState } from "react-hook-form";
import type { Link } from "@/types/link.type";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  datalist?: Link[];
}

const Input: FC<Props> = ({
  label,
  name,
  required,
  className,
  datalist,
  disabled,
  id,
  ...props
}) => {
  const { register } = useFormContext();
  const { errors } = useFormState();
  const inputId = id || useId();
  const listId = `${inputId}-datalist`;

  return (
    <>
      <label htmlFor={inputId} className="relative flex flex-col">
        {label && (
          <span className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300 text-left">
            {label}
            {required && <span className="text-red-500">*</span>}
          </span>
        )}
        <input
          {...register(name || "")}
          name={name}
          id={inputId}
          list={listId}
          className={cn(
            "border-none p-2 w-full rounded-md outline outline-slate-700 hover:outline-slate-600 focus:outline-slate-500 focus:ring-2 focus:ring-slate-500 transition duration-200 ease-in-out text-ellipsis",
            {
              "!outline-red-500": !!errors[name]?.message,
              "cursor-not-allowed opacity-50 outline-slate-400/80 !bg-slate-300 dark:!bg-slate-300":
                disabled,
            },
            "dark:bg-slate-800 dark:text-slate-200 dark:outline-slate-700 dark:hover:outline-slate-600 dark:focus:outline-slate-500 dark:focus:ring-slate-500",
            className,
          )}
          disabled={disabled}
          required={required}
          {...props}
        />
        {errors[name]?.message && (
          <span className="text-sm text-red-500 absolute -bottom-5">
            {errors[name]?.message?.toString() || "This field is required"}
          </span>
        )}
      </label>

      {!!datalist?.length && (
        <datalist id={listId}>
          {datalist.map((item) => (
            <option key={item.id} value={item.slug} />
          ))}
        </datalist>
      )}
    </>
  );
};

export default Input;
