import { useEffect, useRef, useMemo, useCallback, useState } from "react"
import "../../css/MediaStep.css"
const MediaStep = (props) => {

    const {
        gallery,
        galleryURL,
        setGallery,
        setGalleryURL,
        thumbnail,
        thumbnailURL,
        setThumbnail,
        setThumbnailURL,
        handleStepUpdate,
        headerPhotos,
        headerPhotosURL,
        setHeaderPhotos,
        setHeaderPhotosURL
    } = props;

    const[hey,setHey] = useState(false);


    const changeThumbnail=(e,image_id) =>{
        e.preventDefault();
        if(thumbnailURL!=null){
            let currentThumbnail = document.getElementById(`${thumbnailURL}-t`);
            currentThumbnail.classList.remove("selected-thumbnail");
            currentThumbnail.innerHTML = "Postavi kao istaknutu"; 
            e.target.classList.add('selected-thumbnail');
            e.target.innerHTML = 'Istaknuta'
            setThumbnailURL(image_id);
            setThumbnail(gallery[image_id]);
        }else{
            e.target.classList.add('selected-thumbnail');
            e.target.innerHTML = 'Istaknuta'
            setThumbnail(gallery[image_id]);
            setThumbnailURL(image_id);
        }
        console.log(thumbnail);
    } 

    const addAsHeader=(e,image_id) =>{
        e.preventDefault();

        if(e.target.classList.contains('selected-header')){ 
            const newHeaderArray = headerPhotosURL.filter(imageurl => {
                if(imageurl!=String(image_id)){
                    return true;
                }else{
                    let element = document.getElementById(`${imageurl}-h`);
                    element.classList.remove('selected-header');
                    element.innerHTML = 'Postavi kao sliku naslovnice';
                }
             });
            newHeaderArray.forEach((imageurl,index)=>{
                let img = document.getElementById(`${imageurl}-h`);
                console.log(img);
                console.log(imageurl);
                img.innerHTML=`Istaknuta slika naslovnice (${index+1}/3)`
            })
            setHeaderPhotosURL(newHeaderArray);
        }else if(headerPhotosURL.length<3){
            let headerPhotoCounter = headerPhotosURL.length+1;
            e.target.innerHTML = `Istaknuta slika naslovnice (${headerPhotoCounter}/3)`;
            e.target.classList.add('selected-header');
            setHeaderPhotosURL([...headerPhotosURL,image_id]);
            setHeaderPhotos([...headerPhotos, gallery[image_id]])
        }
        console.log(headerPhotosURL);
        console.log(headerPhotos);
    } 

    useEffect(() => {
        if (headerPhotosURL.length<1) return;
        headerPhotosURL.forEach((imageurl,index)=>{
            let img = document.getElementById(`${imageurl}-h`);
            img.innerHTML=`Istaknuta slika naslovnice (${index+1}/3)`
            img.classList.add('selected-header');
        })
    }, [])

    useEffect(() => {
        if (thumbnailURL==null) return;
        const newImageUrl = [];
        let currentThumbnail = document.getElementById(`${thumbnailURL}-t`);
        currentThumbnail.classList.add("selected-thumbnail");
        currentThumbnail.innerHTML = "Istaknuta";
    }, [])

    function onImageChange(e) {
        setGallery([...e.target.files])
        setHey(true);
        //sve resetirat
    }

    useEffect(() => {
        if (gallery.length < 1) return;
        if(hey){
        const newImageUrl = [];
        gallery.forEach((image,index) => newImageUrl.push({src:URL.createObjectURL(image),id:index}));
        setGalleryURL({images:newImageUrl})    
        setHey(false);
        console.log(gallery);
        console.log(newImageUrl);
    }
    }, [gallery])

    return (
        <>
            <div className="basic-info object-submit-wrap">
            <div className="add-accommodation">
                    <h2 className='step-title'>Dodajte slike za vaš objekt</h2>
                    <div className="input full column">
                        <label htmlFor="gallery">Galerija: </label>
                        <input type="file" accept="image/*" id="gallery" name="gallery" onChange={onImageChange} multiple required></input>
                    </div>
                    <div className="input full column">
                        <div className="thumbnail image-preview">
                            
                            {galleryURL.images.map((item) => <div className="image-wrap">
                                <div className="set-as">
                                    <div className="thumbnail"><button id={`${item.id}-t`} onClick={(e) => changeThumbnail(e,item.id)}>Postavi kao istaknutu</button></div>
                                    <div className="highlight"><button id={`${item.id}-h`} onClick={(e) => addAsHeader(e,item.id)}>Postavi kao sliku naslovnice</button></div>
                                </div>
                                <img src={item.src}></img>
                                </div>)}
                            
                        </div>
                    </div>
                    <div className='step-wrap'>
                        <div className='change-steps'>
                            <div className='next'>
                                <button className='step-button' onClick={(e) => handleStepUpdate(e, -1)}>Prethodni korak</button>
                            </div>
                            {   gallery.length < 1 ?
                                <></>
                                : <div className='prev'>
                                <button className='step-button add' onClick={(e) => handleStepUpdate(e, 1)}>Dodaj Objekt</button>
                                </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default MediaStep;