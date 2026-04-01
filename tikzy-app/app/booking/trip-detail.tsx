import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TripDetailScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detalle del Viaje</Text>

        <View style={styles.iconButton} />
      </View>

      <View style={styles.routeCard}>
        <View style={styles.routeTopRow}>
          <View style={styles.routeBadge}>
            <Text style={styles.routeBadgeText}>CONFIRMACIÓN DE RUTA</Text>
          </View>
          <Text style={styles.routeId}>ID: #VJ-9021</Text>
        </View>

        <View style={styles.timelineRow}>
          <View style={styles.timelineIconColumn}>
            <View style={styles.timelineIconLight}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineIconDark}>
              <Ionicons name="location" size={18} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.timelineTextColumn}>
            <View style={styles.timelineBlock}>
              <Text style={styles.timelineTitle}>Terminal Blvd. Fuerzas Armadas</Text>
              <Text style={styles.timelineMeta}>Jue, 15 Oct • 13:00 PM</Text>
            </View>

            <View style={styles.timelineBlockBottom}>
              <Text style={styles.timelineTitle}>Terminal San Pedro Sula</Text>
              <Text style={styles.timelineMeta}>Jue, 15 Oct • 18:00 PM</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.operatorCard}>
        <View style={styles.operatorTop}>
          <View style={styles.operatorLogo}>
            <Ionicons name="bus-outline" size={20} color="#FFFFFF" />
          </View>

          <View style={styles.operatorTextBlock}>
            <Text style={styles.operatorVerified}>Operador Verificado</Text>
            <Text style={styles.operatorName}>Transportes Cristina</Text>
            <Text style={styles.operatorMeta}>Servicio Premium • Bus #42</Text>
          </View>
        </View>

        <Text style={styles.servicesTitle}>SERVICIOS A BORDO</Text>

        <View style={styles.servicesRow}>
          <View style={styles.serviceChip}>
            <Ionicons name="wifi-outline" size={16} color={colors.primary} />
            <Text style={styles.serviceChipText}>WiFi Gratis</Text>
          </View>

          <View style={styles.serviceChip}>
            <Ionicons name="snow-outline" size={16} color={colors.primary} />
            <Text style={styles.serviceChipText}>Aire Acond.</Text>
          </View>

          <View style={styles.serviceChip}>
            <Ionicons name="battery-charging-outline" size={16} color={colors.primary} />
            <Text style={styles.serviceChipText}>USB</Text>
          </View>
        </View>
      </View>

      <View style={styles.seatCard}>
        <View style={styles.seatCardHeader}>
          <View style={styles.seatTitleRow}>
            <Ionicons name="grid-outline" size={18} color={colors.text} />
            <Text style={styles.seatCardTitle}>Asientos Seleccionados</Text>
          </View>

          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.changeText}>Cambiar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectedSeatBox}>
          <Text style={styles.selectedSeatFloor}>PISO 1</Text>
          <Text style={styles.selectedSeatValue}>2C</Text>
        </View>
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.paymentTitle}>Resumen de Pago</Text>

        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Pasaje Adulto (x1)</Text>
          <Text style={styles.paymentValue}>L. 220.00</Text>
        </View>

        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Cargos por Servicio</Text>
          <Text style={styles.paymentValue}>L. 15.00</Text>
        </View>

        <View style={styles.paymentDivider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalValue}>L. 235.00</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.payButton}
        activeOpacity={0.9}
        onPress={() => router.push("/booking/payment" as any)}
      >
        <Text style={styles.payButtonText}>Realizar Pago</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Al continuar, aceptas nuestros términos y condiciones de servicio y
        políticas de privacidad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  routeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  routeBadge: {
    backgroundColor: "#EEF4FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  routeBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
  },
  routeId: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "700",
  },
  timelineRow: {
    flexDirection: "row",
  },
  timelineIconColumn: {
    width: 36,
    alignItems: "center",
  },
  timelineIconLight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#D9E2F1",
    marginVertical: 6,
  },
  timelineIconDark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineTextColumn: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "space-between",
  },
  timelineBlock: {
    marginBottom: 18,
  },
  timelineBlockBottom: {},
  timelineTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  timelineMeta: {
    marginTop: 4,
    fontSize: 14,
    color: colors.muted,
  },
  operatorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  operatorTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  operatorLogo: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  operatorTextBlock: {
    flex: 1,
  },
  operatorVerified: {
    fontSize: 13,
    color: colors.muted,
  },
  operatorName: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  operatorMeta: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  servicesTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
    marginBottom: 12,
  },
  servicesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  serviceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F7FAFE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  seatCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  seatCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seatTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  seatCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  changeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  selectedSeatBox: {
    marginTop: 14,
    width: 62,
    backgroundColor: "#F5F8FE",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  selectedSeatFloor: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8B9AB5",
  },
  selectedSeatValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 15,
    color: colors.muted,
  },
  paymentValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "700",
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  footerText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
});