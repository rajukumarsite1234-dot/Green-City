import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function Login() {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.replace("/(tabs)/home");
  }, [user]);

  async function handleLogin() {
    const ok = await login(email, password);
    if (!ok) setError("Invalid credentials");
  }

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8">Login</Text>

      {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text
        className="text-blue-600 mt-4"
        onPress={() => router.push("/(auth)/signup")}
      >
        Create account
      </Text>
    </View>
  );
}
