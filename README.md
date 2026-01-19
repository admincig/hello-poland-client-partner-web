# Partner Web (Hello! Poland)

React / Next.js aplikacja webowa dla **Partnera** w ekosystemie **Hello! Poland**.

Pełna dokumentacja runtime, zgodna z aktualnym wdrożeniem TST (Docker + nginx + CONFIG_PATH).

---

## Overview

Partner Web to aplikacja **Next.js (Node.js)** uruchamiana w **kontenerze Docker**, konfigurowana **wyłącznie przez plik `config.json` wskazywany zmienną `CONFIG_PATH`**.

Aplikacja:
- komunikuje się z **HelloPoland Backend (HPL)** przez REST API,
- korzysta z **DMS** montowanego do kontenera jako `/DMS`,
- jest wystawiana na zewnątrz **przez nginx (reverse proxy)**.

---

## Project structure (kod źródłowy)

```
/components        – globalne komponenty UI
/config            – domyślne konfiguracje developerskie (nieużywane na TST/PROD)
/pages             – routing Next.js (kebab-case)
/redux             – globalne reducery
/scripts           – skrypty buildowe
/services          – warstwa serwisów / API
/static             – pliki statyczne (obrazy, manifest)
/utils              – funkcje pomocnicze
/views              – implementacje widoków
```

> ⚠️ Runtime **nie używa katalogu `/config`** z repozytorium.

---

## Runtime configuration (TST / PROD)

### Zasada

Konfiguracja runtime **nie jest bundlowana** w obrazie Dockera.

Aplikacja **czyta ją tylko przy starcie** z pliku JSON wskazanego przez:

```
CONFIG_PATH=/data/config.json
```

---

## Struktura katalogów na serwerze (TST)

```
/srv/partner/tst/
├── config.json
├── config.json.bak_YYYYMMDD_HHMMSS
└── deploy_partner_image.sh (opcjonalnie)
```

Mount do kontenera:

```
-v /srv/partner/tst:/data
```

---

## Przykładowy config.json (TST)

```json
{
  "server": {
    "apiURL": "http://127.0.0.1:8180/hellopoland/v1",
    "host": "0.0.0.0"
  },
  "public": {
    "axios": {
      "baseURL": "http://145.239.133.29:8300/api/v1/partner"
    },
    "iconBaseURL": "http://127.0.0.1:8180/hellopoland/v1/static/icons",
    "availableTicketsURL": "http://127.0.0.1:8180/hellopoland/v1/market/sight-events/:id/available-tickets?date=:date",
    "baseAffiliationURL": "https://hello-mazovia.pl/oferty",
    "name": "Hello! Poland – Partner (TST)",
    "brandName": "Hello! Poland"
  }
}
```

---

## Docker

### Obraz

```
hp-partner-web:1.6.2
```

### Uruchomienie kontenera (TST)

```
docker run -d --name hello_poland_partner_tst \
  -p 127.0.0.1:8301:3000 \
  -e NODE_ENV=production \
  -e CONFIG_PATH=/data/config.json \
  -v /srv/partner/tst:/data \
  -v /var/lib/docker/volumes/HELLO_DMS_TST/_data:/DMS:rw \
  --restart unless-stopped \
  hp-partner-web:1.6.2
```

---

## nginx (reverse proxy)

```
server {
  listen 8300;
  server_name _;

  location / {
    proxy_pass http://127.0.0.1:8301/;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:8180/hellopoland/;
  }
}
```

---

## Dostęp (TST)

- UI: http://145.239.133.29:8300/
- API: http://145.239.133.29:8300/api/v1/partner/

---

## SSL

Na TST pracujemy na **HTTP (IP)**.  
SSL zostanie dodany po pojawieniu się domen TST.

---

## Status

✔ Partner Web działa poprawnie na TST
