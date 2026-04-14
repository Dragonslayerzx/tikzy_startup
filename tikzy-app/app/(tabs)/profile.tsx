import Button from "@/src/components/ui/Button";
import Screen from "@/src/components/ui/Screen";
import { useAuthStore } from "@/src/store/auth.store";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  const initials =
    user?.full_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>

          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <Text style={styles.name}>{user?.full_name || "Usuario"}</Text>
            <Text style={styles.email}>{user?.email || "Sin correo"}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Ionicons
                  name="person-outline"
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.badgeText}>
                  {user?.is_operator ? "Operador" : "Pasajero"}
                </Text>
              </View>

              {user?.is_admin ? (
                <View style={[styles.badge, styles.adminBadge]}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={14}
                    color="#0F766E"
                  />
                  <Text style={[styles.badgeText, styles.adminBadgeText]}>
                    Admin
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Información de cuenta</Text>

          <View style={styles.infoCard}>
            <InfoRow
              icon="person-outline"
              label="Nombre completo"
              value={user?.full_name || "No disponible"}
            />
            <Divider />
            <InfoRow
              icon="mail-outline"
              label="Correo electrónico"
              value={user?.email || "No disponible"}
            />
            <Divider />
            <InfoRow
              icon="call-outline"
              label="Teléfono"
              value={user?.phone || "No registrado"}
            />
            <Divider />
            <InfoRow
              icon="checkmark-circle-outline"
              label="Estado"
              value={user?.is_active ? "Activo" : "Inactivo"}
            />
          </View>

          <Text style={styles.sectionTitle}>Acciones</Text>

          <View style={styles.actionsCard}>
            <TouchableOpacity
              style={styles.actionRow}
              activeOpacity={0.8}
              onPress={() => router.push("/profile/edit")}
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIconBox}>
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.actionText}>Editar perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Button title="Cerrar sesión" onPress={handleLogout} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>

      <View style={styles.infoTextBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 18,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  email: {
    marginTop: 6,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  adminBadge: {
    backgroundColor: "#CCFBF1",
  },
  adminBadgeText: {
    color: "#0F766E",
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  actionRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});