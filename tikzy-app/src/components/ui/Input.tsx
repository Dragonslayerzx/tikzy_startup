import { colors } from "@/src/theme/colors";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  placeholder: string;
};

export default function Input({ placeholder, secureTextEntry = false, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        autoCapitalize="none"
        {...rest}
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