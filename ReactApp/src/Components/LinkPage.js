import {Link} from 'react-router-dom'
import React from "react";

const LinkPage = () =>{
    return(
        <div>
            <Link to="/login">Login</Link>
            <a href="/profile">Profile</a>
        </div>
    )
}

export default LinkPage