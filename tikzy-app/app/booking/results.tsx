import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const trips = [
  {
    id: "1",
    company: "Transportes San Pedro",
    rating: "4.5",
    reviews: "1.1k",
    departure: "10:00",
    arrival: "15:00",
    originCode: "TGU",
    destinationCode: "SPS",
    duration: "5h 00m",
    type: "Directo",
    model: "MERCEDES BENZ O-500",
    pickup: "Terminal Mall Premier",
    price: "L. 150",
  },
  {
    id: "2",
    company: "Transportes Carolina",
    rating: "4.8",
    reviews: "2.4k",
    departure: "12:00",
    arrival: "17:00",
    originCode: "TGU",
    destinationCode: "SPS",
    duration: "5h 00m",
    type: "Directo",
    model: "MERCEDES - MARCO POLO",
    pickup: "Terminal Comayagüela",
    price: "L. 200",
  },
  {
    id: "3",
    company: "Transportes Cristina",
    rating: "4.2",
    reviews: "800",
    departure: "13:00",
    arrival: "18:30",
    originCode: "TGU",
    destinationCode: "SPS",
    duration: "5h 30m",
    type: "1 Parada",
    model: "MERCEDES - TURISMO",
    pickup: "Terminal Blvd. Fuerzas Armadas",
    price: "L. 220",
  },
];

export default function ResultsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.routeTitle}>Tegucigalpa → San Pedro Sula</Text>
            <Text style={styles.routeMeta}>15 Oct · 1 Pasajero</Text>
          </View>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
            <Ionicons
              name="options-outline"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
          style={styles.filtersScroll}
        >
          <TouchableOpacity
            style={[styles.filterChip, styles.filterChipActive]}
            activeOpacity={0.85}
          >
            <Text
              style={styles.filterTextActive}
              numberOfLines={1}
              allowFontScaling={false}
            >
              Más barato
            </Text>
            <Ionicons name="chevron-down" size={14} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterChip} activeOpacity={0.85}>
            <Text
              style={styles.filterText}
              numberOfLines={1}
              allowFontScaling={false}
            >
              Más rápido
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterChip} activeOpacity={0.85}>
            <Text
              style={styles.filterText}
              numberOfLines={1}
              allowFontScaling={false}
            >
              Empresa
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.muted} />
          </TouchableOpacity>
        </ScrollView>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {trips.map((trip) => (
            <View key={trip.id} style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.companyRow}>
                  <View style={styles.companyLogo}>
                    <Ionicons name="bus-outline" size={18} color="#FFFFFF" />
                  </View>

                  <View style={styles.companyInfo}>
                    <Text style={styles.companyName} numberOfLines={2}>
                      {trip.company}
                    </Text>

                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#F5A400" />
                      <Text style={styles.ratingText}>
                        {trip.rating} ({trip.reviews})
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modelTag}>
                  <Text
                    style={styles.modelTagText}
                    numberOfLines={1}
                    allowFontScaling={false}
                  >
                    {trip.model}
                  </Text>
                </View>
              </View>

              <View style={styles.timeRow}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{trip.departure}</Text>
                  <Text style={styles.codeText}>{trip.originCode}</Text>
                </View>

                <View style={styles.middleTimeBlock}>
                  <Text style={styles.durationText}>{trip.duration}</Text>

                  <View style={styles.lineRow}>
                    <View style={styles.line} />
                    <Ionicons
                      name="bus-outline"
                      size={15}
                      color={colors.primary}
                    />
                    <View style={styles.line} />
                  </View>

                  <Text style={styles.typeText}>{trip.type}</Text>
                </View>

                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{trip.arrival}</Text>
                  <Text style={styles.codeText}>{trip.destinationCode}</Text>
                </View>
              </View>

              <View style={styles.pickupRow}>
                <Ionicons
                  name="location-outline"
                  size={15}
                  color={colors.primary}
                />
                <Text style={styles.pickupText}>
                  Punto de encuentro: {trip.pickup}
                </Text>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.priceBlock}>
                  <Text style={styles.priceLabel}>DESDE</Text>
                  <Text style={styles.priceText}>{trip.price}</Text>
                </View>

                <TouchableOpacity
                  style={styles.selectButton}
                  activeOpacity={0.9}
                  onPress={() => router.push("/booking/seats")}
                >
                  <Text style={styles.selectButtonText}>Seleccionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEF8",
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: "center",
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  routeMeta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filtersRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 124,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
    includeFontPadding: false,
  },
  filterTextActive: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    includeFontPadding: false,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0F8278",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  companyInfo: {
    flex: 1,
    minWidth: 0,
  },
  companyName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 20,
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "600",
  },
  modelTag: {
    alignSelf: "flex-start",
    maxWidth: "46%",
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexShrink: 1,
  },
  modelTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  timeBlock: {
    width: 74,
    alignItems: "center",
  },
  timeText: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 28,
    textAlign: "center",
  },
  codeText: {
    marginTop: 8,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
  middleTimeBlock: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  lineRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    gap: 6,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  typeText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },
  pickupRow: {
    backgroundColor: "#F3F5FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 16,
  },
  pickupText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  priceBlock: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "800",
  },
  priceText: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  selectButton: {
    minWidth: 132,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});