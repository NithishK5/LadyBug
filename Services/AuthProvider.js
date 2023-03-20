import { View, Text } from "react-native";
import React, { Children, createContext, useState } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "./Firebase";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignup = async () => {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // ..
      });
  };

  const handleEmailLogin = async () => {
    await auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // ..
      });
  };

  const logout = async () => {
    auth
      .signOut()
      .then(setUser(null))
      .then(console.log("SUCCESSFULLY LOGGED OUT"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        handleEmailSignup,
        handleEmailLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
