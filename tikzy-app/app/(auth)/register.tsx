import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import { images } from "@/constants/images";
import { colors } from "@/src/theme/colors";
import { Link } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
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
            <Input placeholder="Juan Pérez" />

            <Text style={[styles.label, styles.labelSpacing]}>
              Correo electrónico
            </Text>
            <Input placeholder="ejemplo@correo.com" />

            <Text style={[styles.label, styles.labelSpacing]}>Teléfono</Text>
            <Input placeholder="+504 9999-9999" />

            <Text style={[styles.label, styles.labelSpacing]}>Contraseña</Text>
            <Input placeholder="••••••••" secureTextEntry />

            <View style={styles.termsRow}>
              <TouchableOpacity style={styles.checkbox} activeOpacity={0.8} />
              <Text style={styles.termsText}>
                Acepto{" "}
                <Text style={styles.termsLink}>términos y condiciones</Text>
              </Text>
            </View>

            <Button title="Crear mi cuenta" />

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