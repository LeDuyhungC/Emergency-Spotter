Emergency Spotter Readme TCSS 445

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

Query 6: Update population in a location, if max locaton then it will rollback.


