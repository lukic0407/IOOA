import '../css/AddAccommodation.css'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import BasicStep from "./AddAccommodationSteps/BasicStep";
import { useState } from "react"
import ProgressBar from './AddAccommodationSteps/ProgressBar';
import DetailsStep from './AddAccommodationSteps/DetailsStep';


const AddAccomodationForm = () => {

    //Global data
    var FormData = require('form-data');
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);

    //Basic Info data
    const API_KEY_GMAPS = "AIzaSyAZm_3KFhjAD1rXQUULN98r2gP2AEtfC8s";
    const ZOOM_LEVEL = 13;
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
    const [position, setPosition] = useState([centerpoint.lat, centerpoint.lng])

    //Deatils data
    const [description, setDescription] = useState('');
    //DINAMIČKI GENERIRANI FUN FACTS ???
    const [faq, setFaq] = useState({});
    const [workTime, setWorkTime] = useState({});
    const [services, setServices] = useState({list:[],nextID:0});






    //Slanje forme
    const handleSubmit = async (e) => {
        e.preventDefault()
        var bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('user_id', auth.user_id);
        bodyFormData.append('tags', tags);
        bodyFormData.append('street', street);
        bodyFormData.append('city', city);
        bodyFormData.append('email', email);
        bodyFormData.append('type', type);
        bodyFormData.append('contactNumber', contactNumber);
        bodyFormData.append('website', website);
        bodyFormData.append('images', thumbnail[0]);
        bodyFormData.append('location', JSON.stringify(position));
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

    const stepSwitch = (step) => {
        console.log(step)
        switch (step) {
            case 1:
                return <BasicStep
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
                thumbnailURL={thumbnailURL}
                setThumbnailURL={setThumbnailURL}
                centerpoint={centerpoint}
                setCenterPooint={setCenterPooint}
                name={name}
                setName={setName}
                type={type}
                setType={setType}
                tags={tags}
                setTags={setTags}
                street={street}
                setStreet={setStreet}
                city={city}
                setCity={setCity}
                email={email}
                setEmail={setEmail}
                contactNumber={contactNumber}
                setContactNumber={setContactNumber}
                website={website}
                setWeb={setWeb}
                types={types}
                setTypes={setTypes}
                API_KEY_GMAPS={API_KEY_GMAPS}
                ZOOM_LEVEL={ZOOM_LEVEL}
                position={position}
                setPosition={setPosition}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
            ></BasicStep>
                break;
            case 2:
                return <DetailsStep
                faq={faq}
                setFaq={setFaq}
                workTime={workTime}
                setWorkTime={setWorkTime}
                services={services}
                setServices={setServices}
                description={description}
                setDescription={setDescription}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
            ></DetailsStep>
                break;
            default:
                return "Error loading Form"
                break;
        }
    }

    return (
        <form>
            <ProgressBar currentStep={currentStep}></ProgressBar>
            {stepSwitch(currentStep)}
        </form>
    )

}

export default AddAccomodationForm