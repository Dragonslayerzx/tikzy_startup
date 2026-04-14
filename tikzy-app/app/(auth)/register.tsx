import { images } from "@/constants/images";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const isFormValid =
    fullName.trim().length >= 2 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    acceptedTerms;

  async function handleRegister() {
    if (!fullName.trim()) {
      Alert.alert("Falta información", "Ingresa tu nombre completo.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Falta información", "Ingresa tu correo electrónico.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Contraseñas", "Las contraseñas no coinciden.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert(
        "Términos y condiciones",
        "Debes aceptar los términos y condiciones."
      );
      return;
    }

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() ? phone.trim() : undefined,
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
        "No se pudo crear la cuenta",
        error instanceof Error ? error.message : "Intenta nuevamente."
      );
    }
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.phoneFrame}>
          <View style={styles.topSection}>
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Crea tu cuenta ahora</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Registro</Text>

            <Text style={styles.label}>Nombre completo</Text>
            <Input
              placeholder="Juan Pérez"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={[styles.label, styles.labelSpacing]}>
              Correo electrónico
            </Text>
            <Input
              placeholder="ejemplo@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, styles.labelSpacing]}>Teléfono</Text>
            <Input
              placeholder="+504 9999-9999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
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

            <Text style={[styles.label, styles.labelSpacing]}>
              Confirmar contraseña
            </Text>
            <Input
              placeholder="••••••••"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.termsRow}
              activeOpacity={0.8}
              onPress={() => setAcceptedTerms((prev) => !prev)}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>

              <Text style={styles.termsText}>
                Acepto <Text style={styles.termsLink}>términos y condiciones</Text>
              </Text>
            </TouchableOpacity>

            <Button
              title="Crear mi cuenta"
              onPress={handleRegister}
              loading={isLoading}
              disabled={!isFormValid}
            />

            <View style={styles.bottomRowInside}>
              <Text style={styles.bottomText}>¿Ya tienes cuenta? </Text>
              <Link href="/login" style={styles.bottomLink}>
                Iniciar sesión
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  phoneFrame: {
    width: "100%",
    maxWidth: 430,
    justifyContent: "center",
  },
  topSection: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  logo: {
    width: 220,
    height: 120,
  },
  tagline: {
    marginTop: -6,
    fontSize: 18,
    color: colors.text,
    fontWeight: "500",
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
    marginBottom: 24,
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
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#D9C7F2",
    marginRight: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  termsText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "600",
  },
  bottomRowInside: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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