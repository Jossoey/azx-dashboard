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