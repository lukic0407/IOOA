import React, { useRef } from "react";
import { useEffect, useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import '../css/SingleAccommodation.css'
import locationIcon from '../img/Icons/Location-Icon.svg'
import email from '../img/Icons/email.svg'
import phone from '../img/Icons/phone.svg'
import web from '../img/Icons/web.svg'
import L from 'leaflet';
import osm from "../context/OsmProvider"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Message } from "../IconPack/Icons";
import useAuth from "../hooks/useAuth";

const AccomodationSingle = () => {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [accommodation, setAccommodation] = useState();
    const [message, setMessage] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [messageSent, setMessageSent] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const ZOOM_LEVEL = 15;
    const { auth } = useAuth();

    var MapTestIcon = L.icon({
        iconUrl: require('../img/Icons/Map_Icon.png'),
        iconSize: [64, 64], // size of the icon
        iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -64] // point from which the popup should open relative to the iconAnchor
    });

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAccommodation = async () => {
            try {
                const response = await axiosPrivate.get(`/accommodation/${id}`, {
                    signal: controller.signal
                })
                console.log(response.data);
                isMounted && setAccommodation(response.data);
                controller.abort();
            } catch (error) {
                console.log(error);
                navigate('/', { state: { from: location }, replace: true });
                controller.abort();
            }
        }

        getAccommodation();
        return () => {
            isMounted = false;
        }
    }, []);

    const handleChat = (e) => {
        e.preventDefault();
        setShowChat(!showChat);
    }

    const changePhoto = async (direction) =>{
        if(direction==0){
            let newIndex = currentPhotoIndex-1;
            if(newIndex<0) return;
            setCurrentPhotoIndex(newIndex);
        }else{
            let newIndex = currentPhotoIndex+1;
            if(newIndex>=accommodation.gallery.length) return;
            setCurrentPhotoIndex(newIndex);
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message) {
            try {
                const response = await axiosPrivate.post('/message/accommodation/',
                    JSON.stringify({
                        to_chat_user: accommodation.ownedby_id._id,
                        messageContent: message

                    }),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    })
                console.log(response.data);
                setMessageSent(true);
            } catch (error) {
                console.log(error);
                setMessageSent(true);
            }
        }
    }
    return (
        <>
            {accommodation ?
                <>
                    <div className="accommodation-hero">
                        <div className="dynamic-hero">
                            {accommodation?.headerphotos.length ?
                                (accommodation.headerphotos.map(photo =>
                                    <div className="dynamic-hero-flex-1">
                                        <img className="accommodation-background" src={`http://localhost:3001/${photo}`}></img>
                                    </div>
                                )
                                )
                                : <p>No image found</p>
                            }
                        </div>
                        <div className="info-container">
                            <div>
                                <h1><hr className="hero-divider"></hr>
                                    {accommodation.name}</h1>
                            </div>
                            <div className="details">
                                <img className="icon" src={locationIcon} /><a href={`https://maps.google.com/?q=${accommodation.city}${accommodation.street}`}><span className="location">{accommodation.city}, {accommodation.street}</span></a>
                                <img className="icon" src={phone} /><a href={`tel:${accommodation.contactNumber}`}><span className="mobile">{accommodation.contactNumber}</span></a>
                                <img className="icon" src={email} /><a href={`mailto:${accommodation.email}`}><span className="email">{accommodation.email}</span></a>
                                <img className="icon" src={web} /><a href={`${accommodation.website}`} rel="nofollow"><span className="web">{accommodation.website}</span></a>
                            </div>
                        </div>
                    </div>
                    <div className="accommodation-menu">
                        <div className="accommodation-menu-wrap">
                            <ul>
                                <li className="selected"><a href="#detalji">DETALJI</a></li>
                                <li><a href="#galerija">GALERIJA</a></li>
                                <li><a href="#sadrzaj">SADRŽAJ</a></li>
                                <li><a href="#recenzije">RECENZIJE</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="accommodation-single-content-holder">
                        <div className="accommodation-single-main-content">
                            <div id="detalji" className="accommodation-single-description-wrap">
                                <div className="accommodation-single-description-title">
                                    <h2>Opis</h2>
                                </div>
                                <div className="accommodation-single-description">
                                    <p>{accommodation.description}</p>
                                </div>
                            </div>

                            <div id="galerija" className="accommodation-single-description-wrap">
                                <div className="accommodation-single-description-title">
                                    <h2>Galerija</h2>
                                </div>
                                <div className="accommodation-single-description gallery-wrap">
                                    <div className="simple-gallery">
                                        <img src={`http://localhost:3001/${accommodation.gallery[currentPhotoIndex]}`}></img>
                                    </div>
                                    <div className="button scroll-left" onClick={() => changePhoto(0)}>
                                        {'<'}
                                    </div>
                                    <div className="button scroll-right" onClick={() => changePhoto(1)}>
                                        {'>'}
                                    </div>
                                </div>
                            </div>

                            <div id="sadrzaj" className="accommodation-single-description-wrap">
                                <div className="accommodation-single-description-title">
                                    <h2>Sadržaj</h2>
                                </div>
                                <div className="accommodation-single-description gallery-wrap">
                                    <div className="accommodation-content-holder">
                                        { accommodation?.content?.length ? 
                                            accommodation.content.map(category=>
                                                <div className="accommodation-content-element">
                                            <div className="accommodation-content-wrap">
                                            <div className="icon-preview">
                                                <img src={`http://localhost:3001/${category.categoryId.category_icon}`} />
                                            </div>
                                            <h2>{category.categoryId.category}</h2>
                                            </div>
                                                <div className="description-wrap">
                                            {category?.contentId?.length ?
                                            category.contentId.map(content=><div className="accommodation-single-description">
                                            <div className="accommodation-content-wrap">
                                                <p className="icon-text">✔ {content?.name}</p>
                                            </div>
                                         </div>
                                                )
                                            :<></>}
                                        </div></div>
                                                )
                                        : <></>

                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="sidebar-content">
                            <div className="ownedby">
                                <div className="details-wrap">
                                    <div className="icon-preview">
                                        <img src={`http://localhost:3001/${accommodation.ownedby_id.picture}`}></img>
                                    </div>
                                    <h3 style={{ width: '100%', textAlign: 'left' }}>{accommodation.ownedby_id.name} {accommodation.ownedby_id.surname}</h3>
                                    {auth?.user_id == accommodation.ownedby_id._id ? <></> : <span onClick={handleChat} style={{ marginRight: 20 }}>
                                        <Message height='32px' width='32px' color='#4db7fe'></Message></span>}
                                </div>
                                {showChat && auth?.user_id && !messageSent ?
                                    <div className="chat-wrap">
                                        <form>
                                            <div className="input full column">
                                                <textarea placeholder="Upišite svoju poruku ovdje..." className="text-area" id="message" value={message} onChange={e => setMessage(e.target.value)}></textarea >
                                            </div>
                                            <button onClick={sendMessage} style={{ width: '100%' }} className="login-button">Pošalji poruku</button>
                                        </form>
                                    </div>
                                    : showChat && !auth?.user_id ? <div className="chat-wrap">
                                        <p style={{textAlign:'center'}}>Morate biti prijavljeni kako bih poslali poruku</p>
                                        <button onClick={() => navigate('/prijava')} style={{ width: '100%' }} className="login-button">Prijavi se</button>
                                    </div> : <></>}
                                {messageSent ? <div className="chat-wrap">
                                    <p style={{ textAlign: "center" }}>Poruka uspješno poslana</p>
                                    <button onClick={() => navigate('/profil/razgovori')} style={{ width: '100%' }} className="login-button">Pogledaj razgovor</button>
                                </div>
                                    : <></>}
                            </div>
                            <div className="sidebar-map-wrap">
                                <MapContainer style={{ height: "100%" }} center={accommodation.location} zoom={ZOOM_LEVEL} scrollWheelZoom={false}>
                                    <TileLayer attribution={osm.maptiler.attribution} url={osm.maptiler.url} />
                                    <Marker
                                        key={accommodation}
                                        position={accommodation.location} //Za dodati s objekta
                                        icon={MapTestIcon}>
                                    </Marker>
                                </MapContainer>
                                <div className="sidebar-map-description info-container">
                                    <span className="description-item"><img className="icon" src={locationIcon} /><a href={`https://maps.google.com/?q=${accommodation.city}${accommodation.street}`}><span className="location">{accommodation.city}, {accommodation.street}</span></a></span>
                                    <span className="description-item"><img className="icon" src={phone} /><a href={`tel:${accommodation.contactNumber}`}><span className="mobile">{accommodation.contactNumber}</span></a></span>
                                    <span className="description-item"><img className="icon" src={email} /><a href={`mailto:${accommodation.email}`}><span className="email">{accommodation.email}</span></a></span>
                                    <span className="description-item"><img className="icon" src={web} /><a href={`${accommodation.website}`} rel="nofollow"><span className="web">{accommodation.website}</span></a></span>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
                : <p>
                    Greška pri učitavanju smještaja
                </p>
            }
        </>
    );

}

export default AccomodationSingle


