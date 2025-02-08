import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert, FlatList, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useUser } from "../userContext";
import { Ionicons } from "@expo/vector-icons";
import { db } from "@/firebaseConfig";
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";
import Dropdown from "../components/Dropdown";

export default function Workout() {

  const { userId } = useUser(); //get the userid from logged in user

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

return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  <View style={styles.container}>
    {/* search bar */}
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Search for an exercise"
        placeholderTextColor="#999"
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
        <Ionicons name="add-circle" size={28} color={"#BB86FC"} />
      </TouchableOpacity>
    </View>

    {/* display search results */}
    {loading ? (
      <ActivityIndicator size="large" color="#BB86FC" style={styles.loadingIndicator} />
    ) : (
      showResults && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.exerciseItem} onPress={() => selectExercise(item)}>
                <Text style={styles.exerciseName}>{item}</Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled={true}
          />
        </View>
      )
    )}

    {/* display selected exercise form */}
    {selectedExercise && (
      <View style={styles.selectedExerciseContainer}>
        <Text style={styles.selectedExerciseTitle}>Log Workout</Text>
        <Text style={styles.selectedExerciseName}>{selectedExercise}</Text>

        {/* input fields */}
        <TextInput
          style={styles.input}
          placeholder="Sets"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={workoutData.sets}
          onChangeText={(text) => setWorkoutData({ ...workoutData, sets: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Reps per Set"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={workoutData.reps}
          onChangeText={(text) => setWorkoutData({ ...workoutData, reps: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={workoutData.weight}
          onChangeText={(text) => setWorkoutData({ ...workoutData, weight: text })}
        />

        {/* submit workout button */}
        <TouchableOpacity onPress={handleLogWorkout} style={styles.completeWorkoutButton}>
          <Text style={styles.completeWorkoutText}>Complete Workout</Text>
        </TouchableOpacity>
      </View>
    )}

    {/* display dropdowns for each exercise */}
    {exerciseList.map((exercise) => (
          <Dropdown
            key={exercise}
            title={exercise}
            data={workoutHistory[exercise] || []}
          />
        ))}

    {/* modal for adding workouts */}
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Exercise</Text>

          <TextInput
            placeholder="Exercise Name"
            placeholderTextColor="#999"
            value={newExercise.name}
            onChangeText={(text) => setNewExercise({ name: text })}
            style={styles.modalInput}
          />

          <TouchableOpacity onPress={handleAddWorkout} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Add Exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
  </TouchableWithoutFeedback>
);
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212",
  },
  loadingIndicator: {
    marginTop: 20,
    alignSelf: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    color: "white",
    backgroundColor: "#333",
    borderRadius: 10,
    borderWidth: 2,
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
    borderColor: "#BB86FC",
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: "#1E1E1E",
  },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  exerciseName: {
    fontSize: 16,
    color: "#FFF",
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
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 5,
    color: "white",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#BB86FC",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: "white",
    fontSize: 16,
  },
  selectedExerciseContainer: {
    marginTop: 20,
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  
  selectedExerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BB86FC",
    marginBottom: 10,
    textAlign: "center",
  },
  
  selectedExerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
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
    backgroundColor: "#BB86FC",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  
  completeWorkoutText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
  },
});