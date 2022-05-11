import React, { useRef } from "react";
import { useState, useEffect, useLayoutEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate,useLocation, Link} from 'react-router-dom'
import placeholder_01 from '../img/placeholder_gallery_01.jpg'
import placeholder_02 from '../img/placeholder_gallery_02.jpg'
import placeholder_03 from '../img/placeholder_gallery_03.jpg'
import placeholder_04 from '../img/placeholder_gallery_04.jpg'
import placeholder_05 from '../img/placeholder_gallery_05.jpg'
const Categories = () =>{

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
            <div className="section-wrap">
                <div className="title-wrap">
                    <h2 className="section-title">Što možete pronaći?</h2>
                    <hr></hr>
                    <p>Da biste se lakše snašli, složili smo sve u 5 osnovnih kategorija.</p>
                    <div className="spacer-50"></div>
                </div>
                    <div className="abstract-gallery contain">
                        <div className="image-2">
                            <div className="image-holder">
                                <img src={placeholder_01}></img>
                                <div className="category-description">
                                    <h3>Apartmani</h3>
                                </div>
                            </div>
                            <div className="image-holder">
                                <img src={placeholder_02}></img>
                                <div className="category-description">
                                    <h3>Kuće za odmor</h3>
                                </div>
                            </div>
                        </div>
                        <div className="image-3">
                            <div className="image-holder">
                                <img src={placeholder_03}></img>
                                <div className="category-description">
                                    <h3>Stanovi</h3>
                                </div>
                            </div>
                            <div className="image-holder">
                                <img src={placeholder_04}></img>
                                <div className="category-description">
                                    <h3>Ville</h3>
                                </div>
                            </div>
                            <div className="image-holder">
                                <img src={placeholder_05}></img>
                                <div className="category-description">
                                    <h3>Eco</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
        </>
    )

}

export default Categories;


