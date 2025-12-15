const BASE_URL = "http://localhost:5000/api";

/**
 * Real Fetch Client
 * Interacts with the backend server
 */
async function fetchClient(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customConfig.headers,
  };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Adjust endpoint if it doesn't start with /
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  console.log(`[API] ${config.method} ${url}`);

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized globally
    if (response.status === 401) {
       // Optional: Auto logout if token expired
       // localStorage.removeItem("token");
       // window.location.href = "/login";
       console.warn("Unauthorized access - Token might be invalid");
    }

    const data = await response.json();

    if (!response.ok) {
        // Pass backend error message
        const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

export default fetchClient;
