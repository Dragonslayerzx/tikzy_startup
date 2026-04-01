import { saveBookingDraft } from "@/constants/bookingDraftStorage";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function formatCurrency(amount: number) {
  return `L. ${amount.toFixed(2)}`;
}

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    from?: string | string[];
    to?: string | string[];
    operator?: string | string[];
    date?: string | string[];
    departureTime?: string | string[];
    arrivalTime?: string | string[];
    terminal?: string | string[];
    boardingPoint?: string | string[];
    total?: string | string[];
    seat?: string | string[];
  }>();

  const getParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const bookingData = {
    from: getParam(params.from) ?? "Tegucigalpa",
    to: getParam(params.to) ?? "San Pedro Sula",
    operator: getParam(params.operator) ?? "Transportes Cristina",
    date: getParam(params.date) ?? "15 Oct 2026",
    departureTime: getParam(params.departureTime) ?? "1:00 PM",
    arrivalTime: getParam(params.arrivalTime) ?? "5:00 PM",
    seats: [getParam(params.seat) ?? "2C"],
    total: Number(getParam(params.total) ?? "235"),
    terminal: getParam(params.terminal) ?? "Terminal Centro",
    boardingPoint: getParam(params.boardingPoint) ?? "Bus #42",
  };

  const handlePayNow = async () => {
    await saveBookingDraft(bookingData);
    router.push("/booking/confirmation");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.85}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Pago Seguro</Text>

            <View style={styles.sslRow}>
              <Ionicons name="lock-closed" size={14} color="#10B981" />
              <Text style={styles.sslText}>SSL</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryTextBlock}>
              <Text style={styles.summaryLabel}>RESUMEN DEL VIAJE</Text>
              <Text style={styles.summaryRoute}>
                {bookingData.from} — {bookingData.to}
              </Text>
              <Text style={styles.summaryMeta}>
                {bookingData.operator} · {bookingData.seats.join(", ")}
              </Text>
            </View>

            <View style={styles.busIconBox}>
              <Ionicons name="bus-outline" size={20} color={colors.primary} />
            </View>

            <Text style={styles.summaryPrice}>
              {formatCurrency(bookingData.total)}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>MÉTODO DE PAGO</Text>

          <View style={styles.methodsGrid}>
            <TouchableOpacity
              style={[styles.methodCard, styles.methodCardActive]}
              activeOpacity={0.85}
            >
              <Ionicons name="card-outline" size={22} color={colors.primary} />
              <Text style={[styles.methodText, styles.methodTextActive]}>
                Tarjeta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.methodCard} activeOpacity={0.85}>
              <Ionicons name="wallet-outline" size={22} color={colors.muted} />
              <Text style={styles.methodText}>Efectivo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.methodCard} activeOpacity={0.85}>
              <Ionicons
                name="business-outline"
                size={22}
                color={colors.muted}
              />
              <Text style={styles.methodText}>Transferencia</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>DETALLES DE TARJETA</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Número de Tarjeta</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={20} color={colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
              />
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre en la Tarjeta</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.inputNoIcon]}
                placeholder="Ej: JUAN PEREZ"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>Expiración</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputNoIcon]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputNoIcon]}
                  placeholder="***"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  keyboardType="number-pad"
                />
                <Ionicons
                  name="help-circle-outline"
                  size={18}
                  color={colors.muted}
                />
              </View>
            </View>
          </View>

          <View style={styles.securityCard}>
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={colors.accent}
            />
            <Text style={styles.securityText}>
              Sus datos están protegidos por encriptación AES-256 de nivel
              bancario. No guardamos su código CVV.
            </Text>
          </View>

          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.totalLabel}>Total a Pagar</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(bookingData.total)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.payButton}
              activeOpacity={0.9}
              onPress={handlePayNow}
            >
              <Text style={styles.payButtonText}>Pagar Ahora</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  sslRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minWidth: 42,
    justifyContent: "flex-end",
  },
  sslText: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "800",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    position: "relative",
  },
  summaryTextBlock: {
    paddingRight: 52,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
  },
  summaryRoute: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 28,
    flexShrink: 1,
  },
  summaryMeta: {
    marginTop: 4,
    fontSize: 14,
    color: colors.muted,
    fontWeight: "700",
    lineHeight: 18,
  },
  busIconBox: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryPrice: {
    marginTop: 10,
    alignSelf: "flex-end",
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.muted,
    marginBottom: 12,
  },
  methodsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  methodCard: {
    flexBasis: "31%",
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 6,
  },
  methodCardActive: {
    backgroundColor: "#EEF4FF",
    borderColor: colors.primary,
    borderWidth: 2,
  },
  methodText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  methodTextActive: {
    color: colors.primary,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
  },
  inputNoIcon: {
    paddingLeft: 0,
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  halfInput: {
    flex: 1,
  },
  securityCard: {
    marginTop: 4,
    backgroundColor: "#FFF8E8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F8E3A7",
    padding: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  bottomBar: {
    marginTop: 20,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "700",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 14,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 17,
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
});