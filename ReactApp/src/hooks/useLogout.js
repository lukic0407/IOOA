import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const {setAuth,setLogedIn} = useAuth()

    const logout = async () =>{
        setAuth({});
        setLogedIn(false);
        try {
            const response = await axios('/auth/logout',{
                withCredentials:true
            })
        } catch (error) {
            console.log(error)
        }
    }

    return logout
}

export default useLogout;