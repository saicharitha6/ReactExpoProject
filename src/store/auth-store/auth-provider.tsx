/* eslint-disable prettier/prettier */
import React, { createContext, useState } from 'react';

interface AuthContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const AuthContext = createContext<AuthContextProps>({ user: null, setUser: () => {} });

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
