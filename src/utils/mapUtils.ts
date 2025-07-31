import { Alert } from "react-native";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_Maps_API_KEY;

export const getRouteDirections = async (origin, destination) => {
  if (!GOOGLE_API_KEY) {
    console.error("Google Maps API key is missing.");
    Alert.alert("Error", "Google Maps API key is not configured.");
    return [];
  }

  const originString = `${origin.latitude},${origin.longitude}`;
  const destinationString = `${destination.latitude},${destination.longitude}`;

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.routes && json.routes.length > 0) {
      const points = json.routes[0].legs[0].steps.reduce((coords, step) => {
        coords.push({
          latitude: step.start_location.lat,
          longitude: step.start_location.lng,
        });
        coords.push({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        });
        return coords;
      }, []);
      return points;
    } else {
      console.log("No routes found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching directions:", error);
    Alert.alert("Error", "Could not fetch directions.");
    return [];
  }
};
