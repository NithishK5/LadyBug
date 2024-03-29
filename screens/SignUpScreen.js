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
import { AuthContext } from "../Services/AuthProvider";
import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

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

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 justify-center`}
      behavior="padding"
      enabled
    >
      <ImageBackground
        style={{ height: "102%", marginTop: -10 }}
        // style={tw`h-full flex-col justify-center items-center `}
        source={require("../assets/img/bg.png")}
        resizeMode="cover"
      >
        <View style={tw`w-100 h-50 absolute top-40 `}>
          <LottieView
            key="animation"
            autoPlay
            loop
            speed={0.5}
            resizeMode="contain"
            source={require("../assets/anim/2.json")}
          />
        </View>
        <View
          style={{
            ...tw`h-105 w-23/23 absolute bottom-0 flex flex-col rounded-xl justify-center content-center items-center`,
            backgroundColor: "#6d6987",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 20,
              top: 20,
            }}
            onPress={() => {
              navigation.navigate("Welcome");
            }}
          >
            <FeatherIcon color="black" name="arrow-left-circle" size={35} />
          </TouchableOpacity>
          <Text
            style={{
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
              label="Username"
              style={{ width: 360, backgroundColor: "#8f8b8b" }}
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
              label="Email"
              style={{ width: 360, backgroundColor: "#8f8b8b" }}
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
              style={{ width: 360, backgroundColor: "#8f8b8b" }}
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
          </View>
          <View style={tw`flex-row`}>
            <Text style={tw`text-sm font-bold pt-5`}>
              Already have an account?
            </Text>
            <Button
              style={tw`pt-2.8`}
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
    shadowColor: "#8f739c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 20,
  },
});
