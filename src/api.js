// URL de base de l'API
//const BASE_URL = "http://localhost:5000/api";
const BASE_URL = "/api";

// Fonction pour construire des URL complètes
const buildUrl = (endpoint) => {
  // S'assurer que l'endpoint commence par / si ce n'est pas déjà le cas
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BASE_URL}${formattedEndpoint}`;
};

// Service API avec méthodes standard
const apiService = {
  // Configuration par défaut pour fetch
  defaultOptions: {
    headers: {
      'Content-Type': 'application/json'
    }
  },

  // GET request
  async get(endpoint) {
    try {
      const response = await fetch(buildUrl(endpoint), {
        method: 'GET',
        ...this.defaultOptions
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la requête GET vers ${endpoint}:`, error);
      throw error;
    }
  },

  // POST request
  async post(endpoint, data) {
    try {
      const response = await fetch(buildUrl(endpoint), {
        method: 'POST',
        ...this.defaultOptions,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la requête POST vers ${endpoint}:`, error);
      throw error;
    }
  },
};

export default apiService;