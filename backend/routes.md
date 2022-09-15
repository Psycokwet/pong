### Create user :
POST /user/signup
#### payload : 
```
{
	"username": "sophie",
	"password": "soph6R756ie",
	"email": "sophie@sophie.fr"
}
```
#### succes response : 
201 created
#### failure response : 
```
{
    "statusCode": 400,
	"message": [
		"Password should contains 8 character minimum",
		"Password cannot be empty",
		"password must be a string"
	],
	"error": "Bad Request"
} 
```

```
{
	"status": 400,
	"error": "Username or Email already used"
}
```

### get rank :
GET /user/get_user_rank
#### payload : 
```
{
	"username": "sophie"
}
```
#### succes response : 
1
#### failure response : 
```
{
	"statusCode": 500,
	"message": "Internal server error"
}
```
This should not happen and need proper handling.