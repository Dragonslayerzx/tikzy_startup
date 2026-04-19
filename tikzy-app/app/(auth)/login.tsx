import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { images } from "@/constants/images";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Faltan datos", "Completa correo y contraseña.");
      return;
    }

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      const user = useAuthStore.getState().user;

      if (user?.is_operator) {
        router.replace("/(operator)/panel");
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      Alert.alert(
        "No se pudo iniciar sesión",
        error instanceof Error ? error.message : "Revisa tus credenciales."
      );
    }
  }

  function handleGooglePress() {
    router.push("/register");
  }

  function handleApplePress() {
    router.push("/register");
  }

  return (
    <Screen>
      <View style={styles.outer}>
        <View style={styles.phoneFrame}>
          <View style={styles.topSection}>
            <Image source={images.logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.tagline}>Viaja inteligente, viaja Tikzy</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Bienvenido de nuevo</Text>

            <Text style={styles.label}>Correo electrónico</Text>
            <Input
              placeholder="ejemplo@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, styles.labelSpacing]}>Contraseña</Text>
            <Input
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.forgot}>¿Olvidé mi contraseña?</Text>
            </TouchableOpacity>

            <Button
              title="Iniciar sesión"
              onPress={handleLogin}
              loading={isLoading}
              disabled={!email.trim() || !password.trim()}
            />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>o continuar con</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.85}
                onPress={handleGooglePress}
              >
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                activeOpacity={0.85}
                onPress={handleApplePress}
              >
                <Text style={styles.appleText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>¿No tienes una cuenta? </Text>
            <Link href="/register" style={styles.bottomLink}>
              Crear una cuenta
            </Link>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  phoneFrame: {
    width: "100%",
    maxWidth: 430,
    flex: 1,
    maxHeight: 932,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    marginTop: 18,
  },
  logo: {
    width: 220,
    height: 120,
  },
  tagline: {
    marginTop: -6,
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 28,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  labelSpacing: {
    marginTop: 10,
  },
  forgot: {
    marginTop: 12,
    textAlign: "right",
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.muted,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    gap: 14,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  appleButton: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },
  socialText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  appleText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  bottomText: {
    color: colors.text,
    fontSize: 15,
  },
  bottomLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
});