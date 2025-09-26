import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const localityService = {

  async getLocalityByCitizenId(citizenId: string) {
    try {
      const response = await axios.get(`${BASE_URL}/locality/citizen/${citizenId}`);
      return response.data.name;
    } catch (error) {
      console.error("Failed to fetch locality:", error);
      return { id: 0, name: "Unknown Locality", pincode: "000000" };
    }
  },
};