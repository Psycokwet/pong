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
#### success response : 
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
#### success response : 
1
#### failure response : 
```
{
    "status": 400,
    "error": "User not found"
}
```
### get user history :
1/ First you have to manually create some games directly in the database (otherwise there will be no data so you will just see 0 games, 0 wins and no games):
	* Go to http://localhost:5431/
	* Click on PostgreSQL icon on the left
	* Log in: postgres / localroot
	* Navigate to the "game" db using the menu on the left
	* Click on "Inserer" and now you have to add some info:
		=> player1_id: id of player 1, it can be any user id (you can find user ids by clicking on user db and checking id column)
		=> player2_id: id of player 2
		=> winner: id of winner
		=> player1Id: id of player 1, you can use the drop-down menu for this
		=> player2Id: id of player 2, same as above
	* Add as many games as you want, if you want to add many in succession you can use the "Inserer et repeter" button for a quicker time

2/ POST /user/get_user_rank
#### payload : 
```
{
	"username": "sophie"
}
```
#### success response : 
```
{
    "nbGames": 0,
    "nbWins": 0,
    "games": []
}
```

```
{
    "nbGames": 3,
    "nbWins": 2,
    "games": [
        {
            "id": 4,
            "player1": "sophie",
            "player2": "coucou2",
            "winner": "sophie"
        },
        {
            "id": 5,
            "player1": "coucou3",
            "player2": "sophie",
            "winner": "coucou3"
        },
        {
            "id": 6,
            "player1": "coucou3",
            "player2": "sophie",
            "winner": "sophie"
        }
    ]
}
```
#### failure response : 
```
{
    "status": 400,
    "error": "User not found"
}
