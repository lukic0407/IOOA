import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import locationIcon from '../img/Icons/Location-Icon.svg'
import '../css/Dashboard.css'
import AddAccomodationForm from "./AddAccomodationForm";

const Dashboard = () => {
    

    const [accommodation, setAccommodation] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [toEraseAccommodationName, setToEraseAccommodationName] = useState('');
    const [refID, setRefID] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const [iseditMode, setEditMode] = useState(false);
    const [editAccommodation, setEditAccommodation] = useState()

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUserAccommodation = async () => {
            try {
                const response = await axiosPrivate.get(`/accommodation/byuser/all`, {
                    signal: controller.signal},
                    {   headers: {'Content-Type':'application/json'},
                    withCredentials: true
                }
                )
                isMounted && setAccommodation(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error);
                controller.abort();
            }
        }
        getUserAccommodation();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    const getEditAccommodation = async (id) => {
        const controller = new AbortController();
        try {
            const response = await axiosPrivate.get(`/accommodation/${id}`, {
                signal: controller.signal
            })
            console.log(response.data);
            setEditAccommodation(response.data);
            setEditMode(true);
            controller.abort();
        } catch (error) {
            console.log(error);
            controller.abort();
        }
    }

    const handleDelete = (name,acc_id) => {
        setToEraseAccommodationName(name);
        setShowModal(true);
        setRefID(acc_id);
    }

    const editMode = (id) =>{
        console.log(id)
        getEditAccommodation(String(id));


    }

    async function handleAccommodationDelete (accommodation_id){
        try {
            const response = await axiosPrivate.delete(`/accommodation/byuser/${accommodation_id}`,
                {},
                {   headers: {'Content-Type':'application/json'},
                    withCredentials: true
                }
            );
            setShowModal(false);
            const newArray = accommodation.filter(acc => acc._id != accommodation_id);
            setAccommodation(newArray);
            setToEraseAccommodationName('');
            
            setRefID('');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="dashboard-wrap">
                <h2>Moji Objekti</h2>
                <div className="dashborad-accommodation-wrap">
                    {accommodation?.length && !iseditMode
                        ? (accommodation.map(accommodation =>
                            <div className="accommodation-wrap">
                                    <div className="accommodation-thumbnail">
                                        <div className="options">
                                            <button className="edit" onClick={() => editMode(accommodation?._id)}>Uredi</button>
                                            <button className="delete" onClick={()=>handleDelete(accommodation?.name, accommodation?._id)}>Izbriši</button>
                                        </div>
                                        <Link to={`/smjestaj/${accommodation?._id}`}>
                                        <div className="thumbnail-holder">
                                            <img src={`http://localhost:3001/${accommodation?.thumbnail}`}></img>
                                        </div>
                                        <div className="accommodation-description">
                                            <h3>{accommodation?.name}</h3>
                                            <img className="icon" src={locationIcon} /><span className="location">{accommodation?.city}, {accommodation?.street}</span>
                                            <hr></hr>
                                            <div className="accommodation-description-bottom">
                                                <span className="accommodation-type left">{accommodation?.type}</span>
                                            </div>
                                        </div>
                                        </Link>
                                    </div>
                            </div>
                        )
                        ) : editAccommodation ?<AddAccomodationForm
                        e_id={editAccommodation._id}
                        e_mode={iseditMode}
                        e_name={editAccommodation.name}
                        e_type={editAccommodation.type}
                        e_tags={editAccommodation.tags}
                        e_street={editAccommodation.street}
                        e_city={editAccommodation.city}
                        e_email={editAccommodation.email}
                        e_contactNumber={editAccommodation.contactNumber}
                        e_website={editAccommodation.website}
                        e_position={JSON.parse(editAccommodation.location)}
                        e_services={editAccommodation.services}
                        e_description={editAccommodation.description}
                        e_accommodationContent={editAccommodation.content}
                        e_gallery={editAccommodation.gallery}
                        e_thumbnail={editAccommodation.thumbnail}
                        e_headerPhotos={editAccommodation.headerphotos}
                        ></AddAccomodationForm> : <></>
                    }
                </div>
            </div>
            {showModal ? <>
            <div className="modal-overlay"></div>
                <div className={"modal-wrap"}>
                    <div className="modal">
                        <h3>Jeste li sigurni da želite izbrisati <br/>{toEraseAccommodationName}</h3>
                        <div className="button-wrap">
                            <button className="yes-button" onClick={()=>handleAccommodationDelete(refID)}>Da</button>
                            <button className="no-button" onClick={()=>setShowModal(false)}>Ne</button>
                        </div>
                    </div>
                </div> </>: <></>}
        </>
    )

}

export default Dashboard;