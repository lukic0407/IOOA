import React from "react";
import {useEffect, useState} from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useParams, useNavigate,useLocation} from 'react-router-dom'
import '../css/SingleAccommodation.css'
import locationIcon from '../img/Icons/Location-Icon.svg'
import email from '../img/Icons/email.svg'
import phone from '../img/Icons/phone.svg'
import web from '../img/Icons/web.svg'

const AccomodationSingle = () =>{
    const {id} = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [accommodation, setAccommodation] = useState({});
    const navigate = useNavigate();
    const location = useLocation();


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
                controller.abort();
            } catch (error) {
                console.log(error);
                navigate('/',{state: {from: location}, replace:true});
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
                    <img className="icon" src={locationIcon}/><a href={`https://maps.google.com/?q=${accommodation.city}${accommodation.street}`}><span className="location">{accommodation.city}, {accommodation.street}</span></a>
                    <img className="icon" src={phone}/><a href={`tel:${accommodation.contactNumber}`}><span className="mobile">{accommodation.contactNumber}</span></a>
                    <img className="icon" src={email}/><a href={`mailto:${accommodation.email}`}><span className="email">{accommodation.email}</span></a>
                    <img className="icon" src={web}/><a href={`${accommodation.website}`} rel="nofollow"><span className="web">{accommodation.website}</span></a>
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


