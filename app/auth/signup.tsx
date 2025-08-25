// app/auth/signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "../../lib/validators/auth";
import { signUpEmail, mapAuthError } from "../../lib/auth";
import { Link } from "expo-router";

export default function Signup() {
  const { control, handleSubmit } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirm: "" },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      setLoading(true);
      await signUpEmail(email, password);
      // Navigation handled by the auth guard in app/_layout.tsx
    } catch (e: any) {
      Alert.alert("Sign up failed", mapAuthError(e?.code));
    } finally {
      setLoading(false);
    }
  });

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", textAlign: "center" }}>
        Create Account
      </Text>

      <Field
        control={control}
        name="email"
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field control={control} name="password" label="Password" secureTextEntry />
      <Field control={control} name="confirm" label="Confirm password" secureTextEntry />

      <Button
        title={loading ? "Creating..." : "Create account"}
        onPress={onSubmit}
        disabled={loading}
      />

      <View style={{ height: 8 }} />
      <Link href="/auth/login">Back to sign in</Link>
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
