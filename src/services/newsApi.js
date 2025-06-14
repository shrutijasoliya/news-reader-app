import axios from "axios";

const API_KEY = "pub_e379807077cb4f12b5fe87b8c3918144";
const BASE_URL = "https://newsdata.io/api/1";

export const newsApi = {
  getTopHeadlines: async (country = "us") => {
    try {
      const response = await axios.get(`${BASE_URL}/news`, {
        params: {
          country,
          apikey: API_KEY,
          language: "en",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },
};
