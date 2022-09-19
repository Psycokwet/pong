## NOTE

With the current auth system you have to add users manually in the database if you want to run tests requiring many different users (refer to get user history for info on how to access).

### get rank :

GET /user/get_user_rank

#### payload :

```
{
	"login42": "sophie"
}
```

#### success response :

```
{
    "rank": 1
}
```

#### failure response :

```
{
    "status": 400,
    "error": "User not found"
}
```

### get user history :

1. First you have to manually create some games directly in the database (otherwise there will be no data so you will just see 0 games, 0 wins and no games):

   - Go to http://localhost:5431/
   - Click on PostgreSQL icon on the left
   - Log in: postgres / localroot
   - Navigate to the "game" db using the menu on the left
   - Click on "Inserer" and now you have to add some info:
     - player1_id: id of player 1, it can be any user id (you can find user ids by clicking on user db and checking id column)
     - player2_id: id of player 2
     - winner: id of winner
     - player1Id: id of player 1, you can use the drop-down menu for this
     - player2Id: id of player 2, same as above
   - Add as many games as you want, if you want to add many in succession you can use the "Inserer et repeter" button for a quicker time

2. POST /user/get_user_rank

#### payload :

```
{
	"login42": "sophie"
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
```

### add friend :

POST /user/add_friend

#### payload :

```
{
	"login42": "sophie",
    "friend_to_add":
}
```

#### success response:

201 created

#### failure response :

Trying to add a user that does not exist (400):

```
{
    "error": "User not found"
}
```

Adding yourself (400):

```
{
    "error": "You cannot add yourself"
}
```

Adding someone already in your friends list (400):

```
{
    "error": "User is already in friends list"
}
```

### get friends list

GET /user/get_friends_list

#### payload :

```
{
	"login42": "sophie",
}
```

#### success response:

```
[
    {
        "login42": "cdai"
    },
    {
        "login42": "coucou3"
    },
    {
        "login42": "mescande"
    }
]
```

#### failure response :

```
{
    "error": "User not found"
}
```

### get nickname

GET /user/get_nickname

#### payload :

```
{
	"login42": "sophie",
}
```

#### success response:

```
{
    "nickname": "sophie"
}
```

#### failure response :

```
{
    "error": "User not found"
}
```

### set nickname

POST /user/set_nickname

#### payload:

```
{
	"login42": "sophie",
    "new_nickname":"sophie_new",
}
```

#### success response:

201 CREATED
You should see that all instances of the old username are replaced by the new one (try seeing in the friends list or in games)

#### failure response :

```
{
    "error": "User not found"
}
```
