export {}

// Create a type for the roles
export type Roles = 'Admin' | 'LocalityAdmin' | 'DistrictAdmin' | 'Citizen' | 'Worker'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}