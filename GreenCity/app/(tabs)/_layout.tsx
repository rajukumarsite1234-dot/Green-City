import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );

  if (!user) return <Tabs.Screen name="(auth)/login" />;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
