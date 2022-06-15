import {Link, Navigate} from 'react-router-dom'
import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import '../css/Profile.css';
import useLogout from '../hooks/useLogout';

const Profile = () =>{
    const { auth } = useAuth();
    const logout = useLogout();
    
    const signOut = async() =>{
        await logout();
        Navigate('/');
    }
    useEffect(() => {
        console.log(auth);
    },[]);
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
                    <li className='list-item' key={'razgovori'}>
                        <Link to='/profil/razgovori'>Razgovori</Link></li>
                    <li className='list-item' key={'dodaj-objekt'}>
                        <Link to='/profil/moj-profil'>Moj Profil</Link></li>
                    {auth?.roles?.includes(3737) 
                    ? <li className='list-item' key={'dodaj-sadrzaj'}>
                    <Link to='/profil/dodaj_sadrzaj'>Dodaj Sadrzaj</Link></li>
                    :<></>
                    }
                     <li className='list-item' key={'odjava'} onClick={signOut}><button className='login-button'>Odjava</button></li>
                </ul>
            </div>
            </div> 
            <main className='profile-content-wrap'>
            <Outlet/>
            </main>
            </div>
            </div>
        </>
    )
}

export default Profile