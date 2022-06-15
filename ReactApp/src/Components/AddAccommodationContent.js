import React, { useEffect, useState, useRef } from "react";
import { faXmark} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import '../css/AdminContentEditor.css'
const AddAccommodationContent = () => {
    const axiosPrivate = useAxiosPrivate();
    const newCategoryRef = useRef();
    const categoryRef = useRef();
    const nameRef = useRef();
    const iconRef = useRef();
    const [content, setConent] = useState();
    const [newContentName, setNewContentName] = useState();
    const [newContentCategory, setNewContentCategory] = useState();
    const [currentContentCategory, setCurrentContentCategory] = useState();
    const [newContentIcon, setNewContentIcon] = useState();
    const [newContentURL, setNewContentURL] = useState();
    const [showModal, setShowModal] = useState(false);
    const [addCategories, setaddCategories] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [statusMsg, setstatusMsg] = useState('');
    const [editMode, setEditMode] = useState(false);

    const cleanup = () =>{
        setRefresh(!refresh);
        setNewContentName('');
        setNewContentCategory('');
        setNewContentIcon('');
        setNewContentURL('');
        setstatusMsg('');
    }

    const handleSubmitContent = async (e) => {
        e.preventDefault()
        
        function checkValidInput(){
            if(!newContentName){
                setstatusMsg('Molimo unesite ime sadrzaja');
                nameRef.current.focus();
            }else if(!currentContentCategory){
                setstatusMsg('Molimo odaberite kategoriju sadrzaja');
                categoryRef.current.focus();
            }else{
                return true;
            }
            return false;
        }
        checkValidInput() && cleanup();
        var bodyFormData = new FormData();
        bodyFormData.append('name', newContentName);
        bodyFormData.append('category_id', currentContentCategory);
        try {
            const response = await axiosPrivate.post('/accommodation/content/',
                bodyFormData,
                {
                    withCredentials: true
                }
            );     
            console.log(response.data);
            setstatusMsg('Sadržaj uspješno dodan');
        } catch (error) {
            console.log(error);
        }
        bodyFormData = null;
    }

    const handleSubmitContentCategory = async (e) => {
        e.preventDefault()
        
        function checkValidInput(){
            if(!newContentCategory){
                setstatusMsg('Molimo unesite ime kategorije');
                newCategoryRef.current.focus();
            }else if(!newContentIcon){
                setstatusMsg('Molimo dodajte ikonu sadrzaja');
                iconRef.current.focus();
            }else{
                return true;
            }
            return false;
        }
        checkValidInput() && cleanup();
        var bodyFormData = new FormData();
        bodyFormData.append('new_category', newContentCategory);
        bodyFormData.append('icon', newContentIcon);
        try {
            const response = await axiosPrivate.post('/accommodation/content',
                bodyFormData,
                {
                    withCredentials: true
                }
            );
            console.log(response.data);
            setstatusMsg('Kategorija uspješno dodana');
        } catch (error) {
            console.log(error);
        }
        bodyFormData = null;
    }

    const addIcon = async (e) => {
        e.preventDefault()
        document.getElementById('content-icon').click();
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAccommodationContentCategories = async () => {
            try {
                const response = await axiosPrivate.get('/accommodation/content/all', {
                    signal: controller.signal
                })
                console.log(response.data);
                isMounted && setConent(response.data);
                controller.abort();
            } catch (error) {
                console.log(error);
                controller.abort();
            }
        }

        getAccommodationContentCategories();

        return () => {
            isMounted = false;
        }
    }, [refresh]);

    useEffect(() => {
        if(newContentIcon){
        const newImageUrl = URL.createObjectURL(newContentIcon);
        setNewContentURL(newImageUrl);
        }
    }, [newContentIcon])

    const handleDelete = (id) =>{
        const deleteAccommodationContent = async () => {
            try {
                const response = await axiosPrivate.delete(`/accommodation/content/${id}`, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                console.log(response.data);
                setRefresh(!refresh);
            } catch (error) {
                console.log(error);
            }
        }

        deleteAccommodationContent();

    }

    const handleCategoryDelete = (id) =>{
        const deleteAccommodationContent = async () => {
            try {
                const response = await axiosPrivate.delete(`/accommodation/content/category/${id}`, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                console.log(response.data);
                setRefresh(!refresh);
            } catch (error) {
                console.log(error);
            }
        }

        deleteAccommodationContent();

    }

    return (
        <>
            <div className="header-add-accommodation-content">
            <button style={{marginRight:15}} onClick={()=>setEditMode(!editMode)} className="login-button">Uredi Sadržaj</button>
                <button onClick={()=>setShowModal(true)} className="login-button">Dodaj Sadržaj</button>
            </div>
            <div>
                <div>
                        {content?.length
                            ? (content.map(content => <>
                            <div className="space-between accommodation-single-description-wrap">
                                <div className="accommodation-single-description-title accommodation-content-wrap">
                                    {editMode ?<span onClick={(e) => handleCategoryDelete(content._id)} className="delete-sign left"><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></span> : <></>}
                                    <div className="icon-preview">
                                        <img src={`http://localhost:3001/${content.category_icon}`}/>
                                    </div>
                                    <h2>{content.category}</h2>
                                </div>
                                <div className="content-holder">
                                {content?.content?.length
                                    ? (content.content.map(content => <>
                                    <div className="accommodation-single-description">
                                        <div className="accommodation-content-wrap">
                                           {editMode ?<span onClick={(e) => handleDelete(content._id)} className="delete-sign"><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></span> : <></>} 
                                            <p className="icon-text">✔ {content.name}</p>
                                        </div>
                                     </div>
                                    </>
                                    )): <></>
                                }
                                </div>
                            </div>
                                </>
                            )
                            ) : <p>No Accommodation Content to display</p>
                        }
                    
                </div>
            </div>
            {showModal ? <>
            <div className="modal-overlay">
                <div className="modal-wrap add-content">
                <div className="modal">
                {addCategories ? <>
                <div className="modal-content-title">
                    <div className="add-category-button-return">
                    <button onClick={() => {setaddCategories(false); setstatusMsg(''); }} className="login-button" type="submit">Povratak</button>
                    </div>
                    <div className="add-category-title">
                    <h3>Dodavanje Kategorije</h3>
                    </div>
                </div>
                <form>
                <div className="input full-column">
                <label htmlFor="accommodation-content-name">Naziv kategorije sadrzaja*:</label>
                <input ref={newCategoryRef} type="text" id="new-category-content-name" name="new-category-content-name" value={newContentCategory} onChange={(e) => setNewContentCategory(e.target.value)} required></input>
                </div>

                <div className="input full-column add-content-icon">
                <label htmlFor="accommodation-content-icon">Ikona sadrzaja*:</label>
                <div className="add-content-icon-preview">
                <button onClick={addIcon} className="login-button">Dodaj Ikonu</button>
                <input ref={iconRef} className="hide" type="file" accept="image/*" id="content-icon" name="content-icon" onChange={(e) => setNewContentIcon(e.target.files[0])} required></input>

                    {newContentURL ?
                    <div className="icon-preview">
                        <img src={newContentURL}></img>
                    </div>
                :<></>
                }
                </div>
                </div>
                <p className={statusMsg ? 'status' : 'hide'} aria-live='assertive'>{statusMsg}</p>
                <button onClick={handleSubmitContentCategory} className="login-button" type="submit">Dodaj</button>
                <button onClick={()=>{setShowModal(false); setstatusMsg(''); setRefresh(!refresh);}} className="login-button no-button" type="submit">Odustani</button>
                </form>
                </>
                : <>
                <div className="modal-content-title">
                <div className="add-category-button">
                    <button onClick={() => setaddCategories(true)} className="login-button" type="submit">Dodaj Kategoriju</button>
                    </div>
                    <div className="add-category-title">
                    <h3>Dodavanje Sadrzaja </h3>
                    </div>
                </div>
                <form>
                <div className="input full-column">
                <label htmlFor="accommodation-content-name">Kategorija sadrzaja*:</label>
                <select ref={categoryRef} id="content-category-name" name="content-category" value={currentContentCategory} onChange={(e) => setCurrentContentCategory(e.target.value)} required>
                <option value=''>Odaberite Kategoriju</option>
                {content?.length ?
                (content.map(content => <option value={content?._id}>{content?.category}</option> ))
                : <option>Nije pronađena niti jedna kategorija, molimo dodajte kategoriju</option>
                }
                </select>
                </div>
                <div className="input full-column">
                <label htmlFor="accommodation-content-name">Naziv sadrzaja*:</label>
                <input ref={nameRef} type="text" id="content-name" name="content-name" value={newContentName} onChange={(e) => setNewContentName(e.target.value)} required></input>
                </div>
                <p className={statusMsg ? 'status' : 'hide'} aria-live='assertive'>{statusMsg}</p>
                <button onClick={handleSubmitContent} className="login-button" type="submit">Dodaj</button>
                <button onClick={()=>{setShowModal(false); setstatusMsg(''); setRefresh(!refresh);}} className="login-button no-button" type="submit">Odustani</button>
                </form></>
                }
                </div>
                </div>
            </div>
            </>
            :<></>
            }
        </>
    )
}

export default AddAccommodationContent