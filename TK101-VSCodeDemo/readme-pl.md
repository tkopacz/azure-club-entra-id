# TK101-VSCodeDemo

[English](readme.md) | [Polski](readme-pl.md)
[Powrót do opisu repozytorium](../README.md)

## Opis
To demo pokazuje surowy przepływ OAuth 2.0 z kodem autoryzacyjnym i PKCE wykonywany ręcznie przez zapytania HTTP. Najlepiej uruchamiać je w VS Code (rozszerzenie REST Client) lub w innym kliencie HTTP, aby zobaczyć każdy krok wymiany tokenów.

## Zawartość
- `demo.http` – kroki autoryzacji, wymiany tokenu oraz wywołania Microsoft Graph.
- `test.http` – plik do własnych eksperymentów z zapytaniami.

## Wymagania
- Tenant Microsoft Entra ID z możliwością rejestracji aplikacji.
- Rejestracja aplikacji jako klient publiczny (SPA lub native).
- VS Code z rozszerzeniem REST Client (opcjonalnie) lub inny klient HTTP.

## Konfiguracja
1. Zarejestruj aplikację publiczną w Entra ID.
2. Dodaj redirect URI `http://localhost/tk101-vscodedemo` (zgodny z `demo.http`).
3. Skopiuj **Application (client) ID**.
4. W pliku `demo.http` uzupełnij wartości (`client_id`, `redirect_uri`, `code_challenge`, `code_verifier`).

## Uruchomienie
1. Otwórz `demo.http` w VS Code.
2. Skopiuj adres autoryzacji i otwórz go w przeglądarce (najlepiej w trybie incognito).
3. Po zalogowaniu skopiuj parametr `code` z adresu przekierowania.
4. Wklej `code` do żądania tokenu i wyślij zapytanie.
5. Użyj zwróconego `access_token` w zapytaniach do Microsoft Graph z tego pliku.
