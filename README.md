# Backend (API) HobbyHub

--------------------------------------------------
Vyhledavani eventu
--------------------------------------------------
Fulltext vyhledavani eventu:   		get /api/Events/findFulltext?query=<retezec>
- nepouzivat pro napovidani, mongodb neumi fulltext neuplnych slov (takze pri zadani Bi se nenajde Bird)
- fulltext prohledava Name, Description a DetailedDescription
- umi vyhledavat podle korenu slova (takze pri zadani "strawberries" najde i strawberry")

Vyhledani podle name: 						get /api/Events/findByName?name=<retezec>
Vyhledani podle description: 			get /api/Events/findByDesc?desc=<retezec>

--------------------------------------------------
Registrace a login uzivatele
--------------------------------------------------

Registrace:												post /api/AuthUsers

A json do http body:
{
  "email": "email@email.cz",
  "password": "heslo"
}

Login:														post /api/AuthUsers/login

A json do http body:
{
"email": "email@email.cz",
"password": "heslo"
}

Jako odpoved prijde json, napr.:
{
  "id": "iNPmWXFgNMepfcJrPIkfODB14PvZ7nYebCSfEHcE97kKLQeRqDyN0IExyroPd5L4",
  "ttl": 1209600,
  "created": "2016-11-10T12:11:57.221Z",
  "userId": "string"
}

kde "id" je token, ktery se pouziva pro autorizovany pristup, viz dale vytvareni eventu


--------------------------------------------------
Vytvoreni eventu
--------------------------------------------------

/api/AuthUsers/<idUzivatele>/events?access_token=<token>

A data json:
{
  "name": "string",
  "description": "string",
  "detailDescription": "string"
}
