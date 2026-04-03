import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default function OperatorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1F3CCF",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          height: 78,
          paddingTop: 8,
          paddingBottom: 14,
          borderTopWidth: 0,
          elevation: 12,
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="panel"
        options={{
          title: "Panel",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="scanner"
        options={{
          title: "Escanear",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.scannerTab,
                focused && styles.scannerTabActive,
              ]}
            >
              <Ionicons
                name="qr-code-outline"
                size={24}
                color={focused ? "#1F3CCF" : "#94A3B8"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden from tabs but accessible via navigation */}
      <Tabs.Screen
        name="route-dashboard"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ticket-validation"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="manual-sale"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="seat-map"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settlement"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scannerTab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerTabActive: {
    backgroundColor: "#EEF1FF",
  },
});
