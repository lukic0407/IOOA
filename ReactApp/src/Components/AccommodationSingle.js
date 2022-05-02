import React from "react";
import {useEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate,useLocation, useParams} from 'react-router-dom'
import axios from "../api/axios";
const AccomodationSingle = () =>{
    const {id} = useParams();
    const axiosPrivate = useAxiosPrivate();
    console.log(id);
    const navigate = useNavigate();
    const location = useLocation();



    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async () =>{
            try {
                const response = await axiosPrivate.get(`/users/${id}`,{
                    signal: controller.signal
                })
                console.log(response.data);
                controller.abort();
            } catch (error) {
                console.log(error);
                navigate('/',{state: {from: location}, replace:true});
                controller.abort();
            }
        }

        getUser();
        return ()=>{
            isMounted=false;
            
        }
    },[]);

    return(
        <div>
        <div>This is Accomodation Single {id}</div>
        </div>
    )

}

export default AccomodationSingle


