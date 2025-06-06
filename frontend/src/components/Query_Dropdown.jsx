import { useState } from "react";
import { Link } from 'react-router-dom'
import '/frontend/css/Query_Dropdown.css'


function formatDropDown(queryPages) {
    return (
        <div className="dropdown-menu">
          {queryPages.map((page) => (
            <Link key={page.path} to={page.path} className="dropdown-item">
              {page.label}
            </Link>
          ))}
        </div>
    )
}

export default function Query_Dropdown() {
    const [isDropdownOpen, setDropDownOpen] = useState(false);

    const queryPages = [ //Array of my obj that contain path, and label
        { path: '/query_One', label: 'Query One' },
        { path: '/query_Two', label: 'Query Two' },
        { path: '/query_Three', label: 'Query Three' },
        { path: '/query_Four', label: 'Query Four' },
        { path: '/query_Five', label: 'Query Five' },
        { path: '/query_Six', label: 'Query Six' },
    ];

    return (
    <div
        className="dropdown-container"
        onMouseEnter={() => setDropDownOpen(true)}  //ReactHandler id if mouse is on button
        onMouseLeave={() => setDropDownOpen(false)}
    >
        <button className="dropdown-button">Queries</button>
        {isDropdownOpen && formatDropDown(queryPages)}
    </div>
    );
}