import Button from "@/src/components/ui/Button";
import Screen from "@/src/components/ui/Screen";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, viajero 👋</Text>
            <Text style={styles.subtitle}>Encuentra tu próximo destino</Text>
          </View>

          <TouchableOpacity style={styles.profileButton} activeOpacity={0.85}>
            <Ionicons name="person-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.cardTitle}>Buscar viaje</Text>

          <TouchableOpacity style={styles.field} activeOpacity={0.85}>
            <View style={styles.fieldLeft}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.fieldLabel}>Origen</Text>
                <Text style={styles.fieldValue}>Tegucigalpa</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapButton} activeOpacity={0.85}>
            <Ionicons name="swap-vertical" size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.field} activeOpacity={0.85}>
            <View style={styles.fieldLeft}>
              <Ionicons name="navigate-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.fieldLabel}>Destino</Text>
                <Text style={styles.fieldValue}>San Pedro Sula</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.field} activeOpacity={0.85}>
            <View style={styles.fieldLeft}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.fieldLabel}>Fecha</Text>
                <Text style={styles.fieldValue}>12 Abril 2026</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.field} activeOpacity={0.85}>
            <View style={styles.fieldLeft}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.fieldLabel}>Pasajeros</Text>
                <Text style={styles.fieldValue}>1 adulto</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Button
            title="Buscar rutas"
            onPress={() => router.push("/booking/results")}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rutas populares</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.routeCard}>
            <View>
              <Text style={styles.routeTitle}>Tegucigalpa → San Pedro Sula</Text>
              <Text style={styles.routeMeta}>Desde L 320 • 4h 30min</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </View>

          <View style={styles.routeCard}>
            <View>
              <Text style={styles.routeTitle}>Tegucigalpa → La Ceiba</Text>
              <Text style={styles.routeMeta}>Desde L 410 • 6h 10min</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: colors.muted,
  },
  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  field: {
    backgroundColor: "#F9FBFE",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  fieldLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fieldLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  swapButton: {
    alignSelf: "center",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D8E5FF",
  },
  section: {
    marginTop: 26,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  routeMeta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },
});