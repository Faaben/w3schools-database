# W3Schools Database in Docker

Forked from https://github.com/yveseinfeldt/w3schools-database for academic purposes.
This repository provides:

- a docker compose which sets up the DB on port 3309 (non-default, no clashes)
- initializes the database data from w3schools (provided by @AndrejPHP) 
- Visual Studio Code config

## Fork to your github account
Go to github.com, create a new account or login.
Fork my repo (https://github.com/Faaben/w3schools-database)

Now you have a repository w3schools-database in your github account.
Clone that with
```
git clone https://github.com/Faaben/w3schools-database
cd w3schools-database
code .
```

## How to Run the database, rest-api and react app. The Browser will open on http://localhost:3001

```
./start-app.bat
```

## How to stop 
```
docker-compose stop  # Stoppe die Container ohne sie zu entfernen.
```

## How to start again 
```
docker-compose start  # Startet die Container erneut. 
```

## How to delete the Container, the network and all volumes
```
docker-compose down --volumes  # Stoppe und entferne alle Container, Netzwerke und Volumes
```

## How to end the wsl on your System
```
wsl --shutdown
```


## Tables

When the docker container starts, it creates database named __w3schools__ with the following tables

    categories
    customers
    employees
    orders
    order_details
    products
    shippers
    suppliers
    
and inserts the respective data. 

## Features
1. Get and list all Products
2. Get and list all suppliers
3. Get and list all categories
4. Create a new product
5. Create a new supplier
6. Create a new category
7. Update an existing product
8. Update an existing supplier
9. Update an existing category
10. Delet a product
11. Delet a supplier
12. Delete a category
13. Give an error message to the user when trying to delete a category that can't be deleted.
14. Searchfield for Products 
15. Searchfield for suppliers
16. The pagination logic divides products into pages and handles navigation between them.
17. Drag and Drop Handler 



## Journal
### 14.09.2024
The project setup was quite difficult, as I am missing some linux and docker experience.
After some try and errors and support from ChatGPT I made it finally work

### 16.10.2024 
- Ich hatte am Anfang grosse Schwirigkeiten mit der Ubuntu VM. Aus diesem Grund habe ich das ganze noch einmal bei mir Lokal auf dem Laptop installiert.
- The pagination logic divides products into pages and handles navigation between them.Ich habe versucht eine NavBar einzurichten. Bin dabei an einem Punkt leider nicht mehr weiter gekommen und habe noch einmal von vorne begonnen.

### 17.10.2024
- Ich hatte noch immer Schwirigkeiten meine React-App zu starten aus diesem Grund habe ich mich noch einmal genauer mit dieser Thematik befasst und ich wollte mir das Starten so einfach wie möchlich machen. So habe cih dann das File start-app.bat gemacht. 
- Da ich nun die wsl auf meinem lokalen Gerät habe brauchte es extrem viel Arbeitsspeicher. So habe ich herausgefunden, dass ich die wsl mit "wsl --shutdown" ausschalten kann. 

### 21.10.2024
- Ich habe noch einmal die Navigationsbar versucht einzurichten, leider ohne erfolg. 

### 25.10.2024 
- Da die App nicht mehr funkioniert hat, habe ich den Code vom 21.10.2024 wieder entfernt. 
- Ich habe nun die Funktion von den Kategorien kopiert und das gleiche für die Produkte erstellt. 
- Nun habe ich das Prinzip von der React-app verstanden und es fängt an spass zu machen die neuen Funktionen einzubauen. Ich habe vorallem gelernt, dass man am Anfang nur kleine Anpassungen vornehmen sollte. 

### 26.10.2024 
- Ich habe nun die Funktionen Neues Produkt erfassen, editieren und löschen optimiert und einige Fehler korrigiert, damit man das Produkt korrekt richtig abspeichern konnte

### 30.10.2024
- Ich habe noch die 3. Entität "Supplier" hinzugefügt. Dabei habe ich die Funktionen vom "Product" übernommen.
- Die Funktionen im Markdown ergänzt und das Journal anhand von meinen Commits im GitHub ausgefüllt. 


