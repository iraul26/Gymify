import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert, FlatList, ActivityIndicator, Keyboard, TouchableWithoutFeedback, SafeAreaView, ScrollView } from "react-native";
import { useUser } from "../userContext";
import { Ionicons } from "@expo/vector-icons";
import { db } from "@/firebaseConfig";
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";
import Dropdown from "../components/Dropdown";

export default function Workout() {

  const { userId, isDarkMode } = useUser(); //get the userid and theme from logged in user

  //state for workout search
  const [searchQuery, setSearchQuery] = useState("");
  const [exerciseList, setExerciseList] = useState<string[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  //state for modal and new workout entry
  const [modalVisible, setModalVisible] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: ""});

  //state for selected exercise and details
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [workoutData, setWorkoutData] = useState({
    sets: "",
    reps: "",
    weight: "",
  });

  const [workoutHistory, setWorkoutHistory] = useState<{ [key: string]: any[] }>({});

  //fetch workout names when component mounts
  useEffect(() => {
    if (userId) {
      fetchWorkouts();
    }
  }, [userId]);


  //fetch unique workouts from db
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const workoutsRef = collection(db, "workouts");
      const q = query(workoutsRef, where("userId", "==", userId), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
  
      const exercises = new Set<string>();
      const history: { [key: string]: any[] } = {};
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const exerciseName = data.exerciseName;
        exercises.add(exerciseName);
  
        if (!history[exerciseName]) {
          history[exerciseName] = [];
        }
        history[exerciseName].push(data);
      });
  
      setExerciseList(Array.from(exercises));
      setFilteredExercises(Array.from(exercises));
      setWorkoutHistory(history);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

//handle search input change
const handleSearch = (text: string) => {
  setSearchQuery(text);
  if (text.trim() === "") {
    setShowResults(false);
    setFilteredExercises([...new Set(exerciseList)]);
  } else {
    const filtered = [...new Set(
      exerciseList.filter((exercise) =>
        exercise?.toLowerCase()?.includes(text.toLowerCase())
      )
    )];
    setFilteredExercises(filtered);
    setShowResults(true);
  }
};

//handle selecting an exercise from the search results
const selectExercise = (exercise: string) => {
  setSelectedExercise(exercise);
  setShowResults(false);
  setSearchQuery(""); //clear search input
  setWorkoutData({ sets: "", reps: "", weight: "" }); //reset form fields
};

//handle adding a new workout to db
const handleAddWorkout = async () => {
  if (!newExercise.name.trim()) {
    Alert.alert("Error", "Workout name cannot be empty.");
    return;
  }

  try {
    const newWorkout = {
      userId,
      exerciseName: newExercise.name,
    };

    await addDoc(collection(db, "workouts"), newWorkout);

    Alert.alert("Success", "Workout added successfully!");

    //update state to include new workout
    setExerciseList((prev) => [...new Set([...prev, newExercise.name])]);
    setFilteredExercises((prev) => [...new Set([...prev, newExercise.name])]);

    setNewExercise({ name: "" }); //clear input field
    setModalVisible(false); //close modal
  } catch (error) {
    console.error("Error adding workout:", error);
    Alert.alert("Error", "Failed to add workout.");
  }
};

//handle logging the workout
const handleLogWorkout = async () => {
  if (!selectedExercise || !workoutData.sets || !workoutData.reps || !workoutData.weight) {
    Alert.alert("Error", "Please fill in all fields.");
    return;
  }

  try {
    const workoutEntry = {
      userId,
      exerciseName: selectedExercise,
      sets: parseInt(workoutData.sets),
      reps: parseInt(workoutData.reps),
      weight: parseFloat(workoutData.weight),
      date: Timestamp.now(),
    };

    await addDoc(collection(db, "workouts"), workoutEntry);

    //update the workout history state
    setWorkoutHistory((prevHistory) => {
      const updatedHistory = { ...prevHistory };
      if (!updatedHistory[selectedExercise]) {
        updatedHistory[selectedExercise] = [];
      }
      updatedHistory[selectedExercise].unshift(workoutEntry); //add new entry at the beginning
      return updatedHistory;
    });

    Alert.alert("Success", "Workout logged successfully!");
    setSelectedExercise(null);
    setWorkoutData({ sets: "", reps: "", weight: "" });
  } catch (error) {
    console.error("Error logging workout:", error);
    Alert.alert("Error", "Failed to log workout.");
  }
};

