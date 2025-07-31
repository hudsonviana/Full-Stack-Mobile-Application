import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "blue" }}>
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href={"/about"}>Sobre</Link>
    </View>
  );
}
