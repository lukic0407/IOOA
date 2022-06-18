
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Animator from "../../Animations/Animator";
import successAnimation from '../../Animations/success.json';
const CompletedStep = (props) => {
    const navigate = useNavigate();
    const [single, setSingle] = useState(true);
    useEffect(()=>{

    },[])

    return (
        <>
            <div className="add-accommodation">
                <div className="basic-info object-submit-wrap">
                    <h2 className='step-title'>Uspješno ste dodali svoj objekt</h2>
                    <div className='step-wrap'>
                        <div style={{justifyContent:'space-around'}}className='change-steps'>
                            <div>
                                <div style={{marginBottom :50}}><Animator loop='false' animation={successAnimation}></Animator></div>
                                <button className='fade-in-button step-button' onClick={()=>navigate('/')}>Povratak na naslovnu</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CompletedStep