import { colors } from "@/src/theme/colors";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  placeholder: string;
  secureTextEntry?: boolean;
};

export default function Input({ placeholder, secureTextEntry = false }: Props) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
  },
  input: {
    height: 58,
    paddingHorizontal: 18,
    fontSize: 16,
    color: colors.text,
  },
});