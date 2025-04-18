import "../css/Body_Report.css";

export default function Body_Report() {
    return (
        <>
        <body>
            <div className="report_div">
                <h1>Report</h1>
                <form>
                    
                    <section>First Name: <input type = "text"></input></section>
                    <section>Last Name: <input type = "text"></input></section>
                    <section>Personnel Type: <input type = "text"></input></section>
                    <section>Emergency: <input type = "text"></input></section>
                    <section>Location: <input type = "text"></input></section>
                    <section>Date: <input type = "date"></input>Time: <input type = "time"></input></section>
                    <input type = "submit"></input>
                </form>
            </div>
        </body>
        </>
    )
}