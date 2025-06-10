# Emergency Spotter

By: Duy-Hung Le, Faisal Nur, Abdulrahman Elmi, Nate Almanza

Emergency Spotter’s mission is to provide a web application that enables first responders or civilians to report their emergency findings to a web app. The reports function is to alert people in the surrounding areas and notify the proper authorities of incoming emergencies. The motivation behind this application is to encourage everyday people to help out in emergencies while providing support to the victims of unfortunate events, creating a stronger community, identity, and sanctuary in times of disaster.

### Features

-   **Real-time Geolocation**: Uses the browser's navigator.geolocation API to pinpoint the user's current location.
-   **Interactive Map**: Integrates Google Maps JavaScript API to display locations visually.
-   **Address Lookup**: Utilizes the Google Maps Geocoding API to convert coordinates into human-readable addresses.
-   **Data Persistence**: Stores incident data in a MySQL database and retrieves data by use of query.
-   **Modern Frontend**: A responsive and fast user interface built with React and Vite.

### Technologia

-   **Frontend**: React, Vite, React Bootstrap, CoreUI, React Google Maps API
-   **Backend**: Node.js, Express.js
-   **Database**: MySQL
-   **APIs**: Google Maps JavaScript API, Geocoding API, Geolocation API

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

1. [Node.js](https://nodejs.org/en/) (v16 or higher recommended)

2. [npm](https://www.npmjs.com/) (usually comes with Node.js)

3. A running [MySQL](https://www.mysql.com/downloads/) server instance.

4. A [Google Cloud Platform](https://cloud.google.com/) account to obtain API keys.

### Steps to Install

##### 1. Clone the Repository

First, clone the project to your local machine.

bash

git clone https://github.com/your-username/emergency-spotter.git

cd emergency-spotter

#### 2. Set-up  API Key & Environment Variables

Google Maps API Key:

1. Go to the Google Cloud Console.

2. Create a new project.

3. Go to APIs & Services > Credentials and create a new API Key.

4. Important: Enable the following APIs for your key in the APIs & Services:

     -Maps JavaScript API

     -Geocoding API

     -Geolocation API

DEPENDENCIES LIST:

├── @coreui/coreui@5.2.0

├── @coreui/react@5.5.0

├── @eslint/js@9.24.0

├── @react-google-maps/api@2.20.6

├── @types/react-dom@19.1.2

├── @types/react@19.1.2

├── @vitejs/plugin-react@4.4.0

├── bootswatch@5.3.6

├── cors@2.8.5

├── dotenv@16.5.0

├── eslint-plugin-react-hooks@5.2.0

├── eslint-plugin-react-refresh@0.4.19

├── eslint@9.24.0

├── express@5.1.0

├── globals@16.0.0

├── mysql2@3.14.1

├── react-dom@19.1.0

├── react-router-dom@7.6.0

├── react@19.1.0

└── vite@6.3.5


#### 3. env. Config

PORT=3306

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=emergency_spotter_db

VITE_API_KEY_GOOGLE_MAP=YOUR_GOOGLE_MAPS_API_KEY_HERE

#### 4. Set-up Database
     CREATE DATABASE emergency_spotter_db;
     
     Should be provided with a SQL Script to use


#### 5. Download Dependencies

Setup Backend: 

     cd backend

     npm install

Setup Frontend:

     cd frontend

     npm install

#### 6. Start-up Web application (Run on seperate terminals)

Front end: npm run dev

Back end: npm start

### Usage:

The Emergency Map UI shows your current location (if allowed) or the preset location, which is UW Tacoma, a yellow circle pin. The map will also provide all the emergency reports, which will be pinned red on the map. This uses Google Maps Geocoder API and navigator, which is a browser API.

Report: Reports is for the user to submit a report on an emergency fill out details also automatically inputs location if shared location is allowed. Information will be input into our emergency spotter database for query usage.

Query 1: Info of Reports in a day
The parameter is a date format that you can submit, and in return, it will provide the user with all the reports that occurred on that day.

Query 2: All Reports On Users
The parameter is a drop-down selection of all the Users' names based on the user ID, and in return, all the reports that were issued by that user are shown in the description.

Query 3:  Info of Report by location
The parameter is a location that you can type in. The location you type will be queried from the database, and any partial matches will be displayed on the client. 

Query 4: Report by Emergency Description count
The parameter check box which returns all the emergencies and their count. You can also search specific emergencies and any partial matches or full will be displayed. 

Query 5: This query lets a user search users by their role and specified city. If either user or city don’t exist, then it returns an error message.

Query 6: This query implements the transaction logic. The user can either choose from the dropdown menu or type each themselves. A special report is submitted, the user, emergency, and location must already exist. If one of them doesn’t, it rolls back and tells the user that the specific ID doesn’t exist. If a report is successfully submitted, meaning the user entered a valid existing user, location, and emergency, then a report is created and added to the reports table with that information. The population for that location is incremented by 1. If the population at that location exceeds the max_population for its structure_type, then it rolls back and returns an error. 
