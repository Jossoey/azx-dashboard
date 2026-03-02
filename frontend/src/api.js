export async function loginUser(email, password) {
  const response = await fetch(
    "http://azx-fullstack-env.eba-eqftqnva.ap-southeast-1.elasticbeanstalk.com/api/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function registerUser(email, password) {
  const response = await fetch(
    "http://azx-fullstack-env.eba-eqftqnva.ap-southeast-1.elasticbeanstalk.com/api/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getInventory() {
  const response = await fetch(
    "http://azx-fullstack-env.eba-eqftqnva.ap-southeast-1.elasticbeanstalk.com/api/inventory"
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch inventory");
  }

  return data;
}

export async function getCarSales(year) {
  let url = "http://azx-fullstack-env.eba-eqftqnva.ap-southeast-1.elasticbeanstalk.com/api/sales";
  if (year) url += `?year=${year}`;

  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sales data");
  }

  return data;
}

export async function getRevenueData() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://azx-fullstack-env.eba-eqftqnva.ap-southeast-1.elasticbeanstalk.com/api/revenue",
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch revenue data");
  }

  return data;
}

// Fetch all car models (for displaying in chatbot or dropdowns)
export async function getCarModels() {
  const response = await fetch(
    "http://azx-fullstack-env.eba-eqftqnva.ap-southeast-1.elasticbeanstalk.com/api/carmodels"
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch car models");
  }

  return data;
}

// Request a car recommendation based on user preferences
export async function getCarRecommendation(familySize, features = []) {
  const response = await fetch(
    "http://azx-fullstack-env.eba-eqftqnva.ap-southeast-1.elasticbeanstalk.com/api/recommend",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ familySize, features }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get car recommendation");
  }

  return data;
}