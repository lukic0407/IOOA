import { faImages } from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
import '../css/AddAccommodation.css'
import { useState, useEffect} from "react"

const AddAccomodationForm = () => {
    var FormData = require('form-data');
    const [thumbnail, setThumbnail] = useState([]);
    const [thumbnailURL, setThumbnailURL] = useState([]);
    const ACCOMMODATION_URL = '/accommodation';

    function onImageChange(e){
        setThumbnail([...e.target.files])
    }

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [tags, setTags] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [website, setWeb] = useState('');


    useEffect(()=>{
        if(thumbnail.length<1) return;
        const newImageUrl = [];
        thumbnail.forEach(image => newImageUrl.push(URL.createObjectURL(image)));
        setThumbnailURL(newImageUrl)
    },[thumbnail])

    const handleSubmit = async (e) => {
        e.preventDefault()
        var bodyFormData = new FormData();
        bodyFormData.append('name',name);
        bodyFormData.append('tags',tags)
        bodyFormData.append('street',street)
        bodyFormData.append('city',city)
        bodyFormData.append('email',email)
        bodyFormData.append('type',type)
        bodyFormData.append('contactNumber',contactNumber)
        bodyFormData.append('website',website)
        bodyFormData.append('images',thumbnail[0])
        console.log(thumbnail);
        try {
            const response = await axios.post(ACCOMMODATION_URL,
                bodyFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                      },
                      withCredentials: true
                    
                }
                
            );
            console.log(response.data)
            console.log(JSON.stringify(response))
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="add-accommodation">
            <form onSubmit={handleSubmit}>
                <div className="basic-info object-submit-wrap">
                    <div className="input full column">
                        <label htmlFor="name">Ime smještaja</label>
                        <input type="text" id="name" value={name} onChange={e=>setName(e.target.value)}></input>
                    </div>

                    <div className="input col-2">
                        <div className="item-50">
                            <label htmlFor="type">Tip smještaja</label>
                            <input type="text" id="type" value={type} onChange={e=>setType(e.target.value)}></input>
                        </div>
                        <div className="item-50 ">
                            <label htmlFor="tags">Oznake</label>
                            <input type="text" id="tags" value={tags} onChange={e=>setTags(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="input col-2">
                        <div className="item-50">
                            <label htmlFor="street">Ulica</label>
                            <input type="text" id="street" value={street} onChange={e=>setStreet(e.target.value)}></input>
                        </div>
                        <div className="item-50">
                            <label htmlFor="city">Grad</label>
                            <input type="text" id="city" value={city} onChange={e=>setCity(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="input col-3">
                        <div className="item-33">
                            <label htmlFor="email">E-mail adresa</label>
                            <input type="email" id="email" value={email} onChange={e=>setEmail(e.target.value)}></input>
                        </div>
                        <div className="item-33">
                            <label htmlFor="contactNumber">Kontakt Broj</label>
                            <input type="tel" id="contactNumber" value={contactNumber} onChange={e=>setContactNumber(e.target.value)}></input>
                        </div>
                        <div className="item-33">
                            <label htmlFor="email">Web Stranica</label>
                            <input type="tel" id="web" value={website} onChange={e=>setWeb(e.target.value)}></input>
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