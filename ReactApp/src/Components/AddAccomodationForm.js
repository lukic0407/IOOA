import '../css/AddAccommodation.css'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import BasicStep from "./AddAccommodationSteps/BasicStep";
import { useState, useRef, useEffect } from "react"
import ProgressBar from './AddAccommodationSteps/ProgressBar';
import DetailsStep from './AddAccommodationSteps/DetailsStep';
import MediaStep from './AddAccommodationSteps/MediaStep';
import ContentStep from './AddAccommodationSteps/ContentStep';
import CompletedStep from './AddAccommodationSteps/CompletedStep';

const AddAccomodationForm = (props) => {
    //For edit mode
    const {
        e_id,
        e_mode,
        e_name,
        e_type,
        e_tags,
        e_street,
        e_city,
        e_email,
        e_contactNumber,
        e_website,
        e_position,
        e_services,
        e_description,
        e_accommodationContent,
        e_gallery,
        e_thumbnail,
        e_headerPhotos } = props
    useEffect(() => {
        if (e_mode) {
            setName(e_name);
            setType(e_type);
            setTags(e_tags);
            setStreet(e_street);
            setCity(e_city);
            setEmail(e_email);
            setContactNumber(e_contactNumber);
            setWeb(e_website);
            setPosition([e_position.lat, e_position.lng]);
            setDescription(e_description);
            //setAccommodationContent(e_accommodationContent);
            //setGallery(e_gallery);
            //setThumbnail(e_thumbnail);
            //setHeaderPhotos(e_headerPhotos);
            setAccommodationId(e_id);
        }
    }, [e_mode])
    //Global data
    var FormData = require('form-data');
    const axiosPrivate = useAxiosPrivate();
    const [currentStep, setCurrentStep] = useState(1);

    //Basic Info data
    const API_KEY_GMAPS = "AIzaSyAZm_3KFhjAD1rXQUULN98r2gP2AEtfC8s";
    const ZOOM_LEVEL = 13;
    const [accommodationId, setAccommodationId] = useState()
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
    //Details data
    const [description, setDescription] = useState('');
    //DINAMIČKI GENERIRANI FUN FACTS ???
    const [faq, setFaq] = useState({});
    const [workTime, setWorkTime] = useState({});
    const [services, setServices] = useState({ list: [], nextID: 0 });
    //Accommodation Content data
    const [accommodationContent, setAccommodationContent] = useState([]);

    //Media data
    const [gallery, setGallery] = useState([]);
    const [galleryURL, setGalleryURL] = useState({ images: [] });

    const [thumbnailURL, setThumbnailURL] = useState();
    const [headerPhotos, setHeaderPhotos] = useState([]);
    const [headerPhotosURL, setHeaderPhotosURL] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);

    const cleandata = () => {
        setName('');
        setType('');
        setTags('');
        setStreet('');
        setCity('');
        setEmail('');
        setWeb('');
        setTypes('');
        setPosition('');
        setDescription('');
        setServices('');
        setAccommodationContent('');
    }
    const handleStepUpdate = (e, value) => {
        e.preventDefault();
        let newStepValue = currentStep + (value)
        if (newStepValue == 5) {
            setCurrentStep(newStepValue);
            handleSubmit();
        } else {
            setCurrentStep(newStepValue);
        }
        return false;
    }

    //Slanje forme
    const handleSubmit = async () => {
        var bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('tags', tags);
        bodyFormData.append('street', street);
        bodyFormData.append('city', city);
        bodyFormData.append('email', email);
        bodyFormData.append('type', type);
        bodyFormData.append('contactNumber', contactNumber);
        bodyFormData.append('description', description);
        bodyFormData.append('website', website);
        bodyFormData.append('content', JSON.stringify(accommodationContent));
        bodyFormData.append('location', JSON.stringify(position));
        console.log(accommodationContent);

        for (let i = 0; i < gallery.length; i++) {
            bodyFormData.append('gallery', gallery[i]);
        }
        for (let i = 0; i < headerPhotos.length; i++) {
            bodyFormData.append('headerphotos', headerPhotos[i]);
        }
        bodyFormData.append('thumbnail', thumbnail);
        bodyFormData.append('services', JSON.stringify(services.list))


        var response;
        try {
            if (e_mode) {
                response = await axiosPrivate.patch(`/accommodation/byuser/${e_id}`,
                    bodyFormData,
                    {
                        withCredentials: true
                    }
                );
            } else {
                response = await axiosPrivate.post('/accommodation/',
                    bodyFormData,
                    {
                        withCredentials: true
                    }
                );
            }
            console.log(response.data)
            setCurrentStep(5);
            cleandata();
        } catch (error) {
            console.log(error)
        }
        bodyFormData = null;
    }

    const stepSwitch = (step) => {
        console.log(step)
        switch (step) {
            case 1:
                return <BasicStep
                    thumbnail={thumbnail}
                    //setThumbnail={setThumbnail}
                    //thumbnailURL={thumbnailURL}
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
                    handleStepUpdate={handleStepUpdate}
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
                    handleStepUpdate={handleStepUpdate}
                ></DetailsStep>
                break;
            case 3:
                return <ContentStep
                    accommodationContent={accommodationContent}
                    setAccommodationContent={setAccommodationContent}
                    handleStepUpdate={handleStepUpdate}
                ></ContentStep>
            case 4:
                return <MediaStep
                    handleSubmit={handleSubmit}
                    gallery={gallery}
                    galleryURL={galleryURL}
                    thumbnail={thumbnail}
                    thumbnailURL={thumbnailURL}
                    headerPhotos={headerPhotos}
                    headerPhotosURL={headerPhotosURL}
                    setThumbnail={setThumbnail}
                    setThumbnailURL={setThumbnailURL}
                    setGalleryURL={setGalleryURL}
                    setGallery={setGallery}
                    handleStepUpdate={handleStepUpdate}
                    setHeaderPhotos={setHeaderPhotos}
                    setHeaderPhotosURL={setHeaderPhotosURL}
                ></MediaStep>
                break;
            case 5:
                return <CompletedStep>

                </CompletedStep>
            default:
                return "Error loading Form"
                break;
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <ProgressBar currentStep={currentStep}></ProgressBar>
            {stepSwitch(currentStep)}
        </form>
    )

}

export default AddAccomodationForm