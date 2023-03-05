import type { FC } from "react";
import type { UseFormRegister } from "react-hook-form";

export interface FormInput {
  name: string,
  error?: string,
  label: string,
  register: UseFormRegister<any>,
  placeholder?: string
}
export const FormInput: FC<FormInput> = ({ register, name, error, label, placeholder}) => {

  return <div className="my-2">
    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor={name}>{label}</label>
    <input className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${error ? "border-red-500" : ''} 
    rounded appearance-none focus:outline-none focus:shadow-outline`} id={name} {...register(name)} placeholder={placeholder} />
    {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : <></>}
  </div>
}
