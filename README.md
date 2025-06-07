#Emergency Spotter Readme TCSS 445

By Duy-Hung Le, Faisal Nur, Abdulrahman Elmi, Nate Almanza

<p>This project focuses on a web-app that has the function to report emergencies, see emergencies near by and use queries to get information for users' needs.
The Technologies we used were react-vite for front end dynamic interactions for users, node express js and MariaDB for backend use.
API's that were used are the navigator and geocoder from google maps</p>

Functions and Features:

Map that shows real time location of user making identifying and reporting emergencies easier in you area.

Report that submits to the database for later query use.

Query 1: Give a date and return all reports submitted on that day.

Query 2: Give a User and return all reports submitted from that user.

Query 3: Gives a location and returns all reports in that location.

Query 4: Shows all emergency types and the amount of reports with the same emergency type.

Query 5: Enter a role then the city Id to return the Users that are in the city Id

Query 6: This query implements the transaction logic. The user can either choose from the dropdown menu or type each themselves. A special report is submitted, the user, emergency, and location must already exist. If one of them doesn’t, it rolls back and tells the user that the specific ID doesn’t exist. If a report is successfully submitted, meaning the user entered a valid existing user, location, and emergency, then a report is created and added to the reports table with that information. The population for that location is incremented by 1. If the population at that location exceeds the max_population for its structure_type, then it rolls back and returns an error. 

Quick Start
#Clone the repository

git clone https://github.com/your_username/emergency-spotter.git

cd emergency-spotter



# Navigate to backend

cd backend



# Install dependencies

npm install

# Create a .env file with your database credentials (see .env.example)



# Then, start the server

npm start



#DEPENDENCIES

     bootstrap react-bootstrap 

    "@coreui/coreui": "^5.2.0",
    
    "@coreui/react": "^5.5.0",
    
    "@react-google-maps/api": "^2.20.6",
    
    "cors": "^2.8.5",
    
    "dotenv": "^16.5.0",
    
    "express": "^5.1.0",
    
    "mysql2": "^3.14.1",
    
    "react": "^19.0.0",
    
    "react-dom": "^19.0.0",
    
    "react-router-dom": "^7.5.1"

    "@eslint/js": "^9.22.0",
    
    "@types/react": "^19.0.10",
    
    "@types/react-dom": "^19.0.4",
    
    "@vitejs/plugin-react": "^4.3.4",
    
    "eslint": "^9.22.0",
    
    "eslint-plugin-react-hooks": "^5.2.0",
    
    "eslint-plugin-react-refresh": "^0.4.19",
    
    "globals": "^16.0.0",
    
    "vite": "^6.3.1"
