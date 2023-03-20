import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import tw from "twrnc";
import { Icon } from "@rneui/themed";
import { AuthContext } from "../Services/AuthProvider";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { CLIENT_ID, IOS_CLIENT_ID, ANDROID_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = ({ navigation }) => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    user,
    setUser,
    handleEmailSignup,
  } = useContext(AuthContext);

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
    <KeyboardAvoidingView
      style={tw`flex-1 justify-center`}
      behavior="padding"
      enabled
    >
      <ImageBackground
        style={tw`h-full flex-col justify-center items-center`}
        source={require("../assets/img/bg-signup.avif")}
        resizeMode="cover"
      >
        <View style={tw`w-100 h-50 absolute top-20 rounded-full`}>
          <LottieView
            key="animation"
            autoPlay
            loop
            resizeMode="contain"
            source={require("../assets/anim/signup.json")}
          />
        </View>
        <View
          style={tw`bg-gray-400 h-135 w-23/23 absolute bottom-0 flex flex-col rounded-xl justify-center content-center items-center`}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              // flex: 1,
            }}
            // style={tw`pl-3`}
            onPress={() => {
              navigation.navigate("Welcome");
            }}
          >
            <FeatherIcon color="black" name="arrow-left-circle" size={35} />
          </TouchableOpacity>
          <Text
            style={{
              // flex: 2,
              // position: "absolute",
              //   left:10,
              //   top: 10,
              marginBottom: 20,
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            Sign Up
          </Text>

          <View
            style={tw`w-full flex-row px-4 justify-start items-center my-2`}
          >
            <TextInput
              placeholder="UserName"
              label="UserName"
              style={{ width: 360, backgroundColor: "#bdbfbe" }}
              // style={tw`pl-1 pr-60 justify-start my-1 bg-gray-300`}
              value={name}
              textContentType="name"
              onChangeText={(text) => setName(text)}
              left={<TextInput.Icon icon="account-edit" />}
            />
          </View>
          <View
            style={tw`w-full flex-row px-4 justify-start items-center my-2`}
          >
            <TextInput
              placeholder="Email"
              label="email"
              style={{ width: 360, backgroundColor: "#bdbfbe" }}
              value={email}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              left={<TextInput.Icon icon="email" />}
            />
          </View>
          <View
            style={tw`w-full flex-row px-4 justify-start items-center my-1`}
          >
            <TextInput
              placeholder="Password"
              label="Password"
              style={{ width: 360, backgroundColor: "#bdbfbe" }}
              value={password}
              textContentType="password"
              secureTextEntry={true}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock" />}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={tw`w-full items-center justify-center`}>
            <Button
              style={styles.button}
              icon="lock-open-outline"
              mode="contained"
              onPress={async () => {
                await handleEmailSignup();
                navigation.navigate("Home");
              }}
            >
              Sign Up
            </Button>
            <Text style={tw`text-lg font-bold pt-4`}>- Or Continue With -</Text>
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
          </View>
          <View style={tw`flex-row`}>
            <Text style={tw`text-sm font-bold pt-5`}>
              Already have an account?
            </Text>
            <Button
              style={tw`pt-3`}
              textColor="red"
              mode="text"
              onPress={() => navigation.navigate("Login")}
            >
              SignIn
            </Button>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
