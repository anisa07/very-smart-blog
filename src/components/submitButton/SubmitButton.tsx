import type { FC } from "react";

interface SubmitButton {
  disabled: boolean,
  label: string,
  type?: "button" | "submit" | "reset" | undefined,
}
export const SubmitButton: FC<SubmitButton> = ({disabled, label, type}) => {
  return <button className="px-4 py-2 font-bold text-white bg-blue-700 rounded hover:bg-blue-500 focus:outline-none disabled:bg-gray-500 focus:shadow-outline self-center mt-2" type={type || 'submit'} disabled={disabled}>{label}</button>
}
