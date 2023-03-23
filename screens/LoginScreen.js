import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";
import { ImageBackground } from "react-native";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import { AuthContext } from "../Services/AuthProvider";
import { StatusBar } from "expo-status-bar";
import { Button, ActivityIndicator, Colors } from "react-native-paper";
import { TextInput } from "react-native-paper";
import LottieView from "lottie-react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

const LoginScreen = ({ navigation }) => {
  const { setEmail, email, password, setPassword, handleEmailLogin } =
    useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <KeyboardAvoidingView behavior="padding" enabled>
      <ImageBackground
        // style={tw`h-full flex-col justify-center items-center`}
        style={{ height: "102%", marginTop: -10 }}
        source={require("../assets/img/bg.png")}
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <View style={tw`w-100 h-50 absolute top-70`}>
          <LottieView
            key="animation"
            autoPlay
            speed={1.0}
            loop
            resizeMode="contain"
            source={require("../assets/anim/1.json")}
          />
        </View>
        <View
          style={{
            ...tw`bg-gray-600 h-75 w-23/23 absolute bottom-0 flex flex-col rounded-xl content-center items-center`,
            backgroundColor: "#6d6987",
          }}
        >
          <TouchableOpacity
            style={tw`pl-3 pt-3`}
            onPress={() => {
              navigation.navigate("Welcome");
            }}
          >
            <FeatherIcon
              style={tw`pr-90`}
              color="black"
              name="arrow-left-circle"
              size={35}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 20,
              marginTop: -30,
            }}
          >
            Sign In
          </Text>
          <View>
            <TextInput
              placeholder="Email"
              label="Email"
              style={{ width: 330, backgroundColor: "#8f8b8b" }} //#bdbfbe
              value={email}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              left={<TextInput.Icon icon="email" />}
            />
          </View>
          <View>
            <TextInput
              placeholder="Password"
              label="Password"
              style={{ width: 330, marginTop: 10, backgroundColor: "#8f8b8b" }}
              value={password}
              textContentType="password"
              secureTextEntry={true}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock" />}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={tw`w-full items-center justify-center`}>
            {!isLoading ? (
              <Button
                style={styles.button}
                icon="lock-open-outline"
                mode="contained"
                onPress={async () => {
                  await handleEmailLogin();
                  navigation.navigate("Home");
                }}
              >
                Login
              </Button>
            ) : (
              <ActivityIndicator animating={true} color="#0000ff" />
            )}
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8f739c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 20,
  },
});