const toggleDropdown = (exercise: string) => {
  setExpandedWorkout(expandedWorkout === exercise ? null : exercise);
};

return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={[styles.container, isDarkMode? styles.darkMode : styles.lightMode]}>
  <ScrollView contentContainerStyle={styles.innerContainer}>

    {/* search bar */}
    <View style={[styles.searchContainer, isDarkMode? styles.darkSearch : styles.lightSearch]}>
      <TextInput
        style={[styles.input, isDarkMode ? styles.darkText : styles.lightText]}
        placeholder="Search for an exercise"
        placeholderTextColor={isDarkMode ? "#999" : "#666"}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => { setSearchQuery(""); setShowResults(false); }} style={styles.clearButton}>
          <Ionicons name="close-circle" size={24} color="#BB86FC" />
        </TouchableOpacity>
      )}

      {/* add exercise button */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Ionicons name="add-circle" size={28} color={"green"} />
      </TouchableOpacity>
    </View>

    {/* display search results */}
    {loading ? (
      <ActivityIndicator size="large" color="#BB86FC" style={styles.loadingIndicator} />
    ) : (
      showResults && (
        <View style={[styles.searchResultsContainer, isDarkMode ? styles.darkSearchResults : styles.lightSearchResults]}>
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.exerciseItem, isDarkMode ? styles.darkExerciseItem : styles.lightExerciseItem]} onPress={() => selectExercise(item)}>
                <Text style={[styles.exerciseName, isDarkMode ? styles.darkText : styles.lightText]}>{item}</Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled={true}
          />
        </View>
      )
    )}

    {/* display selected exercise form */}
    {selectedExercise && (
      <View style={[styles.selectedExerciseContainer, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <Text style={[styles.selectedExerciseName, isDarkMode ? styles.darkText : styles.lightText]}>{selectedExercise}</Text>

        {/* input fields */}
        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Sets"
          placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
          keyboardType="numeric"
          value={workoutData.sets}
          onChangeText={(text) => setWorkoutData({ ...workoutData, sets: text })}
        />

        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Reps per Set"
          placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
          keyboardType="numeric"
          value={workoutData.reps}
          onChangeText={(text) => setWorkoutData({ ...workoutData, reps: text })}
        />

        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Weight"
          placeholderTextColor={isDarkMode ? "#bbb" : "#666"}

          keyboardType="numeric"
          value={workoutData.weight}
          onChangeText={(text) => setWorkoutData({ ...workoutData, weight: text })}
        />

        {/* submit workout button */}
        <TouchableOpacity onPress={handleLogWorkout} style={[styles.completeWorkoutButton, isDarkMode ? styles.darkButton : styles.lightButton]}>
          <Text style={[styles.completeWorkoutText, isDarkMode ? styles.lightText : styles.darkText]}>Complete Workout</Text>
        </TouchableOpacity>
      </View>
    )}

   {/* modal for adding workouts */}
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, isDarkMode ? styles.darkModal : styles.lightModal]}>
          <Text style={[styles.modalTitle, isDarkMode ? styles.darkText : styles.lightText]}>Add Exercise</Text>

          <TextInput
            placeholder="Exercise Name"
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
            value={newExercise.name}
            onChangeText={(text) => setNewExercise({ name: text })}
            style={[styles.modalInput, isDarkMode ? styles.darkInput : styles.lightInput]}
          />

          <TouchableOpacity onPress={handleAddWorkout} style={[styles.modalButton, isDarkMode ? styles.darkButton : styles.lightButton]}>
            <Text style={[styles.modalButtonText, isDarkMode ? styles.lightText : styles.darkText]}>Add Exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Text style={[styles.modalCloseButtonText, isDarkMode ? styles.darkText : styles.lightText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    {/* history header */}
    <Text style={[styles.historyHeader, isDarkMode ? styles.darkText : styles.lightText]}>History</Text>

    {/* Display Workout History Dropdowns */}
          <View style={styles.dropDownContainer}>
            {exerciseList.map((exercise) => (
              <View 
                key={exercise} 
                style={[
                  styles.dropdownItem, 
                  isDarkMode ? styles.darkDropdown : styles.lightDropdown, 
                  expandedWorkout === exercise && (isDarkMode ? styles.darkExpandedDropdown : styles.lightExpandedDropdown)
                ]}
              >
                <TouchableOpacity onPress={() => toggleDropdown(exercise)} style={styles.dropdownButton}>
                  <Text style={[styles.exerciseLabel, isDarkMode ? styles.darkText : styles.lightText]}>
                    {exercise}
                  </Text>
                  <Ionicons 
                    name={expandedWorkout === exercise ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={isDarkMode ? "#fff" : "#000"} 
                  />
                </TouchableOpacity>

                {expandedWorkout === exercise && (
                  <View style={styles.workoutDetails}>
                    {workoutHistory[exercise]
                      ?.sort((a, b) => (b.date?.toMillis() || 0) - (a.date?.toMillis() || 0))
                      .map((workout, index, arr) => (
                        <View key={index}>
                          <Text key={index} style={[styles.dropDownNutrients, isDarkMode ? styles.darkText : styles.lightText]}>
                            <Text style={{ fontWeight: "bold" }}>Sets:</Text> {workout.sets} {"\n"}
                            <Text style={{ fontWeight: "bold" }}>Reps:</Text> {workout.reps} {"\n"}
                            <Text style={{ fontWeight: "bold" }}>Weight:</Text> {workout.weight} lbs {"\n"}
                            <Text style={{ fontWeight: "bold" }}>Day:</Text> {new Date(workout.date?.toMillis()).toLocaleDateString("en-US")}
                          </Text>
                          {/* add a line for dividing the entries in the dropdown */}
                          {index !== arr.length - 1 && <View style={styles.entryDivider} />}
                        </View>
                      ))}
                  </View>
                )}
              </View>
            ))}
          </View>
  </ScrollView>
  </SafeAreaView>
  </TouchableWithoutFeedback>
);
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 16,
  },
  darkMode: {
    backgroundColor: "black"
  },
  lightMode: {
    backgroundColor: "white"
  },
  innerContainer: {
    padding: 16
  },
  historyHeader: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center"
  },
  darkText: {
    color: "#fff"
  },
  lightText: {
    color: "#000"
  },
  loadingIndicator: {
    marginTop: 20,
    alignSelf: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  darkSearch: {
    backgroundColor: "#1E1E1E",
    borderColor: "#333"
  },
  lightSearch: {
    backgroundColor: "#FFF",
    borderColor: "#DDD",
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: "#555",
    fontSize: 15,
  },
  clearButton: {
    padding: 10,
  },
  addButton: {
    padding: 10,
    marginLeft: 8,
  },
  searchResultsContainer: {
    maxHeight: 350,
    borderWidth: 2,
    borderRadius: 20,
    marginTop: 10,
  },
  darkSearchResults: {
    backgroundColor: "#1E1E1E",
    borderColor: "#FFF",
  },
  lightSearchResults: {
    backgroundColor: "#FFF",
    borderColor: "#000",
  },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  darkExerciseItem: {
    borderBottomColor: "#FFF"
  },
  lightExerciseItem: {
    borderBottomColor: "#000"
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  darkModal: {
    backgroundColor: "#1E1E1E",
  },
  lightModal: {
    backgroundColor: "#FFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1
  },
  darkInput: {
    backgroundColor: "#333",
    color: "#FFF",
    borderColor: "#BBB",
  },
  lightInput: {
    backgroundColor: "#f5f5f5",
    color: "#000",
    borderColor: "#DDD",
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
  },
  darkCloseButton: {
    color: "white"
  },
  modalCloseButtonText: {
    fontSize: 16,
  },
  selectedExerciseContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  darkContainer: {
    backgroundColor: "#1E1E1E",
    borderColor: "#FFF",
  },
  lightContainer: {
    backgroundColor: "#FFF",
    borderColor: "#000",
  },  
  selectedExerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  selectedExerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  formInput: {
    width: "100%",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 5,
    color: "white",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#555",
  },
  completeWorkoutButton: {
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  darkButton: {
    backgroundColor: "#FFF",
  },
  lightButton: {
    backgroundColor: "black"
  },
  completeWorkoutText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  dropDownContainer: {
    marginTop: 20
  },
  dropdownItem: {
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  darkDropdown: {
    backgroundColor: "#1E1E1E",
  },
  lightDropdown: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  lightExpandedDropdown: {
    backgroundColor: "#F5F5F5",
  },
  darkExpandedDropdown: {
    backgroundColor: "#1E1E1E",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropDownNutrients: {
    fontSize: 14,
    paddingVertical: 2,
  },
  exerciseLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  workoutDetails: {
    marginTop: 5,
  },
  entryDivider: {
    height: 1, 
    backgroundColor: "#DDD",
    marginVertical: 8,
    width: "100%",
    alignSelf: "center",
  },
});