#### How to use the development environnement

First step, which is sadly, a default of the environnement, you have to run ```npm i``` in both ./backend/ and ./frontend/
I didn't find how to fix this for the moment, but, appart from that, everything seem to be running smoot, so please indulge.

You also have to create an .env file, following the example of ./env_sample.

You may need to locally stop nginx, do
```systemctl stop nginx```
or any other command you prefer

Then, you just have to
```docker-compose up``` to launch the whole thing.

#### What to do in case of a merge ? 

Dockerfiles or configs or package may have changed. Take the reflex to build again your images before saying everything is broken ;) 

### development
#### frontend 

Holy be the hot reloading, write code, save, enjoy the result.
You can access whatever you code in the frontend at localhost:8080 from your preferred browser.

#### backend 

Holy be the hot reloading, write code, save, enjoy the result.
You can access whatever you code in the backend at http://localhost:8080/api/ from your preferred browser.
You can access any routes by using http://localhost:8080/api/[ROUTE], the route will be cleansed from the /api/ part. Leaving you only what you need.
Don't forget to refresh the page to do a new call to the route though ;) 

There is some tools ready for your convenience to tests request. A light example with insomnia (similare to postman for those who knows), and a frontend minimal example, read the documentation attached in backend_manual.

You can test the get routes directly on browser, but it's more complicated for other types of routes, hence the two tools offered.

#### phpmyadmin 

You can access phpmyadmin at http://localhost:5431 from your preferred browser.
user : postgres
password : the root password from docker-compose

### containers manipulations
#### interactive
If you need to enter a container, let's say, backend, you can do :
```docker-compose exec backend bash```
Or if bash is not availaible (depending on image base): 
```docker-compose exec backend sh```

#### Rebuilding container one to one
Example for the backend :
```docker-compose build --no-cache backend```

#### acces container logs
Example for the backend :
```docker-compose logs backend```

#### stopping all dockers
```docker stop $(docker ps -qa)```

#### deleting all dockers
They must be already stopped beforehand.
```docker system prune -fa```