import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import locationIcon from '../img/Icons/Location-Icon.svg'
import '../css/Dashboard.css'

const dashboard = () => {
    
    const { auth } = useAuth();
    const [accommodation, setAccommodation] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [toEraseAccommodationName, setToEraseAccommodationName] = useState('');
    const [refID, setRefID] = useState('');
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`/accommodation/byuser/${auth.user_id}`, {
                    signal: controller.signal},
                    {   headers: {'Content-Type':'application/json'},
                    withCredentials: true
                }
                )
                isMounted && setAccommodation(response.data);
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
    }, [])

    const handleDelete = (name,acc_id) => {
        setToEraseAccommodationName(name);
        setShowModal(true);
        setRefID(acc_id);
    }

    async function handleAccommodationDelete (accommodation_id){
        try {
            const response = await axiosPrivate.delete(`/accommodation/byuser/${auth.user_id}/${accommodation_id}`,
                {},
                {   headers: {'Content-Type':'application/json'},
                    withCredentials: true
                }
            );
            setShowModal(false);
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
                    {accommodation?.length
                        ? (accommodation.map(accommodation =>
                            <div className="accommodation-wrap">
                                
                                    <div className="accommodation-thumbnail">
                                        <div className="options">
                                            <button className="edit">Uredi</button>
                                            <button className="delete" onClick={()=>handleDelete(accommodation?.name, accommodation?._id)}>Izbriši</button>
                                        </div>
                                        <Link to={`/smjestaj/${accommodation?._id}`}>
                                        <div className="thumbnail-holder">
                                            <img src={`http://localhost:3001/${accommodation?.images_single}`}></img>
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
                        ) : <p>No Accomodations to display</p>
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

export default dashboard;