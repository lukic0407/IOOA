import { useEffect, useState } from "react";
import '../../css/ContentStep.css'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import RenderContent from "./RenderContent";
const ContentStep = (props) => {
    const {
        accommodationContent,
        setAccommodationContent,
        handleStepUpdate
    } = props

    const [content, setConent] = useState();
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAccommodationContent = async () => {
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

        getAccommodationContent();

        return () => {
            isMounted = false;
        }
    }, []);

    const handleContentUpdate = (e) =>{
        console.log()
        if(e.target.checked){
            var Index;
            accommodationContent.forEach((element,index) => {
                if (element.categoryId == e.target.getAttribute('categoryId')) Index = index;
            });
            console.log(Index);
            if(Index!=undefined){
                var modifyArray = accommodationContent;
                modifyArray[Index].contentId.push(e.target.value);
                const newAccommodationContentArray = modifyArray;
                setAccommodationContent(newAccommodationContentArray);
                console.log(newAccommodationContentArray);
                console.log(modifyArray);
            }else{
                setAccommodationContent([...accommodationContent, {categoryId:e.target.getAttribute('categoryId'),contentId:[e.target.value]}]);
            }
            
            
        }else{
            var categoryIndex;
            var contentIndex;
            accommodationContent.forEach((element,index) => {
                if (element.categoryId == e.target.getAttribute('categoryId')) categoryIndex = index;
            });
            accommodationContent[categoryIndex].contentId.forEach((element,index)=>{
                if (element.contentId == e.target.value) contentIndex = index;
            })

            var modifyArray = accommodationContent;
            modifyArray[categoryIndex].contentId.splice(contentIndex,1);
            if(modifyArray[categoryIndex].contentId.length == 0){
                modifyArray.splice(categoryIndex,1);
            }
            setAccommodationContent(modifyArray);
            console.log(modifyArray);
        }   
        console.log(accommodationContent);
    }

    return (
        <>
            <div className="add-accommodation">
                <div className="basic-info object-submit-wrap">
                <h2 className='step-title'>Dodajte sadržaj svog objekta</h2>
                    <div>
                        <div>
                            {content?.length
                                ? (content.map(content => <>
                                    <div className="space-between accommodation-single-description-wrap">
                                        <div className="accommodation-single-description-title accommodation-content-wrap">
                                            <div className="icon-preview">
                                                <img src={`http://localhost:3001/${content.category_icon}`} />
                                            </div>
                                            <h2>{content.category}</h2>
                                        </div>
                                        <div className="content-holder">
                                            {content?.content?.length
                                                ? <RenderContent contentCategoyId={content._id} 
                                                handleContentUpdate= {handleContentUpdate} 
                                                contentRender={content.content}
                                                ></RenderContent>
                                                : <></>
                                            }
                                        </div>
                                    </div>
                                </>
                                )
                                ) : <p>No Accommodation Content to display</p>
                            }

                        </div>
                    </div>
                    <div className='step-wrap'>
                        <div className='change-steps'>
                            <div className='next'>
                                <button className='step-button' onClick={(e) => handleStepUpdate(e, -1)}>Prethodni korak</button>
                            </div>
                            <div className='prev'>
                                <button className='step-button' onClick={(e) => handleStepUpdate(e, 1)}>Sljedeći korak</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ContentStep