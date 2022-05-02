import React from "react";
import { useState, useEffect, useLayoutEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate,useLocation, Link} from 'react-router-dom'
const Accomodation = () =>{

    const [users,setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()
    const location = useLocation()
    
    useEffect(()=>{
        console.log("hweesy");
        let isMounted = true;
        const controller = new AbortController();
        
        const getUsers = async () =>{
            try {
                const response = await axiosPrivate.get('/users/',{
                    signal: controller.signal
                })
                console.log(response.data);
                isMounted && setUsers(response.data);
                controller.abort();
                
            } catch (error) {
                console.log(error);
                navigate('/error',{state: {from: location},replace:true});
                controller.abort();
            }
        }

        getUsers();
        return () => {
            isMounted = false;
               
        }
    },[]);

    return(
        <div>
        <article>
        <h2>Users List</h2>
        {users?.length
            ? (
                <ul>
                    {users.map((user,i) => <li key={i}><Link to={`smjestaj/${user?._id}`}>{user?.username}</Link></li>)}
                </ul>
            ) : <p>No users to display</p>
        }
    </article>
        <div>This is Accomodation</div>
        </div>
    )

}

export default Accomodation


