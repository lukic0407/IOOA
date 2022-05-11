import React, { useEffect, useState, useRef} from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import {Link, useNavigate, useLocation} from 'react-router-dom'
import '../css/LoginPage.css'
const LOGIN_URL = '/auth/login';

const Login = () =>{
    const {setAuth,persist,setPersist,setLogedIn} = useAuth()

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const userRef = useRef();
    const errRef = useRef();

    const [user,setUser] = useState('')
    const [password,setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success,setSuccess] = useState(false)

    useEffect(()=>{
        userRef.current.focus()

    },[])

    useEffect(()=>{
        setErrMsg('')
    },[user,password])  

    const handleSubmit= async(e)=>{
        e.preventDefault()
        setUser('')
        setPassword('')
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({username: user,password}),
                {
                    headers:{'Content-Type':'application/json'},
                    withCredentials: true
                })
            console.log(JSON.stringify(response?.data))
            console.log(response)
            const accessToken = response?.data?.accessToken
            const roles = response?.data?.roles
            setAuth({user,password,roles,accessToken})
            setLogedIn(true)
            setUser('')
            setPassword('')
            setSuccess(true)
            navigate(from,{replace:true})
        } catch (error) {
            if(!error?.response) setErrMsg('No server response')
            else if (error.response?.status===400) setErrMsg('Missing username or password')
            else if (error.response?.status===401) setErrMsg('Wrong Email or password')
            else setErrMsg('Login Failed, please check your login data');
            errRef.current.focus()
            console.log(error)
        }
        
    }

    const togglePersist = ()=>{
        setPersist(prev => !prev);
    }

    useEffect(()=>{
        localStorage.setItem("persist",persist)
    },[persist])

    return(
        <>
    <div className="hero-background">
            <h1 className="login-title">Prijava
                <hr className="hero-divider"></hr>
            </h1>
    </div>
        <section className="login-wrap" >
            <p ref={errRef} className={errMsg ? 'error' : 'hide'} aria-live='assertive'>{errMsg}</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    required={true}
                    ref={userRef}
                    autoComplete="on"
                    onChange={(e)=>setUser(e.target.value)}
                    value={user}
                ></input>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    required={true}
                    onChange={(e)=>setPassword(e.target.value)}
                    value={password}
                ></input>
                <div className="perist-check">
                    <input 
                    type="checkbox"
                    id="persist"
                    checked={persist}
                    onChange={togglePersist}
                    >
                    </input>
                    <label htmlFor="persist">Vjeruj ovom uređaju</label>
                </div>
                <button className="login-button">Prijavi se</button>
                <div className="form-reminder">
                <p>Nemaš još račun?<br/>
                    <span className="line">
                    <Link to="/registracija">Registriraj se</Link>
                </span>
            </p>
                
            </div>
            </form>

        </section>
        </>
    )
}

export default Login