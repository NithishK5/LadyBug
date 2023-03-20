import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import { Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { KeyboardAvoidingView } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View>
      <ImageBackground
        // style={{ height: "110%", marginTop: -10 }}
        style={tw`h-full w-full -mt-10 mb-25  flex-col justify-center items-center`}
        source={require("../assets/img/hello1.png")}
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <View style={tw`w-100 h-50 absolute top-20`}>
          <LottieView
            key="animation"
            speed="2.3"
            autoPlay
            loop
            resizeMode="cover"
            source={require("../assets/anim/lb.json")}
          />
        </View>
        <View style={tw`w-full items-center justify-center pt-110`}>
          <Button
            style={styles.signup}
            icon="lock-open-outline"
            mode="contained"
            onPress={() => navigation.navigate("SignUp")}
          >
            SignUp
          </Button>
          <Button
            style={styles.login}
            icon="lock-open-outline"
            mode="contained"
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  login: {
    backgroundColor: "black",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "teal",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 20,
  },
  signup: {
    backgroundColor: "black",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "teal",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 15,
  },
});
