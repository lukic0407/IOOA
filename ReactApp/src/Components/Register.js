import { useRef, useState, useEffect } from "react"
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate} from 'react-router-dom'
import Animator from "../Animations/Animator";
import successAnimation from '../Animations/success.json';
import axios from '../api/axios'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/auth/register';

const Register = () => {
    const navigate = useNavigate();

    const userRef = useRef()
    const errRef = useRef()
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [user, setUser] = useState('')
    const [validName, setValidName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)

    const [matchPassword, setMatchPassword] = useState('')
    const [validMatchPassword, setValidMatchPassword] = useState(false)
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)


    useEffect(() => {
        //userRef.current.focus()
    }, [])

    useEffect(() => {
        const check = USER_REGEX.test(user)
        setValidName(check)
    }, [user])


    useEffect(() => {
        const check = PWD_REGEX.test(password)
        const isMatched = password === matchPassword
        setValidPassword(check)
        setValidMatchPassword(isMatched)
    }, [password, matchPassword])


    useEffect(() => {
        setErrMsg('')
    }, [user, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault()
        //If ByPass Attempted
        const val_01 = USER_REGEX.test(user)
        const val_02 = PWD_REGEX.test(password)
        if (!val_01 || !val_02) {
            setErrMsg('Invalid Entry')
            return
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ name: firstName, surname: lastName, username: user, email: 'test@gmail.com', password: password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data)
            console.log(JSON.stringify(response))
            setSuccess(true)
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 409) {
                setErrMsg('Username Taken')
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus()
            console.log(error)
        }
    }

    return (
        <>
            <div className="hero-background">
                <h1 className="login-title">Registracija
                    <hr className="hero-divider"></hr>
                </h1>
            </div>
            {
                success ? (
                    <section>
                        <div style={{marginLeft:'auto', marginRight:'auto', marginBottom: 50 ,width: 300,marginTop: 50}}><Animator loop='false' animation={successAnimation}></Animator></div>
                        <div><button onClick={()=>navigate('/prijava')} className="login-button fade-in-button">Prijavi se</button></div>

                    </section>
                ) : (<>

                    <section className="login-wrap" >
                        <p ref={errRef} className={errMsg ? 'error' : 'hide'} aria-live='assertive'>{errMsg}</p>
                        <form className="login-form" onSubmit={handleSubmit}>
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
                            {/*Username Field Input*/}
                            <label htmlFor="username">Korisničko ime:
                                <span className={validName ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                                </span>
                                <span className={validName || !user ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                                </span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete='off'
                                onChange={e => { setUser(e.target.value) }}
                                required
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                value={user}
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                            />
                            <div id="uidnote" className={`animate500 ${userFocus && user && !validName ? 'tooltip' : 'hidetooltip'}`}>
                                <p >
                                    <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                                    4 do 24 znaka <br />
                                    Korisničko ime mora započeti sa slovom. <br />
                                    Slova, brojevi i znakovi su dopušteni.
                                </p>
                            </div>

                            {/*Password Field Input*/}
                            <label htmlFor="password">Lozinka:
                                <span className={validPassword ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                                </span>
                                <span className={validPassword || !password ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                                </span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={e => { setPassword(e.target.value) }}
                                required
                                aria-invalid={validPassword ? "false" : "true"}
                                aria-describedby="passwordnote"
                                value={password}
                                onFocus={() => setPasswordFocus(true)}
                                onBlur={() => setPasswordFocus(false)}
                            />
                            <div id="passwordnote" className={`animate500 ${passwordFocus && !validPassword ? 'tooltip' : 'hidetooltip'}`}>
                                <p >
                                    <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                                    8 do 24 znakova <br />
                                    Lozinka mora sadržavati veliko i malo slovo, broj i specijalni znak <br />
                                    Dopušteni specijalni znakovi su sljedeći (@,#,$,%)
                                </p>
                            </div>

                            {/*Password Field Double-Check Input*/}
                            <label htmlFor="password">Šifra:
                                <span className={validMatchPassword && matchPassword ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                                </span>
                                <span className={validMatchPassword || !matchPassword ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                                </span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={e => { setMatchPassword(e.target.value) }}
                                required
                                aria-invalid={validMatchPassword ? "false" : "true"}
                                aria-describedby="matchpasswordnote"
                                value={matchPassword}
                                onFocus={() => setMatchPasswordFocus(true)}
                                onBlur={() => setMatchPasswordFocus(false)}
                            />
                            <div id="matchpasswordnote" className={`animate500 ${matchPasswordFocus && !validMatchPassword ? 'tooltip' : 'hidetooltip'}`}>
                                <p>
                                    <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                                    Lozinka se mora poklapazi sa lozinkom unesenom iznad
                                </p>
                            </div>
                            <button className="login-button" disabled={!validName || !validPassword || validMatchPassword ? false : true}>Registriraj Se</button>
                            <div className="form-reminder">
                                <p>
                                    Već ste registrirani?<br />
                                    <span className="line">
                                        <Link to="/prijava">Prijavi Se</Link>
                                    </span>
                                </p>
                            </div>
                        </form>
                    </section>
                </>)}</>
    )
}

export default Register;