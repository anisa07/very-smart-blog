import { z } from "zod";
import type { SubmitHandler} from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../formInput/FormInput";
import type { FC } from "react";
import { SubmitButton } from "../submitButton/SubmitButton";

const promptSchema = z.object({
  prompt: z.string().min(4, { message: "Prompt is required" }),
});

export type Prompt = z.infer<typeof promptSchema>;

interface PromptForm {
  loading: boolean,
  onSend: ({prompt}: Prompt) => void
}
export const PromptForm: FC<PromptForm> = ({ onSend, loading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Prompt>({
    resolver: zodResolver(promptSchema),
    mode: "onBlur",
    defaultValues: {
      prompt: ''
    }
  });

  const onSubmit: SubmitHandler<Prompt> = (data) => {
    onSend(data)
    reset()
  };

  return <>
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <FormInput placeholder="Write topic of your article here e.g. strawberry" name="prompt" error={errors.prompt?.message} label="Prompt" register={register} />
      <SubmitButton label="Generate article" disabled={loading} />
    </form>
  </>
}
