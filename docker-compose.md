#### How to use the development environnement

First step, which is sadly, a default of the environnement, you have to run ```npm i``` in both ./backend/ and ./frontend/
I didn't find how to fix this for the moment, but, appart from that, everything seem to be running smoot, so please indulge.

Then, you just have to
```docker-compose up``` to launch the whole thing.

### development
#### frontend 

Holy be the hot reloading, write code, save, enjoy the result.
You can access whatever you code in the frontend at localhost from your preferred browser.

#### backend 

Holy be the hot reloading, write code, save, enjoy the result.
You can access whatever you code in the backend at localhost/api/ from your preferred browser.
You can access any routes by using localhost/api/[ROUTE], the route will be cleansed from the /api/ part. Leaving you only what you need.

### containers manipulations
#### interactive
If you need to enter a container, let's say, backend, you can do :
```docker-compose exec backend bash```
Or if bash is not availaible (depending on image base): 
```docker-compose exec backend sh```

#### Rebuilding container one to one
Example for the backend :
```docker-compose build --no-cache backend```
