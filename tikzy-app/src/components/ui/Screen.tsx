import { colors } from "@/src/theme/colors";
import { ReactNode } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

type Props = {
  children: ReactNode;
};

export default function Screen({ children }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
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
});