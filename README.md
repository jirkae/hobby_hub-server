# Backend (API) HobbyHub
DOKUMENTACE REST API

--------------------------------------------------
Vyhledávání akcí
--------------------------------------------------
Fulltext vyhledavani eventu:   		GET /api/Events/findFulltext?query={řetězec}
- nepoužívat pro napovídání, mongo neumí fulltext neúplných slov
- fulltext prohledává name a description
- umi vyhledavat podle kořenu slova (takže při zadání strawberries najde i strawberry apod.)

Vyhledani podle name: 						GET /api/Events/findByName?name={řetězec}
Vyhledani podle description: 			GET /api/Events/findByDesc?desc={řetězec}

--------------------------------------------------
Registrace
--------------------------------------------------

POST /api/AuthUsers

HTTP body:
```
{
  "firstName": "Křestní jméno",
  "lastName": "Příjmení",
  "info": "Info o uživateli",
  "phoneNumber": "123456789",
  "email": "email@email.cz"
  "password": "heslo"
}
```

--------------------------------------------------
Login
--------------------------------------------------

POST /api/AuthUsers/login

HTTP body:
```
{
"email": "email@email.cz",
"password": "heslo"
}
```

Odpověď:
```
{
  "id": "iNPmWXFgNMepfcJrPIkfODB14PvZ7nYebCSfEHcE97kKLQeRqDyN0IExyroPd5L4",
  "ttl": 1209600,
  "created": "2016-11-10T12:11:57.221Z",
  "userId": "idUživatele"
}
```
id = token pro autorizaci, po přihlášení dávat za každý dotaz
userId = id uživatele


--------------------------------------------------
Vytvoření akce
--------------------------------------------------

POST /api/AuthUsers/{idUzivatele}/ownEvents?access_token={token}

HTTP body:
```
{
  "name": "Název akce",
  "description": "Popis akce",
  "tags": [
    "první štítek", "druhý štítek"
  ],
  "participantsMin": 0,
  "participantsMax": 0,
  "participantsConfirm": true/false, //teď není potřeba řešit
  "street": "Ulice",
  "city": "Město",
  "zipCode": "PSČ",
  "startDate": "2016-11-26T00:00:00.000Z",
  "endDate": "2016-11-26T00:00:00.000Z"
}
```

--------------------------------------------------
Požádání o účast na akci
--------------------------------------------------

PUT /api/Participations/toggleParticipation?access_token={token}

HTTP body:
```
{
"userId": "ID uživatele",
"eventId": "ID akce"
}
```

Funguje tak, že při opakovaném odeslání uživatele odhlásí, je-li to možné (není-li již potvrzený).

--------------------------------------------------
Požádání o účast na akci
--------------------------------------------------

PUT /api/Participations/toggleConfirmation?access_token={token}

HTTP body:
```
{
"userId": "ID uživatele",
"eventId": "ID akce"
}
```

Funguje tak, že při opakovaném odeslání uživateli zruší potvrzení. A tak pořád dokola.

--------------------------------------------------
Zbytek
--------------------------------------------------
Koukněte na explorer (swagger). A kdyžtak se zeptejte. Dodělat vám metodu / atribut / response (validační hlášky)
pro váš use-case je otázkou par minut.
