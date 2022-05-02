import React from "react";
import ReactDOM from "react-dom"
import HeaderContent from "./HeaderContent";
class Header extends React.Component {
    

    constructor() {
        super()
        this.header = document.getElementById('header');
    }

    render() {
        return ReactDOM.createPortal(
            <HeaderContent></HeaderContent>,
            this.header
        )
    }
}

export default Header