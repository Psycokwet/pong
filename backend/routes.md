## NOTE

With the current auth system you have to add users manually in the database if you want to run tests requiring many different users.

To create new entries manually in a database:

- Go to http://localhost:5431/
- Click on PostgreSQL icon on the left
- Log in: postgres / localroot
- Navigate to the db you want to add entries to using the menu on the left
- Click on "Inserer" and now you have to add some info relevant to the entity's columns, should be fairly straightforward
- Add as many entries as you want, if you want to add many in succession you can use the "Inserer et repeter" button for a quicker time

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
    "level": 2.0794415416798357,
    "userRank": {
        "rank": "1"
    }
}
```

#### failure response :

```
{
    "error": "User not found"
}
```

### get user history :

GET /user/get_user_history

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
    "nbGames": 4,
    "nbWins": 2,
    "games": [
        {
            "time": "Sep 18 2022 17:25:42",
            "opponent": "thi-nguy",
            "winner": "cdai",
            "id": 8
        },
        {
            "time": "Sep 18 2022 17:25:00",
            "opponent": "nel-masr",
            "winner": "nel-masr",
            "id": 6
        },
        {
            "time": "Sep 18 2022 17:24:48",
            "opponent": "scarboni",
            "winner": "cdai",
            "id": 5
        },
        {
            "time": "Sep 18 2022 17:24:19",
            "opponent": "mescande",
            "winner": "mescande",
            "id": 4
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

GET /user/get_pongUsername

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

POST /user/set_pongUsername

#### payload:

```
{
	"login42": "sophie",
    "new_pongUsername":"sophie_new",
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
