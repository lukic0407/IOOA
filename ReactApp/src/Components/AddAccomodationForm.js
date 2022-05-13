import useAxiosPrivate from "../hooks/useAxiosPrivate";
import '../css/AddAccommodation.css'
import { useState, useEffect, useRef, useMemo, useCallback} from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import osm from "../context/OsmProvider"
import 'leaflet/dist/leaflet.css';

const AddAccomodationForm = () => {
    const API_KEY = 'AIzaSyBdcwGjimzRU8a3JFIKgCSn15b0eH8j1Hg';
    const ZOOM_LEVEL = 13;
    var FormData = require('form-data');
    const axiosPrivate = useAxiosPrivate();
    const [thumbnail, setThumbnail] = useState([]);
    const [thumbnailURL, setThumbnailURL] = useState([]);
    const [centerpoint, setCenterPooint] = useState({ lat: 44.3021913, lng: 15.1120578 });
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [tags, setTags] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [website, setWeb] = useState('');
    const [types, setTypes] = useState('');

    var MapTestIcon = L.icon({
        iconUrl: require('../img/Icons/Map_Icon.png'),
        iconSize: [64, 64], // size of the icon
        iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -64] // point from which the popup should open relative to the iconAnchor
    });

    function onImageChange(e) {
        setThumbnail([...e.target.files])
    }

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
                //navigate('/',{state: {from: location}, replace:true});
                controller.abort();
            }
        }
        getAccommodation();
        return (() => {
            isMounted = false;
        })
    }, [])

    useEffect(() => {
        if (thumbnail.length < 1) return;
        const newImageUrl = [];
        thumbnail.forEach(image => newImageUrl.push(URL.createObjectURL(image)));
        setThumbnailURL(newImageUrl)
    }, [thumbnail])

    const [position, setPosition] = useState([centerpoint.lat, centerpoint.lng])
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setPosition(marker.getLatLng())
                }
            },
        }),
        [],
    )
    
    const debounce = (func) => {
        let timer;
        return function (...args) {
          const context = this;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            timer = null;
            func.apply(context, args);
          }, 1500);
        };
      };

    //Get geocode from address
    const geocode=(cityl,streetl)=>{
        cityl.city = cityl.city.replace(/ /g,'+');
        cityl.city += '+';
        streetl.street = streetl.street.replace(/ /g,'+');
        console.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityl.city}${streetl.street}&key=${API_KEY}`)
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityl.city}${streetl.street}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                console.log(data?.results[0]?.geometry?.location);
                data?.results[0]?.geometry?.location && setPosition(data?.results[0]?.geometry?.location);
            })
    }

    const optimizedFn = useCallback(debounce(geocode), []);

    useEffect(() => {
        optimizedFn({city},{street});
        setCenterPooint({position});
    },[city,street])

    //Slanje forme
    const handleSubmit = async (e) => {
        e.preventDefault()
        var bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('tags', tags)
        bodyFormData.append('street', street)
        bodyFormData.append('city', city)
        bodyFormData.append('email', email)
        bodyFormData.append('type', type)
        bodyFormData.append('contactNumber', contactNumber)
        bodyFormData.append('website', website)
        bodyFormData.append('images', thumbnail[0])
        bodyFormData.append('location', JSON.stringify(position))
        console.log(thumbnail);
        try {
            const response = await axiosPrivate.post('/accommodation',
                bodyFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true

                }
            );
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="add-accommodation">
            <form onSubmit={handleSubmit}>
                <div className="basic-info object-submit-wrap">
                    <div className="input full column">
                        <label htmlFor="name">Ime smještaja</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)}></input>
                    </div>

                    <div className="input col-2">
                        <div className="item-50">
                            <label htmlFor="type">Tip smještaja</label>
                            <select id="type" name="type" value={type} onChange={e => setType(e.target.value)}>
                                <option>Odaberite tip objekta</option>
                                {types?.length
                                    ? (types.map(type => <option value={type?.name}>{type?.name}</option>))
                                    : <option>Error, No types could be found</option>
                                }
                            </select>
                        </div>
                        <div className="item-50 ">
                            <label htmlFor="tags">Oznake</label>
                            <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="input col-2">
                        <div className="item-50">
                            <label htmlFor="street">Ulica</label>
                            <input type="text" id="street" value={street} onChange={e => setStreet(e.target.value)}></input>
                        </div>
                        <div className="item-50">
                            <label htmlFor="city">Grad</label>
                            <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)}></input>
                        </div>

                    </div>
                    
                    <div className="map-wrap" style={{height: '300px', margin: '10px' }}>
                        <MapContainer center={centerpoint} zoom={ZOOM_LEVEL} scrollWheelZoom={false}>
                            <TileLayer
                                attribution={osm.maptiler.attribution}
                                url={osm.maptiler.url}
                            />
                            <Marker
                                draggable={true}
                                eventHandlers={eventHandlers}
                                position={position}
                                ref={markerRef}
                                icon={MapTestIcon}>
                                <Popup minWidth={90}>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <div className="input col-2">
                        <div className="item-50">
                            <input type="hidden" id="lat" name="lat" value={position?.lat}></input>
                        </div>
                        <div className="item-50">
                            <input type="hidden" id="lng" name="lng" value={position?.lng}></input>
                        </div>
                    </div>
                    <div className="input col-3">
                        <div className="item-33">
                            <label htmlFor="email">E-mail adresa</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)}></input>
                        </div>
                        <div className="item-33">
                            <label htmlFor="contactNumber">Kontakt Broj</label>
                            <input type="tel" id="contactNumber" value={contactNumber} onChange={e => setContactNumber(e.target.value)}></input>
                        </div>
                        <div className="item-33">
                            <label htmlFor="email">Web Stranica</label>
                            <input type="tel" id="web" value={website} onChange={e => setWeb(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="input col-2">
                        <div className="item-50">
                            <label htmlFor="thumbnail">Thumbnail: </label>
                            <input type="file" accept="image/*" id="thumbnail" name="thumbnail" onChange={onImageChange}></input>
                        </div>
                        <div className="item-50">
                            <div className="thumbnail image-preview">
                                {thumbnailURL.map((imageSrc) => <img src={imageSrc}></img>)}
                            </div>
                        </div>
                    </div>
                </div>
                <button>Dodaj objekt</button>
            </form>
        </div>
    )

}

export default AddAccomodationForm