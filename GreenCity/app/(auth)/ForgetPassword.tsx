// app/(auth)/ForgetPassword.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement password reset logic
      // const response = await api.post('/auth/forgot-password', { email });
      setMessage('If an account exists with this email, you will receive a password reset link.');
      setTimeout(() => router.back(), 3000);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6 bg-white">
      <TouchableOpacity 
        onPress={() => router.back()}
        className="mb-6"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-2">Reset Password</Text>
      <Text className="text-gray-600 mb-8">
        Enter your email and we'll send you a link to reset your password.
      </Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {message ? (
        <Text className={`text-sm mb-4 ${message.includes('error') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </Text>
      ) : null}

      <TouchableOpacity
        className="bg-green-500 py-3 rounded-lg items-center"
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text className="text-white font-medium">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center">
        <Text className="text-gray-600">Remember your password? </Text>
        <Link href="/(auth)/login" className="text-green-600 font-medium">
          Back to Login
        </Link>
      </View>
    </View>
  );
};

export default ForgetPassword;