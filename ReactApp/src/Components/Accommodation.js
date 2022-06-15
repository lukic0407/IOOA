import React, { useRef } from "react";
import { useState, useEffect, useLayoutEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate,useLocation, Link} from 'react-router-dom'
import locationIcon from '../img/Icons/Location-Icon.svg'
const Accomodation = () =>{

    const [accommodation,setAccommodations] = useState();
    const [scroll,setScroll] = useState({left:0});
    const [maxscroll, setMaxScroll] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const sliderRef = useRef(null);
    const scrollAmount = 500; // zasada HC treba naparaviti dinamicno
    var intFrameWidth; // zasada HC treba naparaviti dinamicno
    intFrameWidth = window.innerWidth


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
                setMaxScroll(response.data.length*scrollAmount);
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

    const handleScroll = (dir)=>{
        var pre_check_res = 0; 
        var local_left = scroll.left;
        if(dir){
            console.log("local_left top: " + local_left);
            local_left -=scrollAmount;
            console.log("local_left after add: " + local_left);
            if (maxscroll > intFrameWidth) {
                pre_check_res = local_left;
            }
            if(intFrameWidth + Math.abs(local_left) > maxscroll){
                pre_check_res = -(maxscroll-intFrameWidth)-20;
            }
            if (pre_check_res > sliderRef.current.clientWidth) {
                pre_check_res = sliderRef.current.clientWidth;
            }
            setScroll({ ...scroll, left: pre_check_res });
        }else{
            pre_check_res = scroll.left+scrollAmount;
            if(pre_check_res >= 0){
                pre_check_res = 0;
            }
            setScroll({... scroll, left: pre_check_res});
        }
        
    }

    return(
        <>
        <div className="section-wrap">
            <div className="title-wrap">
                <h2 className="section-title">Smještaji</h2>
            <hr></hr>
            <p>Istaknuti objekti na .....</p>
            </div>
            
            <div className="accommodation-slider-wrap">
            <div className="button scroll-left" onClick={() => handleScroll(0)}>
                {'<'}
                </div>
                <div className="button scroll-right" onClick={() => handleScroll(1)}>
                {'>'} 
                </div>
                <div className="accommodation-slider" ref={sliderRef} style={scroll}>
        {accommodation?.length
            ? ( accommodation.map(accommodation =>
                        <div className="accommodation-wrap">
                            <Link to={`smjestaj/${accommodation?._id}`}>
                            <div className="accommodation-thumbnail">
                                <div className="thumbnail-holder">
                                    <img src={`http://localhost:3001/${accommodation?.images_single}`}></img>
                                </div>
                            <div className="accommodation-description">
                                <h3>{accommodation?.name}</h3>
                                <img className="icon" src={locationIcon}/><span className="location">{accommodation?.city}, {accommodation?.street}</span>
                                <hr></hr>
                            <div className="accommodation-description-bottom">
                                <span className="accommodation-type left">{accommodation?.type}</span>
                            </div>
                            </div>
                            </div></Link>
                        </div>
                    )
            ) : <p>No Accomodations to display</p>
        }
        </div>
    </div>
    </div>

    <div className="spacer-50"></div>
    </>
    )
    
}

export default Accomodation;


