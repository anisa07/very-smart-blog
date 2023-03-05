import type { FC } from "react";
import type { FormInput } from "../formInput/FormInput";

export const FormText: FC<FormInput> = ({ register, name, error, label, placeholder}) => {

  return <div className="my-2">
    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor={name}>{label}</label>
    <textarea rows={15} className={`resize-none w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${error ? "border-red-500" : ''} 
    rounded appearance-none focus:outline-none focus:shadow-outline`} id={name} {...register(name)} placeholder={placeholder} />
    {error ? <p className="text-xs text-red-500 ">{error}</p> : <></>}
  </div>
}
