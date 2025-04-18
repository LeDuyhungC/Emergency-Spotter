import { Link } from "react-router-dom"
import logo from "../assets/Emergency_Spotter_Logo.png"

export default function Header() {
    return (
        <header>
            <div>
                <img src= {logo} alt="DHL Logo"/>
                <h1>Duy-Hung Le</h1>
            </div>
            <nav>
                <ul>
                    <li><Link to = "/home">Home</Link></li>
                    <li><Link to = "/aboutUs">About Us</Link></li>
                    <li><Link to = "/functions">Functions</Link></li>
                    <li><Link to = "/report">Functions</Link></li>
                    <li>W/B</li>
                </ul>
            </nav>
        </header>
    )
}