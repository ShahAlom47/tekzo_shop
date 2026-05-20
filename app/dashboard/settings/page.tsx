"use client";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/AuthContext";
import { getUserInfo } from "@/lib/allApiRequest/userRequest/userRequest";
import { User } from "@/Interfaces/userInterfaces";
import { ProfileCard } from "@/Components/Settings/UserProfileCard";
import UserTable from "@/Components/Settings/UserTable";

interface SettingDataType {

    currentUser: User;
    users: User[];  

}

export default function Settings() {
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["users", user?.phone || ""],
    queryFn:async () =>{
        const res = await  getUserInfo(user?.phone || "")
      
        return res?.data as SettingDataType; ;
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  const currentUser = data?.currentUser;
  const users = data?.users || [];




   return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {currentUser && <ProfileCard currentUser={currentUser} />}

      {currentUser?.role === "OWNER" && (
        <UserTable users={users} currentUser={currentUser}/>
      )}
    </div>
  );
}
