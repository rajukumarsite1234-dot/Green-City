import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { Text, View } from "react-native";
export default function Profile() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl mb-4">Profile</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
