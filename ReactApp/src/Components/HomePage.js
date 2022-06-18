import React, { useState } from "react";
import Accomodations from "./Accommodation";
import Categories from "./Categories";
import Stats from "./Stats";
import {useNavigate} from 'react-router-dom'
const HomePage = () =>{
const navigate = useNavigate();
    const [searchValue, setSearch] = useState('')


    return (
        <>
        <div className="hero-background">
            <div className="hero-content">
                <form className="search-form">
                    <input
                        type="text"
                        id="search"
                        required={true}
                        autoComplete="on"
                        onChange={e => setSearch(e.target.value)}
                        value={searchValue}
                    ></input>
                    <button onClick={(e)=>navigate("/smjestaji")} className="search-button">Pretraga</button>
                </form>
            </div>
            
        </div>
        <Accomodations/>
        <Categories/>
        <Stats/>
        </>
    )
} 

export default HomePage