# W3Schools Database in Docker

Forked from https://github.com/AndrejPHP/w3schools-database for academic purposes.
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
docker-compose stop  # Stoppe die Container ohne sie zu entfernen
```

## How to start again 
```
docker-compose start  #Startet die Container wieder
```

## How to delete the Container, the network and all volumes
```
docker-compose down --volumes  # Stoppe und entferne alle Container, Netzwerke und Volumes
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
1. Get and list all categories
2. Create a new category
3. Update an existing category
4. Delete a category
5. Give an error message to the user when trying to delete a category that can't be deleted

## Journal
### 14.09.2024
The project setup was quite difficult, as I am missing some linux and docker experience.
After some try and errors and support from ChatGPT I made it finally work

