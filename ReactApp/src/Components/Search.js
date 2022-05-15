import '../css/Search.css'
import React, { useRef } from "react";
import { useState, useEffect, useLayoutEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import locationIcon from '../img/Icons/Location-Icon.svg'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import osm from "../context/OsmProvider"

const Search = () => {
    const {category} = useParams();
    const ZOOM_LEVEL = 13;
    const [accommodation, setAccommodations] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [centerpoint, setCenterPooint] = useState({ lat: 44.3021913, lng: 15.1120578 });
    const navigate = useNavigate();
    const location = useLocation();
    const test_position = [44.298982, 15.1133578]
    const [types, setTypes] = useState('');
    const [filterType, setFilterType] = useState(0);
    const [selectedType, setSelectedType] = useState(0);

    var MapTestIcon = L.icon({
        iconUrl: require('../img/Icons/Map_Icon.png'),
        iconSize: [64, 64], // size of the icon
        iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -64] // point from which the popup should open relative to the iconAnchor
    });

    useEffect(()=>{
        console.log(category);
        if(category){
            setFilterType(category);
            setSelectedType(category);
        }
    },[])

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getAccommodation = async () => {
            try {
                const response = await axiosPrivate.get(`/types/accommodation/`, {
                    signal: controller.signal
                })
                console.log(response.data);
                isMounted && setTypes(response.data);
                controller.abort();
            } catch (error) {
                console.log(error);
                controller.abort();
            }
        }
        getAccommodation();
        return (() => {
            isMounted = false;
        })
    }, [])

    useEffect(() => {

        let isMounted = true;
        const controller = new AbortController();
        console.log(isMounted);
        const getUsers = async () => {
            console.log(isMounted);
            try {
                const response = await axiosPrivate.get('/accommodation/', {
                    signal: controller.signal
                })
                isMounted && setAccommodations(response.data);
            } catch (error) {
                console.log(error);
                controller.abort();
            }
        }
        getUsers();
        return () => {
            isMounted = false;
            controller.abort();
        }

    }, []);

    const handleSearch = () =>{
        setFilterType(selectedType);
    }

    return (
        <>
            <div className="search-wrap">
                <div className='listing-wrap'>
                    <div className='filter-wrap'>
                        <div className='search-filters'>
                            <div className='input search-filters col-3'>
                                <div className='item-33'>
                                    <select id="type" name="type" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                                        <option value={0}>Svi tipovi objekta</option>
                                        {types?.length
                                            ? (types.map(type => <option value={type?.name}>{type?.name}</option>))
                                            : <option>Error, No types could be found</option>
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='input'>
                                <button className='search-button filter' onClick={handleSearch}>Pretraga</button>
                            </div>
                    </div>

                    <div className="search-accommodation">
                        {accommodation?.length
                            ? (accommodation.map(accommodation => {
                                return filterType==0 ?
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
                                :
                                filterType==accommodation?.type ?
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
                            : <></>
                            
                        })
                            ) : <p>No Accomodations to display</p>
                        }
                    </div>
                </div>
                <div className="maps-wrap">
                    <MapContainer style={{ height: "100%" }} center={centerpoint} zoom={ZOOM_LEVEL} scrollWheelZoom={false}>
                        <TileLayer attribution={osm.maptiler.attribution} url={osm.maptiler.url} />
                        {accommodation?.length
                            ? (accommodation.map(accommodation => {
                                return accommodation?.location && typeof accommodation.location['lat'] !== "undefined"
                                    ?
                                    <Marker
                                        key={accommodation}
                                        position={test_position} //Za dodati s objekta
                                        icon={MapTestIcon}>
                                        <Popup minWidth={90}>
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
                                        </Popup>
                                    </Marker>
                                    : console.log("failde adding markers")
                            }))
                            : <></>
                        }

                    </MapContainer>
                </div>
            </div>
        </>
    )

}

export default Search;


