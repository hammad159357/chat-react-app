import { useContext } from "react";
import { UserContext } from "App";
import { Navigate } from "react-router-dom";

export default function AuthMiddleware( {children} ){
    const {user} =useContext(UserContext);

    if(user){
        return <> {children} </>
    }
    return <> <Navigate to={'/auth/login'} /> </>;

}