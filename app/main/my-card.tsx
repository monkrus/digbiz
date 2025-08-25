// app/main/my-card.tsx
import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, Button, Alert, ScrollView, Switch, Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "../../lib/validators/profile";
import { auth } from "../../lib/firebase";
import { loadProfile, saveProfile } from "../../lib/firestore";
import { pickImage, uploadImageAsync } from "../../lib/storage";
import type { UserProfile } from "../../lib/types";

const defaultVisibility = {
  name: true, title: true, company: true, phone: false, email: true,
  website: true, twitter: false, linkedin: true, github: false,
  avatarUrl: true, logoUrl: true,
};

export default function MyCardScreen() {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | undefined>();

  const { control, handleSubmit, setValue, watch, reset } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "", title: "", company: "", phone: "",
      email: auth.currentUser?.email ?? "",
      website: "", twitter: "", linkedin: "", github: "",
      avatarUrl: "", logoUrl: "", visibility: defaultVisibility,
    },
  });

  useEffect(() => {
    (async () => {
      const p = await loadProfile();
      if (p) {
        reset({
          ...p,
          title: p.title ?? "", company: p.company ?? "", phone: p.phone ?? "",
          website: p.website ?? "", twitter: p.twitter ?? "", linkedin: p.linkedin ?? "",
          github: p.github ?? "", avatarUrl: p.avatarUrl ?? "", logoUrl: p.logoUrl ?? "",
        });
        setAvatarPreview(p.avatarUrl);
        setLogoPreview(p.logoUrl);
      }
    })().catch((e) => console.log("Load profile error", e));
  }, [reset]);

  const onPickAvatar = async () => {
    const uri = await pickImage();
    if (!uri) return;
    setAvatarPreview(uri);
    setValue("avatarUrl", uri);
  };

  const onPickLogo = async () => {
    const uri = await pickImage();
    if (!uri) return;
    setLogoPreview(uri);
    setValue("logoUrl", uri);
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setLoading(true);
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("No authenticated user. Please sign in again.");

      let avatarUrl = values.avatarUrl || "";
      let logoUrl = values.logoUrl || "";
      const isLocal = (u?: string) => !!u && /^(file:|data:|blob:)/.test(u);

      if (isLocal(avatarUrl)) {
        avatarUrl = await uploadImageAsync(avatarUrl, `users/${uid}/avatar.jpg`);
      }
      if (isLocal(logoUrl)) {
        logoUrl = await uploadImageAsync(logoUrl, `users/${uid}/logo.jpg`);
      }

      const payload: UserProfile = {
        uid,
        name: values.name.trim(),
        title: values.title?.trim() || "",
        company: values.company?.trim() || "",
        phone: values.phone?.trim() || "",
        email: values.email.trim(),
        website: values.website?.trim() || "",
        twitter: values.twitter?.trim() || "",
        linkedin: values.linkedin?.trim() || "",
        github: values.github?.trim() || "",
        avatarUrl,
        logoUrl,
        visibility: values.visibility,
      };

      await saveProfile(payload);
      Alert.alert("Saved", "Your card has been updated.");
    } catch (e: any) {
      console.log("Save error:", e);
      Alert.alert("Save failed", e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  });

  const v = watch("visibility");

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>My Card</Text>

      <Text style={{ fontWeight: "600", marginTop: 8 }}>Avatar</Text>
      {avatarPreview ? (
        <Image source={{ uri: avatarPreview }} style={{ width: 96, height: 96, borderRadius: 48, marginTop: 6 }} />
      ) : null}
      <Button title="Pick avatar" onPress={onPickAvatar} />

      <Text style={{ fontWeight: "600", marginTop: 16 }}>Company Logo</Text>
      {logoPreview ? (
        <Image source={{ uri: logoPreview }} style={{ width: 120, height: 60, resizeMode: "contain", marginTop: 6 }} />
      ) : null}
      <Button title="Pick logo" onPress={onPickLogo} />

      <Field control={control} name="name" label="Name" />
      <Field control={control} name="title" label="Title" />
      <Field control={control} name="company" label="Company" />
      <Field control={control} name="phone" label="Phone" keyboardType="phone-pad" />
      <Field control={control} name="email" label="Email" autoCapitalize="none" keyboardType="email-address" />
      <Field control={control} name="website" label="Website (https://…)" autoCapitalize="none" />
      <Field control={control} name="twitter" label="Twitter" autoCapitalize="none" />
      <Field control={control} name="linkedin" label="LinkedIn" autoCapitalize="none" />
      <Field control={control} name="github" label="GitHub" autoCapitalize="none" />

      <Text style={{ fontWeight: "700", marginTop: 16 }}>Visibility</Text>
      {Object.keys(v).map((key) => (
        <VisRow
          key={key}
          label={key}
          value={(v as any)[key]}
          onChange={(val) => {
            // @ts-expect-error dynamic key
            setValue(`visibility.${key}`, val);
          }}
        />
      ))}

      <View style={{ height: 16 }} />
      <Button title={loading ? "Saving…" : "Save"} onPress={onSubmit} disabled={loading} />
      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

function Field(props: any) {
  const { control, name, label, ...rest } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: "600" }}>{label}</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={{
              borderWidth: 1,
              borderColor: fieldState.error ? "crimson" : "#ccc",
              padding: 10, borderRadius: 8, marginTop: 6,
            }}
            {...rest}
          />
          {fieldState.error && (
            <Text style={{ color: "crimson", marginTop: 4 }}>
              {fieldState.error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

function VisRow({
  label, value, onChange,
}: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 }}>
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
