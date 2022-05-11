import React, { useRef } from "react";
import { useState, useEffect, useLayoutEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate,useLocation, Link} from 'react-router-dom'
import locationIcon from '../img/Icons/Location-Icon.svg'
import '../css/Search.css'
const Search = () =>{

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
                //navigate('/error',{state: {from: location},replace:true});
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
            <div className="search-wrap">
                <div className="search-accommodation">
                {accommodation?.length
                        ? (accommodation.map(accommodation =>
                            <div className="search-accommodation-wrap">
                                <Link to={`../smjestaj/${accommodation?._id}`}>
                                    <div className="search-accommodation-thumbnail">
                                        <div className="search-thumbnail-holder">
                                            <img src={`http://localhost:3001/${accommodation?.images_single}`}></img>
                                        </div>

                                    </div>
                                    </Link>
                                    <div className="search-accommodation-description">
                                            <h3>{accommodation?.name}</h3>
                                            <img className="icon" src={locationIcon} /><span className="location">{accommodation?.city}, {accommodation?.street}</span>
                                            <hr></hr>
                                            <div className="search-accommodation-description-bottom">
                                                <span className="accommodation-type">{accommodation?.type}</span>
                                            </div>
                                        </div>
                            </div>
                            
                        )
                        ) : <p>No Accomodations to display</p>
                    }
                </div>
                <div className="maps-wrap">

                </div>
            </div>
        </>
    )

}

export default Search;


