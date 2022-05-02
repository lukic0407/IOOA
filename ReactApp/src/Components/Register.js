import {useRef, useState, useEffect} from "react"
import { faCheck,faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import axios from '../api/axios'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/auth/register';

const Register = () => {
    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [validName, setValidName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)

    const [matchPassword, setMatchPassword] = useState('')
    const [validMatchPassword, setValidMatchPassword] = useState(false)
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false)

    const [errMsg, setErrMsg] = useState ('')
    const [success, setSuccess] = useState (false)


    useEffect(() =>{
        userRef.current.focus()
    },[])

    useEffect(()=>{
        const check = USER_REGEX.test(user)
        setValidName(check)
    },[user])


    useEffect(()=>{
        const check = PWD_REGEX.test(password)
        const isMatched = password === matchPassword
        setValidPassword(check)
        setValidMatchPassword(isMatched)
    },[password,matchPassword])


    useEffect(()=>{
        setErrMsg('')
    },[user,password,matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault()
        //If ByPass Attempted
        const val_01 = USER_REGEX.test(user)
        const val_02 = PWD_REGEX.test(password)
        if (!val_01 || !val_02){
            setErrMsg('Invalid Entry')
            return
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({username: user,email: 'test@gmail.com',password: password}),
                {
                    headers: {'Content-Type':'application/json'},
                    withCredentials: true
                }
            );
            console.log(response.data)
            console.log(JSON.stringify(response))
            setSuccess(true)
        } catch (error) {
            if(!error?.response){
                setErrMsg('No Server Response');
            }else if(error.response?.status === 409){
                setErrMsg('Username Taken')
            }else{
                setErrMsg('Registration Failed')
            }
            errRef.current.focus()
            console.log(error)
        }
    }

    return(
        <>{
            success ? (
                <section>
                    <h1>Success</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
        <section>
            <p ref={errRef} className={errMsg ? 'error' : 'hide'} aria-live='assertive'>{errMsg}</p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
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
                    onChange={e=>{setUser(e.target.value)}}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    value={user}
                    onFocus={()=>setUserFocus(true)}
                    onBlur={()=>setUserFocus(false)}
                />
                <p id="uidnote" className={userFocus && user && !validName ? 'tooltip' : 'hide'}>
                    <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                    4 do 24 znaka <br/>
                    Korisničko ime mora započeti sa slovom. <br/>
                    Slova, brojevi i znakovi su dopušteni. 
                </p>

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
                    onChange={e=>{setPassword(e.target.value)}}
                    required
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="passwordnote"
                    value={password}
                    onFocus={()=>setPasswordFocus(true)}
                    onBlur={()=>setPasswordFocus(false)}
                />
                <p id="passwordnote" className={passwordFocus && !validPassword ? 'tooltip' : 'hide'}>
                    <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                    8 do 24 znaka <br/>
                    Lozinka mora sadržavati veliko i malo slovo, broj i specijalni znak <br/>
                    Dopušteni specijalni znakovi su sljedeći (@,#,$,%)
                </p>

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
                    onChange={e=>{setMatchPassword(e.target.value)}}
                    required
                    aria-invalid={validMatchPassword ? "false" : "true"}
                    aria-describedby="matchpasswordnote"
                    value={matchPassword}
                    onFocus={()=>setMatchPasswordFocus(true)}
                    onBlur={()=>setMatchPasswordFocus(false)}
                />
                <p id="matchpasswordnote" className={matchPasswordFocus && !validMatchPassword ? 'tooltip' : 'hide'}>
                    <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                    Lozinka se mora poklapazi sa lozinkom unesenom iznad
                </p>
                <button disabled={!validName || !validPassword || validMatchPassword ? false : true}>Registriraj Se</button>
                <p>
                    Već ste registrirani?<br/>
                    <span className="link">
                        <a href='#'>Prijavi Se</a>
                    </span>
                </p>
            </form>
        </section>
        )}</>
    )
}

export default Register;