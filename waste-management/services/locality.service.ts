// Simple locality service - you can replace with actual API calls later
export const localityService = {
  getLocalityName: (localityId: number): string => {
    // This is a temporary mapping - replace with actual API call to backend
    const localities: { [key: number]: string } = {
      1: "MG Road",
      2: "Brigade Road", 
      3: "Koramangala",
      4: "Indiranagar",
      5: "Whitefield",
      6: "Electronic City",
      7: "HSR Layout",
      8: "Marathahalli",
      9: "Jayanagar",
      10: "Rajajinagar"
    };
    
    return localities[localityId] || `Locality ${localityId}`;
  },

  // You can add more methods here for API calls when backend is ready
  async getLocalityById(localityId: number) {
    // TODO: Replace with actual API call
    return {
      id: localityId,
      name: this.getLocalityName(localityId),
      pincode: "560001"
    };
  }
};