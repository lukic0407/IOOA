import React from "react";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () =>{
    const {setAuth,setLogedIn} = useAuth()
    const refresh = async () =>{
        const response = await axios.get('/auth/refresh',{
            withCredentials:true
        })
        setLogedIn(true);
        setAuth(prev =>{
            console.log(JSON.stringify(prev))
            console.log(response.data.accessToken)
            return {
                ...prev,
                accessToken:response.data.accessToken,
                roles: response.data.roles
            }
        })
        return response.data.accessToken
    }

    return(
        refresh
    )
}

export default useRefreshToken