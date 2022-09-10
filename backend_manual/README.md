### How to tests your routes

2 options offered here :
#### js_client
run
```npm i```
```npm run dev```
and update src/main.tsx using Api class like in the examples on the file, to call whatever route you want, add your own api manual tests here as well.

follow the link offered by the terminal (supposedly http://localhost:5173/)
And refresh the page if you want to resend the request.

The advantage is that you can take advantage of the real project dto like that.


#### insomnia-requests
Download (https://insomnia.rest/download)[insomnia] (similar to postman if you know ), import insmonia-requests content, and see the example with createUser request.

You can test your request like that if you do prefer.