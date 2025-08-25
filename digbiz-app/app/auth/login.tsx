// app/auth/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInInput } from "@/lib/validators/auth";
import { signInEmail, mapAuthError } from "@/lib/auth";
import { Link } from "expo-router";
import { useGoogleSignIn } from "@/lib/google";

export default function Login() {
  const { control, handleSubmit } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const [loading, setLoading] = useState(false);

  // Replace these IDs with your actual Google OAuth client IDs
  const signInWithGoogle = useGoogleSignIn({
    iosClientId: "<IOS_CLIENT_ID>",
    androidClientId: "<ANDROID_CLIENT_ID>",
    webClientId: "<WEB_CLIENT_ID>",
    // expoClientId: "<EXPO_CLIENT_ID>", // optional for Expo Go
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setLoading(true);
      await signInEmail(values.email, values.password);
      // Redirect handled by AuthProvider guard in app/_layout.tsx
    } catch (e: any) {
      Alert.alert("Sign in failed", mapAuthError(e?.code));
    } finally {
      setLoading(false);
    }
  });

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>
        Sign In
      </Text>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <>
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={field.value}
              onChangeText={field.onChange}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 8,
              }}
            />
            {fieldState.error && (
              <Text style={{ color: "crimson" }}>{fieldState.error.message}</Text>
            )}
          </>
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <>
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 8,
              }}
            />
            {fieldState.error && (
              <Text style={{ color: "crimson" }}>{fieldState.error.message}</Text>
            )}
          </>
        )}
      />

      <Button
        title={loading ? "Signing in..." : "Sign In"}
        onPress={onSubmit}
        disabled={loading}
      />

      <View style={{ height: 10 }} />
      <Link href="/auth/signup">Create an account</Link>

      <View style={{ height: 20 }} />
      <Button
        title="Continue with Google"
        onPress={async () => {
          try {
            await signInWithGoogle();
          } catch (e: any) {
            Alert.alert("Google Sign-In", e?.message ?? "Failed");
          }
        }}
      />
    </View>
  );
}
