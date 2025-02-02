import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useUser } from '../userContext';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = Constants.expoConfig?.extra?.usdaApiKey;

interface FoodItem {
  fdcId: number;
  description: string;
  foodNutrients: { nutrientId: number; value: number; }[];
}

export default function Home() {
  const { userId } = useUser();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  //fetch food data from usda api
  const searchFood = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get("https://api.nal.usda.gov/fdc/v1/foods/search", {
        params: { api_key: API_KEY, query },
      });
      setResults(response.data.foods || []);
      setShowResults(true); //show results after searching
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      setLoading(false);
    }
  };

  //set food item
  const selectFoodItem = (item: FoodItem) => {
    setSelectedFood(item);
    setShowResults(false);
  };

  //clear search results
  const clearResults = () => {
    setResults([]); //empty results
    setShowResults(false); //hide the list
    setQuery(""); //clear search bar
    setSelectedFood(null);
  };

  return (
    <View style={styles.container}>

      {/* search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a food item"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchFood}
        />
        {/* clear button */}
        {showResults && (
          <TouchableOpacity onPress={clearResults} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="#BB86FC" />
          </TouchableOpacity>
        )}
      </View>

      {/* display selected food */}
      {selectedFood && (
        <View style={styles.selectedFoodContainer}>
          <Text style={styles.foodName}>{selectedFood.description}</Text>
          <Text style={styles.nutrients}>
            Calories: {selectedFood.foodNutrients.find(n => n.nutrientId === 1008)?.value || "N/A"}
          </Text>
          <Text style={styles.nutrients}>
            Carbs: {selectedFood.foodNutrients.find(n => n.nutrientId === 1005)?.value || "N/A"} g
          </Text>
          <Text style={styles.nutrients}>
            Fats: {selectedFood.foodNutrients.find(n => n.nutrientId === 1004)?.value || "N/A"} g
          </Text>
          <Text style={styles.nutrients}>
            Protein: {selectedFood.foodNutrients.find(n => n.nutrientId === 1003)?.value || "N/A"} g
          </Text>
        </View>
      )}

      {/* loading indicator */}
      {loading && <ActivityIndicator size="large" color="#BB86FC" style={styles.loadingIndicator} />}

      {/* display foods if show results is true */}
      {showResults && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.fdcId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.foodItem} onPress={() => selectFoodItem(item)}>
              <Text style={styles.foodName}>{item.description}</Text>
              <Text style={styles.nutrients}>
                Calories: {item.foodNutrients.find(n => n.nutrientId === 1008)?.value || "N/A"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    color: "#FFF",
  },
  clearButton: {
    padding: 10,
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  foodItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  foodName: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  nutrients: {
    fontSize: 14,
    color: "#AAA",
  },
  selectedFoodContainer: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
});
