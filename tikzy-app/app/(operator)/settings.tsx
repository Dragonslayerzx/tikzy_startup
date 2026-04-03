import React, { useState } from "react";
import {
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
import { useOperatorStore } from "@/src/store/useOperatorStore";

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  hasChevron?: boolean;
  iconColor?: string;
  iconBg?: string;
};

function SettingItem({
  icon,
  label,
  onPress,
  hasChevron = true,
  iconColor = "#1F3CCF",
  iconBg = "#EEF1FF",
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      {hasChevron && (
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );
}

type ToggleItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  iconColor?: string;
  iconBg?: string;
};

function ToggleItem({
  icon,
  label,
  value,
  onToggle,
  iconColor = "#1F3CCF",
  iconBg = "#EEF1FF",
}: ToggleItemProps) {
  return (
    <View style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#D1D5DB", true: "#93B4FF" }}
        thumbColor={value ? "#1F3CCF" : "#F4F3F4"}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { operatorName, operatorId } = useOperatorStore();

  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [trafficAlerts, setTrafficAlerts] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.headerTitle}>Ajustes</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={36} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{operatorName}</Text>
            <Text style={styles.profileId}>ID: {operatorId}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <Ionicons name="pencil-outline" size={18} color="#1F3CCF" />
          </TouchableOpacity>
        </View>

        {/* Route Preferences */}
        <Text style={styles.sectionTitle}>Preferencias de Ruta</Text>
        <View style={styles.sectionCard}>
          <ToggleItem
            icon="navigate-outline"
            label="GPS activo"
            value={gpsEnabled}
            onToggle={setGpsEnabled}
            iconColor="#22C55E"
            iconBg="#DCFCE7"
          />
          <View style={styles.itemDivider} />
          <ToggleItem
            icon="warning-outline"
            label="Alertas de tráfico"
            value={trafficAlerts}
            onToggle={setTrafficAlerts}
            iconColor="#F59E0B"
            iconBg="#FEF3C7"
          />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.sectionCard}>
          <ToggleItem
            icon="notifications-outline"
            label="Notificaciones Push"
            value={pushEnabled}
            onToggle={setPushEnabled}
          />
          <View style={styles.itemDivider} />
          <ToggleItem
            icon="volume-high-outline"
            label="Sonidos"
            value={soundEnabled}
            onToggle={setSoundEnabled}
            iconColor="#8B5CF6"
            iconBg="#F3E8FF"
          />
        </View>

        {/* Security */}
        <Text style={styles.sectionTitle}>Seguridad y Soporte</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="lock-closed-outline" label="Cambiar contraseña" />
          <View style={styles.itemDivider} />
          <SettingItem
            icon="finger-print-outline"
            label="Autenticación biométrica"
            iconColor="#8B5CF6"
            iconBg="#F3E8FF"
          />
          <View style={styles.itemDivider} />
          <SettingItem
            icon="help-circle-outline"
            label="Centro de ayuda"
            iconColor="#22C55E"
            iconBg="#DCFCE7"
          />
          <View style={styles.itemDivider} />
          <SettingItem
            icon="alert-circle-outline"
            label="Reportar falla técnica"
            iconColor="#EF4444"
            iconBg="#FEE2E2"
          />
        </View>

        {/* Legal */}
        <Text style={styles.sectionTitle}>Información Legal</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon="document-text-outline"
            label="Términos y condiciones"
          />
          <View style={styles.itemDivider} />
          <SettingItem
            icon="shield-checkmark-outline"
            label="Política de privacidad"
            iconColor="#22C55E"
            iconBg="#DCFCE7"
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.9}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Tikzy Operador v1.0.0</Text>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1F3CCF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  profileId: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
    marginTop: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 14,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  itemDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 18,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    borderRadius: 20,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
    shadowColor: "#EF4444",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  versionText: {
    textAlign: "center",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 20,
  },
});
