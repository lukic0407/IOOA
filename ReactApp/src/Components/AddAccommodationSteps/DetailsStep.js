import { useEffect } from "react";
import '../../css/DetailsStep.css'
const DetailsStep = (props) => {
    const {
        faq,
        setFaq,
        workTime,
        setWorkTime,
        services,
        setServices,
        description,
        setDescription,
        currentStep,
        setCurrentStep
    } = props

    const handleStepUpdate = (e, value) => {
        e.preventDefault();
        let newStepValue = currentStep + (value)
        newStepValue >= 1 && newStepValue <= 5 && setCurrentStep(newStepValue);
        return false;
    }

    useEffect(()=>{
        console.log(services)
        console.log(services.nextID)
        console.log(services.list.length)
    },[])
    const addService = (e) =>{
        e.preventDefault();
        const nextId = services.nextID + 1;

        const newList = [
            ...services.list,{
                id: nextId, name:'' , price:''
            }
        ]
        setServices({list:newList,nextID:nextId})
    }

    const removeService = (e,id) =>{
        e.preventDefault();
        console.log(id);

        const filteredList = services.list.filter(list =>{
            return list.id != id;
        })
        setServices({...services,list:filteredList})
        console.log(services);
    }

    const handleServiceNameChange = (e,index) =>{
        const newList = services.list;
        newList[index].name = e.target.value;
        setServices({...services,list:newList});
    }

    const handleServicePriceChange = (e,index) =>{
        const newList = services.list;
        newList[index].price = e.target.value;
        setServices({...services,list:newList});
    }

    return (
        <>
            <div className="add-accommodation">
                <div className="basic-info object-submit-wrap">
                    <div className="input full column">
                        <label htmlFor="description">Opišite nam svoj smještaj</label>
                        <textarea className="text-area" id="description" value={description} onChange={e=>setDescription(e.target.value)}></textarea >
                    </div>
                    <div className="services-wrap">
                        <div className="Section-title">
                            <h3>Usluge:</h3>
                        </div>
                        {services?.list?.length ? 
                        (services.list.map((service,index)=>
                            <div className="input col-2">
                            <div className="item-50">
                                <label htmlFor="service-name">Naziv usluge:</label>
                                <input type="text" id="service-name" name="service" value={service.name} onChange={(e)=> handleServiceNameChange(e,index)}></input>
                            </div>
                            <div className="item-50 ">
                                <label htmlFor="service-price">Cijena:</label>
                                <input type="number" id="service-price" name="service-price" value={service.price} onChange={(e)=> handleServicePriceChange(e,index)}></input>
                            </div>
                            <button className="remove-service" onClick={(e)=>removeService(e,service.id)}>-</button>
                        </div>
                         ))
                        :<></>
                        }
                        <div className="add-button-wrap">
                        <button className="add-service" onClick={addService}>Dodaj novu uslugu</button>
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

export default DetailsStep