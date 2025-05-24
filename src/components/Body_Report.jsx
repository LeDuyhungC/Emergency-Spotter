import { useState } from "react";
import "../css/Body_Report.css";

export default function Body_Report() {

    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [emergency, setEmergency] = useState("");
    const [location, setLocation] = useState("");

    return (
        <>
            <div className="report_div">
                <h1>Report</h1>

                <section>
                    <form action = "/action_page.php" target = "_blank">
                        
                        <label htmlFor = "fname">First Name:</label><br/>
                        <input type = "text" id = "fname" name = "fname"></input><br/>

                        <label htmlFor = "lname">Last Name:</label><br/>
                        <input type = "text" id = "lname" name = "lname"></input><br/>

                        <label htmlFor = "personnel">Personnel Type:</label><br/>
                        <input type = "text" id = "personnel" name = "personnel"></input><br/>

                        <label htmlFor = "emergency">Emergency:</label><br/>
                        <input type = "text" id = "emergency" name = "emergency"></input><br/>

                        <label htmlFor = "location">Location:</label><br/>
                        <input type = "text" id = "location" name = "location"></input><br/>

                        <label htmlFor = "date">Date:</label><br/>
                        <input type = "date" id = "date" name = "date"></input><br/>

                        <label htmlFor = "time">Time:</label><br/>
                        <input type = "time" id = "time" name = "time"></input><br/>

                        <input type = "submit" ></input><br/>
                    </form>
                </section>
            </div>
        </>
    )
}