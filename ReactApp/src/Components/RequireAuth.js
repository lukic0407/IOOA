import {useLocation, Navigate, Outlet} from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = ({allowedRoles}) =>{
    const {auth} = useAuth();
    const location = useLocation()
    console.log(auth.user)
    console.log(auth.roles)
    console.log(auth?.roles?.find(role=>allowedRoles?.includes(role)) )
    console.log(allowedRoles)
    return(
        auth?.roles?.find(role=>allowedRoles?.includes(role)) 
            ?  <Outlet></Outlet>
            :  auth?.user 
                ?  <Navigate to="/unauthorized" state={{from:location}} replace></Navigate>
                :  <Navigate to="/prijava" state={{from:location}} replace></Navigate>
    )
}

export default RequireAuth