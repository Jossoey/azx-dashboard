import apiFetch from "./apiClient";

// Request login
export function loginUser(email, password) {
  return apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Register new email
export function registerUser(email, password) {
  return apiFetch("/api/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Get list of inventory 
export function getInventory() {
  return apiFetch("/api/inventory");
}

// Get yearly car sales
export function getCarSales(year) {
  let endpoint = "/api/sales";
  if (year) endpoint += `?year=${year}`;
  return apiFetch(endpoint);
}

// Get revenue data (YoY and total revenue)
export function getRevenueData() {
  return apiFetch("/api/revenue");
}

// Get all car models (for displaying in chatbot or dropdowns)
export function getCarModels() {
  return apiFetch("/api/carmodels");
}

// Get a car recommendation based on user preferences
export function getCarRecommendation(familySize, features = []) {
  return apiFetch("/api/recommend", {
    method: "POST",
    body: JSON.stringify({ familySize, features }),
  });
}