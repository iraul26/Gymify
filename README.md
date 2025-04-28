# Gymify 💪

Gymify is a fitness tracking app designed to help users log and track their workouts effortlessly. With Gymify, you can search for exercises, log your sets, reps, and weight, and view your workout history in an organized and intuitive way. Whether you're a beginner or a seasoned gym-goer, Gymify makes it easy to stay on top of your fitness goals.

This problem is being solved because i started working out last summer and i wanted a fitness app to track my progress, but all the ones i downloaded either costed a monthly subscription fee or didnt do what i wanted, so i created my own.

---

## Features ✨

- **Exercise Search**: Quickly search for exercises in your workout history.
- **Log Workouts**: Log your sets, reps, and weight for each exercise.
- **Workout History**: View a detailed history of your workouts, sorted by date.
- **Dropdown Workout Details**: Expandable dropdowns for each exercise to view past workout data.
- **Add New Exercises**: Easily add new exercises to your workout library.
- **Responsive Design**: Built with React Native for a seamless mobile experience.

---

## Technologies Used 🛠️

- **Frontend**: React Native, TypeScript
- **State Management**: React Context API
- **Backend**: Firebase Firestore (for real-time data storage), Node.JS
- **Framework**: Expo
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons

---

## Newly learned technologies

- **React Native**
- **Firebase Firestore**
- **Expo**
- **I chose to learn these new technologies becuase i wanted to try something i have never done before and all these techonologies are modern**

---

## Technical Approach 🛠️🧠
The development of Gymify focused on creating a scalable and responsive mobile application from the ground up:

Component-Based Architecture: Designed reusable components for screens and UI elements to promote scalability and maintainability.

State Management with Context API: Implemented Context API to manage user authentication, workout logs, and app state efficiently without the overhead of external libraries.

Firebase Firestore Integration: Chose Firestore for real-time syncing of user data, ensuring instant reflection of logged workouts and exercise history across devices.

Environment Management: Used a .env file and app.config.js to securely manage Firebase and API keys, allowing flexibility for development and production environments.

Third-Party API Integration: Integrated the USDA nutrition API for meal search features, demonstrating secure external API consumption.

Mobile-First Design: Prioritized intuitive navigation, quick data entry, and clean interfaces, built specifically for iOS and Android devices using React Native and Expo.

---

## Risk Management Approach ⚡🔒
Throughout development, the following risk management strategies were applied:

Data Security: Sensitive Firebase configuration keys were stored securely in environment variables, never hardcoded into the codebase.

Error Handling and Validation: Implemented error boundaries and input validation for user actions like logging workouts or adding exercises to avoid app crashes and bad data submission.

Version Control and Branch Management: Used Git branching strategies (feature branches, pull requests) to minimize merge conflicts and enable clean version control.

Scalability Planning: Designed the database and app structure with scalability in mind, allowing for easy addition of future features like social workouts.

Backup Strategy: Firestore’s real-time data redundancy ensured that user workout logs would not be lost due to single-point failures.

---

## Installation and Setup 🚀

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Firebase project with Firestore enabled

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/iraul26/gymify.git
   cd gymify

   if you would like to run the app yourself and use it locally
   1. create .env file in root of project with firebase api key, auth domain, project id, storage bucket, sender id, app id, and usda third party api key.
   2. create app.config.js file in root of project that imports dotenv and has your firebaseConfig setup in the extra module


Usage 📱
Search for Exercises:

Use the search bar to find exercises in your workout history.

Log a Workout:

Select an exercise, enter your sets, reps, and weight, and log your workout.

View Workout History:

Expand the dropdown for any exercise to see your past workout data.

Add New Exercises:

Click the "+" button to add a new exercise to your library.

---

Contributing 🤝
Contributions are welcome! If you'd like to contribute to Gymify, please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/your-feature-name).

Open a pull request.

---

## Screencast Demonstration
https://www.loom.com/share/2830939b3f374eba95eda5028423929d?sid=43218d80-3954-41d4-bfea-54869f4e4a4b
