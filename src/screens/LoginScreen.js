import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { colors, radii, spacing } from "../theme/colors";
import { type } from "../theme/typography";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await login({ email, password });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.brand}>
        <Text style={styles.bolt}>⚡</Text>
        <Text style={styles.wordmark}>TAP</Text>
      </View>
      <Text style={styles.tagline}>Train with a live spotter in your pocket.</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.textFaint}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.button, submitting && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? "Signing in..." : "Sign in"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.base,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  brand: { flexDirection: "row", alignItems: "center", alignSelf: "center", gap: 8, marginBottom: spacing.sm },
  bolt: { fontSize: 28, color: colors.primary },
  wordmark: { ...type.h1, color: colors.primary, letterSpacing: 2 },
  tagline: { ...type.body, color: colors.textMuted, textAlign: "center", marginBottom: spacing.xl },
  form: { gap: spacing.md },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: colors.text,
    ...type.body,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: { ...type.bodySemi, color: colors.text },
});
