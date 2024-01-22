import loginContext from "@/app/loginContext";
import React, { useContext, useEffect } from "react";

function ProfileInfo() {
  const { user } = useContext(loginContext);
  useEffect(() => {
    const loadProfileInfo = async () => {
      try {
        const url = `http://localhost:3000/api/users/profile/${user?.userId}`;
      } catch (e) {
        
      }
    };
  }, []);
  return <div>ProfileInfo</div>;
}

export default ProfileInfo;
