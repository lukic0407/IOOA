import React from "react";
import "../css/Home.css"
import {Link} from 'react-router-dom'
import useAuth from "../hooks/useAuth";

const HeaderContent = () =>{

        
    const {logedIn} = useAuth()
    console.log(logedIn)
    
        return (
                <div className="Header-wrap">
                    <div className="Header-menu-wrap">
                        <ul className="List-wrap">
                            <li className="List-item"><Link to="/">Naslovna</Link></li>
                            <li className="List-item"><Link to="/smjestaji">Smještaji</Link></li>
                            <li className="List-item"><Link to="/o-nama">O nama</Link></li>
                        </ul>
                    </div>
                    <div className="Header-menu-wrap Align-left">
                        <ul className="List-wrap">{logedIn
                            ?   <li className="List-item"><Link to="/profil" >Profil</Link></li>
                            :   <li className="List-item"><Link to="/prijava">Prijava</Link></li>} 
                        </ul>
                    </div>
                </div>
        )
}

export default HeaderContent