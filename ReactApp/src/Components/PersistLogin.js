import {Outlet} from 'react-router-dom'
import {useState, useEffect} from "react"
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'


const PersistLogin = () =>{
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken();
    const {auth, persist} = useAuth();
    
    useEffect(()=>{
        let isMounted = true;
        const verifyRefreshToken = async () =>{
            try{
                await refresh()
            }
            catch(error){
                console.log(error)
            }
            finally{
                isMounted && setIsLoading(false)
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return() => isMounted = false;
    },[])

    useEffect(()=>{
        console.log(`IsLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    },[isLoading])

    return(
        <>
            {!persist 
                ? <Outlet></Outlet>
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet></Outlet>
            }
        </>
    )
}

export default PersistLogin