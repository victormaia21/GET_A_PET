import { createContext } from "react";
import UseAuth from "../hooks/useAuth";
const context = createContext();

function UserProvider({children}) {
    const {register,authenticated,logout,login,deleteCount} = UseAuth();
    return (
        <context.Provider value={{register,authenticated,logout,login,deleteCount}}>{children}</context.Provider>
    )
}

export {UserProvider,context};