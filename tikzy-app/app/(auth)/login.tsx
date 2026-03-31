import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import { colors } from "@/src/theme/colors";
import { Link } from "expo-router";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  return (
    <Screen>
      <View style={styles.outer}>
        <View style={styles.phoneFrame}>
          <View style={styles.topSection}>
            <Image
              source={require("../../assets/images/T.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Viaja inteligente, viaja Tikzy</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Bienvenido de nuevo</Text>

            <Text style={styles.label}>Correo electrónico</Text>
            <Input placeholder="ejemplo@correo.com" />

            <Text style={[styles.label, styles.labelSpacing]}>Contraseña</Text>
            <Input placeholder="••••••••" secureTextEntry />

            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.forgot}>¿Olvidé mi contraseña?</Text>
            </TouchableOpacity>

            <Button title="Iniciar sesión" />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>o continuar con</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                activeOpacity={0.85}
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