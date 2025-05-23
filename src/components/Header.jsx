import { Link } from "react-router-dom"
import logo from "../assets/Emergency_Spotter_Logo.png"
import "../css/Header.css"

export default function Header() {
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
                    <li><Link to = "/functions">Functions</Link></li>
                    <li><Link to = "/report">Report</Link></li>
                    <li>W/B</li>
                </ul>
            </nav>
        </header>
    )
}