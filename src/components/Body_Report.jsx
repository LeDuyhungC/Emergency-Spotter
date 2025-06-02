import "../css/Body_Report.css";

export default function Body_Report() {
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload
        // Add your form submission logic here
    };

    return (
        <div className="report_div">
            <h1>Report</h1>
            <form onSubmit={handleSubmit}>
                <section>First Name: <input type="text" /></section>
                <section>Last Name: <input type="text" /></section>
                <section>Personnel Type: <input type="text" /></section>
                <section>Emergency: <input type="text" /></section>
                <section>Location: <input type="text" /></section>
                <section>
                    Date: <input type="date" />
                    Time: <input type="time" />
                </section>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}