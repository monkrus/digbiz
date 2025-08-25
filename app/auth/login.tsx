// app/auth/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../../lib/validators/auth";
import { signInEmail, mapAuthError } from "../../lib/auth";
import { Link, useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      setLoading(true);
      await signInEmail(email, password);
      router.replace("/main");
    } catch (e: any) {
      Alert.alert("Sign in failed", mapAuthError(e?.code));
    } finally {
      setLoading(false);
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Log in</Text>

      <Field
        control={control}
        name="email"
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field control={control} name="password" label="Password" secureTextEntry />

      <Button
        title={loading ? "Signing in..." : "Sign in"}
        onPress={onSubmit}
        disabled={loading}
      />

      <View style={{ height: 8 }} />
      <Link href="/auth/signup" style={{ color: "#007AFF" }}>
        Create an account
      </Link>
    </View>
  );
}

function Field(props: any) {
  const { control, name, label, ...rest } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: "600" }}>{label}</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={{
              borderWidth: 1,
              borderColor: fieldState.error ? "crimson" : "#ccc",
              padding: 10,
              borderRadius: 8,
            }}
            {...rest}
          />
          {fieldState.error && (
            <Text style={{ color: "crimson" }}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
