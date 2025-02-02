import React, { createContext, useState, useContext, ReactNode } from "react";

//define context type
interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

//create context
const UserContext = createContext<UserContextType | undefined>(undefined);

//context provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

//hook to access user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};