import React, { useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import { Avatar, Button } from "react-native-paper";
import { AuthContext } from "../Services/AuthProvider";

const SECTIONS = [
  {
    header: "Preferences",
    icon: "settings",
    items: [
      { icon: "globe", color: "#fe9400", label: "Language", type: "link" },
      {
        icon: "moon",
        color: "#007afe",
        label: "Dark Mode",
      },
      { icon: "navigation", color: "#32c759", label: "Location", type: "link" },
    ],
  },
  {
    header: "Help",
    icon: "help-circle",
    items: [
      { icon: "flag", color: "#8e8d91", label: "Report Bug", type: "link" },
      { icon: "mail", color: "#007afe", label: "Contact Us", type: "link" },
    ],
  },
  {
    header: "Account",
    icon: "align-center",
    items: [],
  },
];

export default function SettingScreen({ navigation, test }) {
  const { user, logout, name, setName } = useContext(AuthContext);
  return (
    <SafeAreaView style={tw`bg-black flex-1`}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profile}>
          <TouchableOpacity
            style={tw`pb-4`}
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <FeatherIcon
              style={tw`pr-90`}
              color="#fff"
              name="arrow-left-circle"
              size={35}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.profileAvatarWrapper}>
              <Avatar.Icon
                style={styles.profileAvatar}
                size={100}
                icon="account"
              />

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
              ></TouchableOpacity>
            </View>
          </TouchableOpacity>
          <View style={styles.profileBody}>
            <Text style={styles.profileName}>{user?.name}</Text>
          </View>
        </View>

        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <Text style={styles.sectionHeader}>{header}</Text>
            {items.map(({ label, icon, type, value, color }, index) => {
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => {
                    // handle onPress
                  }}
                >
                  <View style={styles.row}>
                    <View style={[styles.rowIcon, { backgroundColor: color }]}>
                      <FeatherIcon color="#fff" name={icon} size={18} />
                    </View>

                    <Text style={styles.rowLabel}>{label}</Text>

                    <View style={styles.rowSpacer} />

                    {type === "boolean" && (
                      <Switch
                        value={value}
                        onValueChange={(val) => {
                          if (label === "Scotland") {
                            test = "new test";
                          }
                        }}
                      />
                    )}

                    {type === "link" && (
                      <FeatherIcon
                        color="#0c0c0c"
                        name="chevron-right"
                        size={22}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <Button
          style={tw`bg-gray-400 mt-4`}
          icon="logout"
          mode="elevated"
          textColor="red"
          onPress={() => {
            logout().then(navigation.navigate("Welcome"));
          }}
        >
          LogOut
        </Button>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            paddingTop: 20,
            textAlign: "center",
            color: "gray",
          }}
        >
          Version 1.0.0 (2023) - Production
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  profile: {
    padding: 24,
    backgroundColor: "black",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
    backgroundColor: "#fff",
  },
  profileAvatarWrapper: {
    position: "relative",
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#007bff",
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "600",
    color: "#414d63",
    textAlign: "center",
    color: "white",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "black",
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "white",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
