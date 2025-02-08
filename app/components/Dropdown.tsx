import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//define the type for a workout entry
interface WorkoutEntry {
  sets: number;
  reps: number;
  weight: number;
  date: {
    toDate: () => Date;
  };
}

//define the props for the dropdown component
interface DropdownProps {
  title: string;
  data: WorkoutEntry[];
}

//dropdown component
const Dropdown: React.FC<DropdownProps> = ({ title, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.dropdownHeader}>
        <Text style={styles.dropdownTitle}>{title}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#BB86FC" />
      </TouchableOpacity>

      {isOpen && (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.workoutItem}>
              <Text style={styles.workoutText}>Sets: {item.sets}</Text>
              <Text style={styles.workoutText}>Reps: {item.reps}</Text>
              <Text style={styles.workoutText}>Weight: {item.weight}</Text>
              <Text style={styles.workoutText}>Date: {item.date?.toDate().toLocaleDateString()}</Text>
            </View>
          )}
          style={styles.dropdownList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginTop: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    padding: 10,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  dropdownList: {
    maxHeight: 200,
    marginTop: 10,
  },
  workoutItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  workoutText: {
    fontSize: 14,
    color: "#FFF",
  },
});

export default Dropdown;