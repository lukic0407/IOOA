import React, { useState } from "react";
import Accomodation from "./Accommodation";

const HomePage = () =>{
    const [searchValue, setSearch] = useState('')


    return (
        <div className="hero-background">
            <div className="hero-content">
                <form>
                    <input
                        type="text"
                        id="search"
                        required={true}
                        autoComplete="on"
                        onChange={e => setSearch(e.target.value)}
                        value={searchValue}
                    ></input>
                    <button>Pretraga</button>
                </form>
            </div>
            <Accomodation></Accomodation>
        </div>
        
    )
} 

export default HomePage