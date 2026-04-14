import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const isFormValid = fullName.trim().length >= 2;

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert("Falta información", "Ingresa tu nombre completo.");
      return;
    }

    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
      });

      Alert.alert("Perfil actualizado", "Tus datos se guardaron correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "No se pudo actualizar",
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
        <View style={styles.wrapper}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Editar perfil</Text>

            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Información personal</Text>

            <Text style={styles.label}>Nombre completo</Text>
            <Input
              placeholder="Tu nombre completo"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Text style={[styles.label, styles.labelSpacing]}>Correo electrónico</Text>
            <View style={styles.readonlyBox}>
              <Text style={styles.readonlyText}>{user?.email ?? "No disponible"}</Text>
            </View>

            <Text style={[styles.label, styles.labelSpacing]}>Teléfono</Text>
            <Input
              placeholder="+504 9999-9999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCorrect={false}
            />

            <Button
              title="Guardar cambios"
              onPress={handleSave}
              loading={isLoading}
              disabled={!isFormValid}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  wrapper: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  headerSpacer: {
    width: 42,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  labelSpacing: {
    marginTop: 12,
  },
  readonlyBox: {
    marginTop: 10,
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  readonlyText: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: "500",
  },
});