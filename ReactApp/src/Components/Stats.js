import React from "react";
import { useState, useEffect, useLayoutEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate,useLocation, Link} from 'react-router-dom'
const Stats = () =>{

    const [accommodation,setAccommodations] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        
        let isMounted = true;
        const controller = new AbortController();
        console.log(isMounted);
        const getUsers = async () =>{
            console.log(isMounted);
            try {
                const response = await axiosPrivate.get('/accommodation/',{
                    signal: controller.signal
                })
                isMounted && setAccommodations(response.data);
            } catch (error) {
                console.log(error);
                navigate('/error',{state: {from: location},replace:true});
                controller.abort();
            } 
        }
        getUsers();
        return () => {
            isMounted = false;
            controller.abort();
        }
        
    },[]);

    return (
        <>
            <div className="spacer-50"></div>
            <div className="section-wrap stats">
                <div className="overlay"></div>
                <div className="stats-wrap contain">
                    <div className="stats-item">
                    <span>1000+</span>
                    <p>Godišnjih posjeta</p>
                    </div>
                    <div className="stats-item">
                    <span>13215</span>
                    <p>Sretnih gostiju</p>
                    </div>
                    <div className="stats-item">
                    <span>100+</span>
                    <p>Poslanih upita</p>
                    </div>
                    <div className="stats-item">
                    <span>50+</span>
                    <p>Ponuda naših partnera</p>
                    </div>
                </div>
            </div>    
        </>
    )

}

export default Stats;


