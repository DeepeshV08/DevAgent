import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { useContext } from 'react'

const UserContext = createContext()

export const UserProvider = ({children}) => {
    const [user, setuser] = useState(null)

  return (
    <UserContext.Provider value={{user, setuser}}>
        {children}
    </UserContext.Provider>
  )
};

export default UserContext
