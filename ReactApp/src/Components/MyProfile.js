import { useEffect, useState } from 'react'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import '../css/MyProfile.css'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const MyProfile = () => {

    const { auth } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassowrd, setConfirmPassword] = useState('');
    const [currentpassword, setCurrentPassword] = useState('');
    const [basicStatusMsg, setBasicStatusMsg] = useState('');
    const [passwordStatusMsg, setPasswordStatusMsg] = useState('');

    const [validPassword, setValidPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)

    const [validConfirmPassword, setValidConfirmPassword] = useState(false)
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false)

    const [userFocus, setUserFocus] = useState(false)

    const axiosPrivate = useAxiosPrivate();

    const handleAccountChanges = (e) => {
        e.preventDefault();
        const updateBasicUserData = async () => {
            try {
                const response = await axiosPrivate.patch('/user/userdata/update',
                    JSON.stringify({ name: firstName, email: email, surname: lastName }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
                setBasicStatusMsg('Uspješno ažurirano')
            } catch (error) {
                console.log(error.response);
                setBasicStatusMsg('Greška pri ažuriranju')
            }
        }
        updateBasicUserData();
    }

    const handlePasswordChange = (e) => {
        e.preventDefault();
        const check = PWD_REGEX.test(password)
        if (!check) {
            setPasswordStatusMsg('Nova lozinka ne zadovoljava pravila')
            return
        }
        const updateUserPassword = async () => {
            try {
                const response = await axiosPrivate.patch('/user/userdata/changepassword',
                    JSON.stringify({ currentpassword: currentpassword, newpassword: password }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
                setPasswordStatusMsg('Uspješno ažurirano')
            } catch (error) {
                if (!error?.response) {
                    setPasswordStatusMsg('No Server Response');
                } else {
                    console.log(error)
                }
                setPasswordStatusMsg(error.response.data.message)
                console.log(error.response.data);
            }
        }
        updateUserPassword();
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUserBasicData = async () => {
            try {
                const response = await axiosPrivate.get(`/user/userdata/${auth.user_id}`, {
                    signal: controller.signal
                })
                setFirstName(response.data.name);
                setLastName(response.data.surname);
                setEmail(response.data.email);
            } catch (error) {
                console.log(error);
                controller.abort();
            }
        }
        getUserBasicData();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    useEffect(() => {
        const check = PWD_REGEX.test(password)
        const isMatched = password === confirmPassowrd
        setValidPassword(check)
        setValidConfirmPassword(isMatched)
    }, [password, confirmPassowrd])


    useEffect(() => {
        setPasswordStatusMsg('')
    }, [password, confirmPassowrd])

    return (
        <>
            <div className="add-accommodation">
                <div className="my-profile basic-info object-submit-wrap">
                    <h2 className='step-title'>Uredite svoj profil</h2>
                    <form onSubmit={handleAccountChanges}>
                        <div className="input col-2">
                            <div className="item-50 ">
                                <label htmlFor="name">Ime:</label>
                                <input type="text" id="name" value={firstName} onChange={e => setFirstName(e.target.value)} required></input>
                            </div>
                            <div className="item-50 ">
                                <label htmlFor="surname">Prezime:</label>
                                <input type="text" id="surname" value={lastName} onChange={e => setLastName(e.target.value)} required></input>
                            </div>

                        </div>
                        <div className="input full column">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required></input>
                        </div>
                        <p>{basicStatusMsg}</p>
                        <button type='submit' className='login-button'>Spremi Promjene</button>
                    </form>
                    <form onSubmit={handlePasswordChange}>
                        <h3 style={{ textAlign: 'left' }} className='step-title'>Izmijeni lozinku</h3>
                        <div className="input full column">
                            <label htmlFor="currentpassword">Trenutna lozinka:</label>
                            <input type="password" id="currentpassword" value={currentpassword} onChange={e => setCurrentPassword(e.target.value)} required></input>
                        </div>
                        <div className="input col-2">

                            <div className="item-50 ">
                                <label htmlFor="password">Lozinka:
                                    <span className={validPassword ? "valid" : "hide"}>
                                        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                                    </span>
                                    <span className={validPassword || !password ? "hide" : "invalid"}>
                                        <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                                    </span>
                                </label>
                                <input onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)} type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required></input>
                                <div id="passwordnote" className={`animate500 ${passwordFocus && !validPassword ? 'tooltip' : 'hidetooltip'}`}>
                                    <p >
                                        <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                                          8 do 24 znakova <br />
                                        Lozinka mora sadržavati veliko i malo slovo, broj i specijalni znak <br />
                                        Dopušteni specijalni znakovi su sljedeći (@,#,$,%)
                                    </p>
                                </div>
                            </div>
                            <div className="item-50 ">
                                <label htmlFor="confirmPassowrd">Potvrdi lozinku:
                                    <span className={validConfirmPassword && confirmPassowrd ? "valid" : "hide"}>
                                        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                                    </span>
                                    <span className={validConfirmPassword || !confirmPassowrd ? "hide" : "invalid"}>
                                        <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                                    </span>
                                </label>
                                <input onFocus={() => setConfirmPasswordFocus(true)} onBlur={() => setConfirmPasswordFocus(false)} type="password" id="confirmPassowrd" value={confirmPassowrd} onChange={e => setConfirmPassword(e.target.value)} required></input>
                                <div id="matchpasswordnote" className={`animate500 ${confirmPasswordFocus && !validConfirmPassword ? 'tooltip' : 'hidetooltip'}`}>
                                    <p >
                                        <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                                        Lozinka se mora poklapati sa lozinkom unesenom pored
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p>{passwordStatusMsg}</p>
                        <button type='submit' className='login-button'>Izmijeni Lozinku</button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default MyProfile