// frontend/src/api.js
export const loginUser = async (email, password) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await res.json();

    // For dummy user, backend doesn't return a token, so we can fake it
    if (data.success) {
      return { success: true, token: "dummy-token", message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
};