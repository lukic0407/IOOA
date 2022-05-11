import React from "react";
import {useEffect, useState} from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useParams} from 'react-router-dom'
import '../css/SingleAccommodation.css'
import locationIcon from '../img/Icons/Location-Icon.svg'
import email from '../img/Icons/email.svg'
import phone from '../img/Icons/phone.svg'
import web from '../img/Icons/web.svg'

const AccomodationSingle = () =>{
    const {id} = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [accommodation, setAccommodation] = useState({});



    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();

        const getAccommodation = async () =>{
            try {
                const response = await axiosPrivate.get(`/accommodation/${id}`,{
                    signal: controller.signal
                })
                console.log(response.data);
                isMounted && setAccommodation(response.data);
                setAccommodation(response.data);
                controller.abort();
            } catch (error) {
                console.log(error);
                //navigate('/',{state: {from: location}, replace:true});
                controller.abort();
            }
        }

        getAccommodation();
        return ()=>{
            isMounted=false;
        }
    },[]);

    return(
        <>
        {accommodation ?
        <div className="accommodation-hero">
            <img className="accommodation-background" src={`http://localhost:3001/${accommodation.images_single}`}></img>
            <div className="info-container">
                <div>
                <h1><hr className="hero-divider"></hr>
                {accommodation.name}</h1>
                </div>
                <div className="details">
                    <img className="icon" src={locationIcon}/><span className="location">{accommodation.city}, {accommodation.street}</span>
                    <img className="icon" src={phone}/><span className="mobile">{accommodation.contactNumber}</span>
                    <img className="icon" src={email}/><span className="email">{accommodation.email}</span>
                    <img className="icon" src={web}/><span className="web">{accommodation.website}</span>
                </div>
            </div>
        </div>
        :<p>
            Greška pri učitavanju smještaja
        </p>
        }
        </>
    );

}

export default AccomodationSingle


