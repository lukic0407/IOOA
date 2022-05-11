import {Link} from 'react-router-dom'
import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import '../css/Profile.css';

const Profile = () =>{
    return(
        <>
            <div className="hero-background-profile">
                <div className="hero-content">

                </div>
            </div>
            <div className="main-content-wrap">
            <div className="main-content">
            <div className='side-menu-wrap'> 
            <div className='side-menu'> 
                <ul className='menu-list'>
                <li className='list-item' key={'nadzorna-ploca'}>
                        <Link to='/profil/nadzorna_ploca'>Nadzorna Ploča</Link></li>
                    <li className='list-item' key={'dodaj-objekt'}>
                        <Link to='/profil/dodaj_smjestaj'>Dodaj Objekt</Link></li>
                    <li className='list-item' key={'odjava'}><button className='login-button'>Odjava</button></li>
                </ul>
            </div>
            </div> 
            <main>
            <Outlet/>
            </main>
            </div>
            </div>
        </>
    )
}

export default Profile