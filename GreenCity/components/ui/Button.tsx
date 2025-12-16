import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export function Button({ title, onPress, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      {...rest}
      className={`bg-blue-600 py-3 rounded-xl w-full mt-4 ${
        rest.className || ""
      }`}
    >
      <Text className="text-center text-white font-semibold text-lg">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
