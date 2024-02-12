import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});

  const login = (userInfo) => {
    setLoggedUser({
        name: userInfo.name,
        last_login: new Date().toISOString()
    });
    
    setLoggedIn(true);

    if(userInfo.timeoutSession) {
        setTimeout(() => {
            logout();
        }, userInfo.timeoutSession);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setLoggedUser({});
  }
  

  return (
    <UserContext.Provider value={{ isLoggedIn, loggedUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfo = () => useContext(UserContext);