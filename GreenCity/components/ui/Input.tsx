import { TextInput, TextInputProps } from "react-native";

export interface InputProps extends TextInputProps {
  className?: string;
}

export function Input({ className, ...rest }: InputProps) {
  return (
    <TextInput
      {...rest}
      className={`w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-gray-100 ${
        className || ""
      }`}
    />
  );
}
