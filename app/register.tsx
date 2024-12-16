import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Checkbox } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Register() {
  //router for navigation
  const router = useRouter();

  //input variable states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  //error state
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    isAgreed?: string;
  }>({});

  //validation method to validate all fields
  const validateForm = () => {
    const newErrors: typeof errors = {};

    //first name validation
    if (firstName.length < 1 || firstName.length > 15) {
      newErrors.firstName = "First name must be 1-15 characters in length";
    }

    //last name validation
    if (lastName.length < 1 || lastName.length > 15) {
      newErrors.lastName = "Last name must be 1-15 characters in length";
    }

    //username validation
    if (username.length < 5 || username.length > 15) {
      newErrors.username = "Username must be 5-15 characters in length";
    }

    //email validation
    if (!email) {
      newErrors.email = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    //password validation
    if (password.length < 8 || password.length > 25) {
      newErrors.password = "Password must be 8-25 characters";
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      newErrors.password =
        "Must contain at least 1 number and special character (!,@,#,$,%,^,&,*)";
    }

    //confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    //terms and conditions validation
    if (!isAgreed) {
      newErrors.isAgreed = "Must accept the terms and conditions to continue";
    }

    //set errors in state
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //registration handler method
  const handleRegister = () => {
    if (validateForm()) {
      //clear the input fields on success
      setFirstName("");
      setLastName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setIsAgreed(false);
      //show success alert and navigate to home page
      Alert.alert("Success", "You have successfully registered!");
      router.replace("/(tabs)/home");
    }
  };

  return (
    //dismiss keyboard when tapping outside the input fields
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* back Arrow */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* title */}
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Enter your details to register</Text>

        {/* input fields */}
        <View style={styles.form}>
          {/* first name */}
          <View style={styles.inputContainer}>
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            <TextInput placeholder="First Name" placeholderTextColor="#A1A1A1" value={firstName} onChangeText={setFirstName} style={styles.inputField}/>
          </View>

          {/* last name */}
          <View style={styles.inputContainer}>
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            <TextInput placeholder="Last Name" placeholderTextColor="#A1A1A1" value={lastName} onChangeText={setLastName} style={styles.inputField}/>
          </View>

          {/* email */}
          <View style={styles.inputContainer}>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <TextInput placeholder="Email" placeholderTextColor="#A1A1A1" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.inputField}/>
          </View>

          {/* username */}
          <View style={styles.inputContainer}>
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            <TextInput placeholder="Username" placeholderTextColor="#A1A1A1" value={username} onChangeText={setUsername} style={styles.inputField}/>
          </View>

          {/* password */}
          <View style={styles.inputContainer}>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <TextInput placeholder="Password" placeholderTextColor="#A1A1A1" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField}/>
          </View>

          {/* confirm password */}
          <View style={styles.inputContainer}>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
            <TextInput placeholder="Confirm Password" placeholderTextColor="#A1A1A1" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.inputField}/>
          </View>

          {/* checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox value="agreeTerms" isChecked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} aria-label="agreeTerms"/>
            <Text style={styles.checkboxText}>I agree with the{" "}
              <Text style={{ fontWeight: "bold", color: "#BB86FC" }}>terms and conditions</Text>
            </Text>
          </View>
          {errors.isAgreed && <Text style={styles.errorText}>{errors.isAgreed}</Text>}
        </View>

        {/* register Button */}
        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={{ color: "#121212", fontWeight: "bold", fontSize: 16 }}>Register</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    color: "#A1A1A1",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 10,
    height: 72,
    justifyContent: "space-between",
  },
  inputField: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxText: {
    color: "#FFFFFF",
    marginLeft: 10,
  },
  registerButton: {
    backgroundColor: "#BB86FC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
});
