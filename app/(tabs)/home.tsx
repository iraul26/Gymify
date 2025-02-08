import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { Svg, Rect, Text as SvgText } from 'react-native-svg'; 
import { useUser } from '../userContext';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/firebaseConfig';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';

//api from config file
const API_KEY = Constants.expoConfig?.extra?.usdaApiKey;

//the structure of the food that will be returned by the api
interface FoodItem {
  fdcId: number;
  description: string;
  foodNutrients: { nutrientId: number; value: number; }[];
}

export default function Home() {
  //state variables
  const { userId } = useUser(); //get user id from context

  const [searchQuery, setSearchQuery] = useState(""); //user input in search bar
  const [results, setResults] = useState<FoodItem[]>([]); //store the search results
  const [loading, setLoading] = useState(false); //loading indicator for api calls
  const [showResults, setShowResults] = useState(false); //controls search results visibility
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null); //stores selected food
  const [submitting, setSubmitting] = useState(false); //form submitting status

  //state for calorie tracking and dropdown menu
  const [weeklyCalories, setWeeklyCalories] = useState<{ day: string; calories: number }[]>([]);
  const [dailyMacros, setDailyMacros] = useState<{ [key: string]: { calories: number; carbs: number; fats: number; protein: number, formattedDate: string } }>({});
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  //modal state for manual food entry
  const [modalVisible, setModalVisible] = useState(false);
  const [manualMeal, setManualMeal] = useState({
    mealName: "",
    calories: "",
    carbs: "",
    fats: "",
    protein: ""
  });

  //method to submit food manually added to db
  const handleManualMealSubmit = async () => {
    if(!manualMeal.mealName || !manualMeal.calories) {
      Alert.alert("Error, meal name and calories are required");
      return;
    }
    setSubmitting(true);

    try {
      const mealData = {
        mealName: manualMeal.mealName,
        calories: parseFloat(manualMeal.calories) || 0,
        carbs: parseFloat(manualMeal.carbs) || 0,
        fats: parseFloat(manualMeal.fats) || 0,
        protein: parseFloat(manualMeal.protein) || 0,
        date: Timestamp.now(),
        userId: userId,
      };

      await addDoc(collection(db, "meals"), mealData);

      Alert.alert("Success", "Meal added successfully");
      setModalVisible(false);
      setManualMeal({ mealName: "", calories: "", carbs: "", fats: "", protein: "" });

      //refresh bar graph and dropdowns
      fetchWeeklyCalories();
    } catch (error) {
      console.error("Error adding manual meal:", error);
      Alert.alert("Error", "Could not add meal");
    } finally {
     setSubmitting(false);
    }
  };

  //method to toggle dropdown visibility for each day
  const toggleDropdown = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  }

  //fetch weekly calories for user
  useEffect(() => {
    if(userId) {
      fetchWeeklyCalories();
    }
  }, [userId]);

  //fetch weekly meal data for user from db
  const fetchWeeklyCalories = async () => {
    try {
      const mealsRef = collection(db, "meals");
      const sevenDaysAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      const mealQuery = query(mealsRef, where("userId", "==", userId), where("date", ">=", sevenDaysAgo));
      const querySnapshot = await getDocs(mealQuery);
  
      //data structure for daily macronutrients
      const daysMap: { [key: string]: { calories: number; carbs: number; fats: number; protein: number, formattedDate: string} } = {
        Sun: { calories: 0, carbs: 0, fats: 0, protein: 0, formattedDate: "" },
        Mon: { calories: 0, carbs: 0, fats: 0, protein: 0, formattedDate: "" },
        Tue: { calories: 0, carbs: 0, fats: 0, protein: 0, formattedDate: "" },
        Wed: { calories: 0, carbs: 0, fats: 0, protein: 0, formattedDate: "" },
        Thu: { calories: 0, carbs: 0, fats: 0, protein: 0, formattedDate: "" },
        Fri: { calories: 0, carbs: 0, fats: 0, protein: 0, formattedDate: "" },
        Sat: { calories: 0, carbs: 0, fats: 0, protein: 0, formattedDate: "" },
      };
  
      querySnapshot.forEach((doc) => {
        const data = doc.data() as { date: Timestamp; calories: number; carbs: number; fats: number; protein: number };
        const mealDate = data.date.toDate();
        const day = mealDate.toLocaleDateString("en-US", { weekday: "short" });
        
        //format date for dropdown menu
        const formattedDate = mealDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit"});

        //add meal data to corresponding day
        daysMap[day].calories += data.calories || 0;
        daysMap[day].carbs += data.carbs || 0;
        daysMap[day].fats += data.fats || 0;
        daysMap[day].protein += data.protein || 0;
        daysMap[day].formattedDate = formattedDate;
      });

      //convert data to chart format
      const chartData = Object.keys(daysMap).map((day) => ({
        day,
        calories: daysMap[day].calories,
      }));

      //update state
      setWeeklyCalories(chartData);
      setDailyMacros(daysMap);
  
    } catch (error) {
      console.error("Error fetching weekly calories: ", error);
    }
  };

  //fetch food data from usda api
  const searchFood = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get("https://api.nal.usda.gov/fdc/v1/foods/search", {
        params: { api_key: API_KEY, query: searchQuery },
      });
      setResults(response.data.foods || []);
      setShowResults(true); //show results after searching
    } catch (error) {
      console.error("Error fetching food data:", error);
    } finally {
      setLoading(false);
    }
  };

  //method to handle food selection
  const selectFoodItem = (item: FoodItem) => {
    setSelectedFood(item);
    setShowResults(false);
  };

  //clear search results
  const clearResults = () => {
    setResults([]); //empty results
    setShowResults(false); //hide the list
    setSearchQuery(""); //clear search bar
    setSelectedFood(null);
  };

  //submit meal details to db
  const submitMeal = async () => {
    if(!selectedFood) {
      Alert.alert("Error, No meal selected");
      return;
    }
    setSubmitting(true);
    try {
      const mealData = {
        mealName: selectedFood.description,
        calories: selectedFood.foodNutrients.find(n => n.nutrientId === 1008)?.value || 0,
        carbs: selectedFood.foodNutrients.find(n => n.nutrientId === 1005)?.value || 0,
        fats: selectedFood.foodNutrients.find(n => n.nutrientId === 1004)?.value || 0,
        protein: selectedFood.foodNutrients.find(n => n.nutrientId === 1003)?.value || 0,
        date: Timestamp.now(),
        userId: userId
      };

      await addDoc(collection(db, "meals"), mealData);
      Alert.alert("Success, Meal submitted successfully");
      clearResults();

      //refresh bar graph after submitting a meal
      fetchWeeklyCalories();
    }
    catch(error) {
      console.error("Error submitting meal ", error);
      Alert.alert("Error submitting meal");
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    {/* modal when user clicks on the add button in search bar */}
    <ScrollView style={styles.scrollContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Meal</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Meal Name"
              placeholderTextColor="#999"
              value={manualMeal.mealName}
              onChangeText={(text) =>
                setManualMeal({ ...manualMeal, mealName: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Calories"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={manualMeal.calories}
              onChangeText={(text) =>
                setManualMeal({ ...manualMeal, calories: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Carbs (g)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={manualMeal.carbs}
              onChangeText={(text) =>
                setManualMeal({ ...manualMeal, carbs: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Fats (g)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={manualMeal.fats}
              onChangeText={(text) =>
                setManualMeal({ ...manualMeal, fats: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Protein (g)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={manualMeal.protein}
              onChangeText={(text) =>
                setManualMeal({ ...manualMeal, protein: text })
              }
            />

            <TouchableOpacity
              onPress={handleManualMealSubmit}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search for a food item"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchFood}
          />
          {showResults && (
            <TouchableOpacity onPress={clearResults} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="#BB86FC" />
            </TouchableOpacity>
          )}

          {/* add meal button */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={28} color={"#bb86fc"} />
          </TouchableOpacity>
        </View>

        {/* display search results */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#BB86FC"
            style={styles.loadingIndicator}
          />
        ) : (
          showResults && (
            <View style={styles.searchResultsContainer}>
              <FlatList
                data={results}
                keyExtractor={(item) => item.fdcId.toString()}
                renderItem={({ item }) => {
                  //extract macronutrients
                  const calories =
                    item.foodNutrients.find((n) => n.nutrientId === 1008)
                      ?.value || "N/A";
                  const carbs =
                    item.foodNutrients.find((n) => n.nutrientId === 1005)
                      ?.value || "N/A";
                  const fats =
                    item.foodNutrients.find((n) => n.nutrientId === 1004)
                      ?.value || "N/A";
                  const protein =
                    item.foodNutrients.find((n) => n.nutrientId === 1003)
                      ?.value || "N/A";

                  return (
                    <TouchableOpacity
                      style={styles.foodItem}
                      onPress={() => selectFoodItem(item)}
                    >
                      <Text style={styles.foodName}>{item.description}</Text>
                      <Text style={styles.nutrients}>
                        Calories: {calories} kcal
                      </Text>
                      <Text style={styles.nutrients}>Carbs: {carbs} g</Text>
                      <Text style={styles.nutrients}>Fats: {fats} g</Text>
                      <Text style={styles.nutrients}>Protein: {protein} g</Text>
                    </TouchableOpacity>
                  );
                }}
                nestedScrollEnabled={true}
              />
            </View>
          )
        )}

        {/* display selected food */}
        {selectedFood && (
          <View style={styles.selectedFoodContainer}>
            <Text style={styles.foodName}>{selectedFood.description}</Text>
            <Text style={styles.nutrients}>
              Calories:{" "}
              {selectedFood.foodNutrients.find((n) => n.nutrientId === 1008)
                ?.value || "N/A"}
            </Text>
            <Text style={styles.nutrients}>
              Carbs:{" "}
              {selectedFood.foodNutrients.find((n) => n.nutrientId === 1005)
                ?.value || "N/A"}{" "}
              g
            </Text>
            <Text style={styles.nutrients}>
              Fats:{" "}
              {selectedFood.foodNutrients.find((n) => n.nutrientId === 1004)
                ?.value || "N/A"}{" "}
              g
            </Text>
            <Text style={styles.nutrients}>
              Protein:{" "}
              {selectedFood.foodNutrients.find((n) => n.nutrientId === 1003)
                ?.value || "N/A"}{" "}
              g
            </Text>

            {/* submit button */}
            <TouchableOpacity
              onPress={submitMeal}
              style={styles.submitButton}
              disabled={submitting}
            >
              <Text style={styles.submitText}>
                {submitting ? "Submitting..." : "Submit Meal"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* weekly calorie intake */}
        <Text style={styles.chartTitle}>Weekly Calorie Intake</Text>

        {/* bar graph */}
        <View style={styles.chartContainer}>
          <Svg width="100%" height="200">
            {weeklyCalories.map((item, index) => {
              const barHeight = item.calories / 20;
              return (
                <React.Fragment key={index}>
                  {/* bar */}
                  <Rect
                    x={index * 50 + 20}
                    y={180 - barHeight}
                    width={30}
                    height={barHeight}
                    fill="black"
                  />
                  {/* calorie label */}
                  <SvgText
                    x={index * 50 + 35}
                    y={175 - barHeight}
                    fontSize="12"
                    fill="white"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {String(item.calories)}
                  </SvgText>
                </React.Fragment>
              );
            })}
            {/* day labels */}
            {weeklyCalories.map((item, index) => (
              <SvgText
                key={`label-${index}`}
                x={index * 50 + 35}
                y={200}
                fontSize="12"
                fill="white"
                textAnchor="middle"
              >
                {String(item.day)}
              </SvgText>
            ))}
          </Svg>
        </View>

        {/* daily macros dropdown */}
        <View style={styles.dropdownContainer}>
          {Object.keys(dailyMacros).map((day) => (
            <View key={day} style={styles.dropdownItem}>
              <TouchableOpacity
                onPress={() => toggleDropdown(day)}
                style={styles.dropdownButton}
              >
                <Text style={styles.dayLabel}>
                  {day} ({dailyMacros[day]?.formattedDate || "N/A"})
                </Text>
                <Ionicons
                  name={expandedDay === day ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              {expandedDay === day && (
                <View style={styles.macroDetails}>
                  <Text style={styles.dropDownNutrients}>
                    Calories: {dailyMacros[day].calories} cal
                  </Text>
                  <Text style={styles.dropDownNutrients}>
                    Carbs: {dailyMacros[day].carbs} g
                  </Text>
                  <Text style={styles.dropDownNutrients}>
                    Fats: {dailyMacros[day].fats} g
                  </Text>
                  <Text style={styles.dropDownNutrients}>
                    Protein: {dailyMacros[day].protein.toFixed(2)} g
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </>
  );  
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
  searchResultsContainer: {
    maxHeight: 350,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 20,
    marginTop: 5,
    backgroundColor: "black",
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
  submitButton: {
    backgroundColor: "#BB86FC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  chartContainer: {
    height: 220,
    width: "100%",
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContainer: {
    marginTop: 20,
  },
  dropdownItem: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  macroDetails: {
    marginTop: 5,
  },
  dropDownNutrients: {
    fontSize: 14,
    color: "white",
    paddingVertical: 2,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "black"
  },
  addButton: {
    padding: 10,
    marginLeft: 8,
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
  }
});
