import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/src/theme/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("@/assets/images/tikzy_log.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={styles.notifButton} activeOpacity={0.8}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#111827"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Avatar + Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={44} color="#FFFFFF" />
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={22} color="#1F3CCF" />
            </View>
          </View>
          <Text style={styles.profileName}>Marcus Richardson</Text>
          <Text style={styles.profileEmail}>
            marcus.richardson@design.co
          </Text>
        </View>

        {/* Trip Stats Card */}
        <View style={styles.statsCard}>
          <View>
            <Text style={styles.statsLabel}>VIAJES TOTALES</Text>
            <Text style={styles.statsValue}>142</Text>
            <Text style={styles.statsGrowth}>+12 este mes</Text>
          </View>
          <View style={styles.statsIconContainer}>
            <Ionicons name="bus" size={24} color={colors.primary} />
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#6B7280"
            />
            <Text style={styles.sectionTitle}>Informacion personal</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NOMBRE COMPLETO</Text>
            <View style={styles.infoValueRow}>
              <Text style={styles.infoValue}>Marcus Richardson</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons
                  name="pencil-outline"
                  size={18}
                  color="#D1D5DB"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NUMERO DE TELEFONO</Text>
            <View style={styles.infoValueRow}>
              <Text style={styles.infoValue}>+504 32323232</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons
                  name="pencil-outline"
                  size={18}
                  color="#D1D5DB"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <TouchableOpacity style={styles.paymentCard} activeOpacity={0.8}>
          <View style={styles.paymentIconContainer}>
            <Ionicons name="card" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Metodos de pago</Text>
            <Text style={styles.paymentSubtitle}>
              Visa ending in •••• 4242
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>

        {/* Settings Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={20} color="#6B7280" />
            <Text style={styles.sectionTitle}>Ajustes</Text>
          </View>

          {/* Notifications Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: "#FEF3C7" },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color="#F59E0B"
                />
              </View>
              <Text style={styles.settingLabel}>Notificaciones</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#D1D5DB", true: "#6EE7B7" }}
              thumbColor={notificationsEnabled ? "#10B981" : "#F4F3F4"}
            />
          </View>

          <View style={styles.infoDivider} />

          {/* Security */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: "#EEF1FF" },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.settingLabel}>
                Seguridad y contraseña
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.infoDivider} />

          {/* Terms */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: "#F3E8FF" },
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#8B5CF6"
                />
              </View>
              <Text style={styles.settingLabel}>
                Terminos y politicas de seguridad
              </Text>
            </View>
            <Ionicons
              name="open-outline"
              size={18}
              color="#D1D5DB"
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.9}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Cerrar sesion</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Tikzy v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F0FE",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 100,
    height: 36,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  /* Profile Avatar */
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
  },

  /* Stats Card */
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
  },
  statsGrowth: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981",
    marginTop: 2,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  /* Info Rows */
  infoRow: {
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  /* Payment Card */
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  paymentSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 2,
  },

  /* Settings Rows */
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  /* Logout */
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 20,
    height: 56,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#EF4444",
  },

  /* Version */
  versionText: {
    textAlign: "center",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
  },
});