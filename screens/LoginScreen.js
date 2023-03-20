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
import { CLIENT_ID, IOS_CLIENT_ID, ANDROID_CLIENT_ID } from "@env";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

const LoginScreen = ({ navigation }) => {
  const { setEmail, email, password, setPassword, handleEmailLogin } =
    useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    expoClientId: CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };
  return (
    <KeyboardAvoidingView behavior="padding" enabled>
      <ImageBackground
        style={tw`h-full flex-col justify-center items-center`}
        source={require("../assets/img/bg-signup.avif")}
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <View style={tw`w-100 h-50 absolute top-40`}>
          <LottieView
            key="animation"
            autoPlay
            loop
            resizeMode="cover"
            source={require("../assets/anim/log.json")}
          />
        </View>
        <View
          style={tw`bg-gray-400 h-108 w-23/23 absolute bottom-0 flex flex-col rounded-xl content-center items-center`}
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
              label="email"
              style={{ width: 330, backgroundColor: "#bdbfbe" }}
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
              style={{ width: 330, marginTop: 10, backgroundColor: "#bdbfbe" }}
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
            <Text style={tw`text-lg font-bold pt-4`}>- Or Continue With -</Text>
            {!isLoading ? (
              <Button
                style={styles.google}
                icon="google"
                mode="elevated"
                textColor="red"
                onPress={async () => {
                  await promptAsync();
                  navigation.navigate("Home");
                }}
              >
                Continue login with Google
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
    shadowColor: "teal",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 10,
  },
  google: {
    backgroundColor: "black",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "teal",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 20,
  },
});
