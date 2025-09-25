import { useUserProfile } from "@/store/profile.store";
import axios from "axios";

export class InitialisationService {
    public role: string;
    public userId: string;
    public token: string;
    public backendBaseURL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL
    constructor(role: string, userId: string, token: string){
        this.role = role;
        this.userId = userId;
        this.token = token
    }
    
    public getUserProfile(){
        if(this.role=="Citizen"){
            this.getCitizenProfile();
        }
    }

    public async getCitizenProfile() {
        try {
            const res = await axios.get(
                `${this.backendBaseURL}/citizens/${this.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                }
            );
            return res.data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    
}