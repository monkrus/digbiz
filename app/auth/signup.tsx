import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/lib/validators/auth";
import { signUpEmail, mapAuthError } from "@/lib/auth";
import { Link } from "expo-router";

export default function Signup() {
  const { control, handleSubmit } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirm: "" },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    try {
      setLoading(true);
      await signUpEmail(values.email, values.password);
      // user will be redirected by the AuthProvider guard
    } catch (e: any) {
      Alert.alert("Sign up failed", mapAuthError(e?.code));
    } finally {
      setLoading(false);
    }
  });

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>Create Account</Text>

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
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }}
            />
            {fieldState.error && <Text style={{ color: "crimson" }}>{fieldState.error.message}</Text>}
          </>
        )}
      />

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
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }}
            />
            {fieldState.error && <Text style={{ color: "crimson" }}>{fieldState.error.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="confirm"
        render={({ field, fieldState }) => (
          <>
            <TextInput
              placeholder="Confirm password"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }}
            />
            {fieldState.error && <Text style={{ color: "crimson" }}>{fieldState.error.message}</Text>}
          </>
        )}
      />

      <Button title={loading ? "Creating..." : "Create account"} onPress={onSubmit} disabled={loading} />

      <View style={{ height: 8 }} />
      <Link href="/auth/login">Back to sign in</Link>
    </View>
  );
}
