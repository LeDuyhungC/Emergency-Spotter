import { Link } from "react-router-dom"
import logo from "/frontend/assets/Emergency_Spotter_Logo.png"
import Query_Dropdown from "./Query_Dropdown"
import "/frontend/css/Header.css"
import { useState } from "react"


export default function Header() {
    const [isDropDown, setDropDown] = useState(false);
    
    return (
        <header>
        
            <div>
                <img src= {logo} alt="DHL Logo"/>
                <h1>FAND</h1>
            </div>
            <nav>
                <ul>
                    <li><Link to = "/home">Home</Link></li>
                    <li><Link to = "/aboutUs">About Us</Link></li>
                    <li
                        className="dropdown-container"
                        onMouseEnter={() => setDropDown(true)}
                        onMouseLeave={() => setDropDown(false)}
                    >
                        <button className="dropdown-button">Queries</button>
                        <Query_Dropdown isOpen={isDropDown} />
                    </li>
                    <li><Link to = "/report">Report</Link></li>
                    <li><Link to = "/functions">Functions</Link></li>
                </ul>
            </nav>
        </header>
    )
}