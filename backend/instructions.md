# Pickup Basketball API – Frontend Cheat Sheet

## File tree (functions)

```
supabase/
  functions/
    countRsvps/
    createGame/
    deleteGame/
    getNearbyCourts/
    getPlayerGames/
    getUpcomingGames/
    otherCustomLogic/
    playerSearch/
    rsvpToGame/
    updateGame/
```

---

## Functions (short)

### countRsvps

* **Description:** Returns RSVP counts for a game.
* **How to call:** `GET /functions/v1/countRsvps?game_id=<number>`
* **Params:** `game_id` (number)

---

### createGame

* **Description:** Create a new pickup game and auto-RSVP the host.
* **How to call:** `POST /functions/v1/createGame`
* **Body:**

```json
{
  "host_id": number,
  "court_id": number,
  "game_date": "YYYY-MM-DD",
  "game_time": "HH:MM",
  "players_needed": number,
  "skill_level": number,
  "notes": "string"
}
```

---

### deleteGame

* **Description:** Delete a game (host only).
* **How to call:** `POST /functions/v1/deleteGame` or `DELETE /functions/v1/deleteGame?game_id=<number>`
* **Body / Params:** `{ "game_id": number }` or query `game_id`
* **Auth:** `Authorization: Bearer <access_token>` required

---

### getNearbyCourts

* **Description:** List courts near a location within a radius.
* **How to call:** `GET /functions/v1/getNearbyCourts?lat=<number>&lng=<number>&radius_km=<number>&limit=<number>`
* **Params:** `lat` (number), `lng` (number), optional `radius_km` (default 10), optional `limit`

---

### getPlayerGames

* **Description:** Return games a player hosted or attended.
* **How to call:** `GET /functions/v1/getPlayerGames?player_id=<number>&upcoming=<true|false>&include_declined=<true|false>`
* **Params:** optional `player_id` (defaults to authenticated player if omitted), optional `upcoming`, optional `include_declined`
* **Auth:** If `player_id` omitted, include `Authorization: Bearer <access_token>`

---

### getUpcomingGames

* **Description:** List upcoming games, optional filters.
* **How to call:** `GET /functions/v1/getUpcomingGames?limit=<number>&court_id=<number>&host_id=<number>`
* **Params:** optional `limit`, optional `court_id`, optional `host_id`

---

### otherCustomLogic

* **Description:** Placeholder for future custom endpoints.
* **How to call:** TBD
* **Params:** TBD

---

### playerSearch

* **Description:** Search players by name for autocomplete or lookups.
* **How to call:** `GET /functions/v1/playerSearch?search=<string>&limit=<number>`
* **Params:** `search` (string), optional `limit`

---

### rsvpToGame

* **Description:** Insert or update an RSVP for a player.
* **How to call:** `POST /functions/v1/rsvpToGame`
* **Body:**

```json
{
  "player_id": number,
  "game_id": number,
  "status": "confirmed" | "maybe" | "declined"
}
```

* **Note:** The DB uses `declined` for no. If frontend sends `no`, map it to `declined`.

---

### updateGame

* **Description:** Update game fields (host only).
* **How to call:** `POST /functions/v1/updateGame` or `PATCH`
* **Body:**

```json
{
  "game_id": number,
  "court_id"?: number,
  "game_date"?: "YYYY-MM-DD",
  "game_time"?: "HH:MM",
  "players_needed"?: number,
  "skill_level"?: number,
  "notes"?: "string"
}
```

* **Auth:** `Authorization: Bearer <access_token>` required

---

*End document*
