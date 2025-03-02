import { ParamListBase } from "@react-navigation/native";

export interface User {
    id: number;
    username: string;
    name: string;
    bio: string | null;
    email: string;
    profileImageUrl: string;
    location: string | null;
    created_at: string | null;
    updated_at: string | null;
    token: string | null;
}

export interface Entry {
    id: number;
    text: string;
    location: string | null;
    emotion: string | null;
    mediaUrl: string | null;
    public: boolean | null;
    user_id: number;
    parent_entry_id: number | null;
    created_at: string;
    updated_at: string;
    child_entries: Entry[];
};
  
export interface FriendEntry  {
    id: number;
    text: string;
    location: string | null;
    emotion: string | null;
    mediaUrl: string | null;
    public: boolean | null;
    user_id: number;
    parent_entry_id: number | null;
    created_at: string;
    updated_at: string;
    user: User;
    child_entries: Entry[];
};
  

export type RootStackParamList = ParamListBase & {
    Home: undefined;
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    Detail: { entryId: string };
    UserProfile: { userId: string };
    Profile: undefined;
    Friends: undefined;
};