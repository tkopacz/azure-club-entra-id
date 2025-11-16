# azure-club-entra-id

Zbiór przykładów demonstracyjnych dla Entra ID, TypeScript (SPA) i .NET

**Uwaga:** Poniższe przykłady są uproszczone i przeznaczone wyłącznie do celów demonstracyjnych. Nie są to implementacje referencyjne i nie stosują wszystkich najlepszych praktyk.

Początkowa wersja dla demonstracji przedstawionych podczas wydarzenia Azure Club w dniu 16 października 2025 roku.

## Spis treści

- [Przegląd projektu](#przegląd-projektu)
- [Wymagania wstępne](#wymagania-wstępne)
- [Struktura projektu](#struktura-projektu)
- [Demonstracje](#demonstracje)
  - [TK101-VSCodeDemo](#tk101-vscodedemo)
  - [TK102-SPA-TS](#tk102-spa-ts)
  - [TK201-NET-API](#tk201-net-api)
  - [TK202-SPA-TS-CALL-NET](#tk202-spa-ts-call-net)
  - [TK203-WebAppMVC](#tk203-webappmvc)
  - [TK301-SPA-OBO](#tk301-spa-obo)
- [Rozpoczęcie pracy](#rozpoczęcie-pracy)
- [Licencja](#licencja)

## Przegląd projektu

To repozytorium zawiera szereg demonstracji pokazujących integrację z Microsoft Entra ID (dawniej Azure Active Directory) w różnych scenariuszach aplikacyjnych:

- Aplikacje jednostronicowe (SPA) napisane w TypeScript
- Web API w .NET
- Aplikacje webowe MVC w ASP.NET Core
- Przepływ On-Behalf-Of (OBO) do delegowania uprawnień

Wszystkie przykłady pokazują nowoczesne podejście do uwierzytelniania i autoryzacji przy użyciu platformy tożsamości Microsoft.

## Wymagania wstępne

Aby uruchomić demonstracje zawarte w tym repozytorium, potrzebujesz:

- **.NET 8 SDK** lub nowszy
- **Node.js 18+** i npm
- **Dzierżawa Azure AD** (Microsoft Entra ID) z możliwością tworzenia rejestracji aplikacji
- **Visual Studio Code** (zalecane) lub inne IDE
- Podstawowa znajomość TypeScript, C# i ASP.NET Core

## Struktura projektu

```
azure-club-entra-id/
├── TK101-VSCodeDemo          # Demo podstawowe VS Code
├── TK102-SPA-TS              # Aplikacja SPA w TypeScript
├── TK201-NET-API             # Web API w .NET
├── TK202-SPA-TS-CALL-NET     # SPA TypeScript wywołujący .NET API
├── TK203-WebAppMVC           # Aplikacja webowa MVC
├── TK301-SPA-OBO             # Demo przepływu On-Behalf-Of
├── LICENSE                   # Licencja MIT
└── README.md                 # Dokumentacja w języku angielskim
```

## Demonstracje

### TK101-VSCodeDemo

Podstawowa demonstracja konfiguracji w Visual Studio Code. Zawiera pliki HTTP do testowania wywołań API.

**Zawartość:**
- `demo.http` - Przykładowe żądania HTTP
- `test.http` - Żądania testowe

### TK102-SPA-TS

Aplikacja jednostronicowa (Single Page Application) napisana w TypeScript z wykorzystaniem MSAL.js do uwierzytelniania użytkowników w Microsoft Entra ID.

**Technologie:**
- TypeScript
- MSAL.js (Microsoft Authentication Library)
- HTML/CSS

**Uruchomienie:**
```bash
cd TK102-SPA-TS
npm install
npm run serve
```

### TK201-NET-API

Web API w ASP.NET Core zabezpieczony przez Microsoft Entra ID.

**Technologie:**
- ASP.NET Core
- Microsoft.Identity.Web
- .NET 8

**Uruchomienie:**
```bash
cd TK201-NET-API
dotnet restore
dotnet run
```

### TK202-SPA-TS-CALL-NET

Demonstracja komunikacji między aplikacją SPA w TypeScript a zabezpieczonym Web API w .NET.

**Architektura:**
1. SPA uwierzytelnia użytkownika w Microsoft Entra ID
2. SPA otrzymuje token dostępu
3. SPA wywołuje zabezpieczone API przekazując token
4. API waliduje token i zwraca dane

**Uruchomienie:**
1. Uruchom API backend
2. Uruchom SPA frontend
3. Skonfiguruj odpowiednie CORS i ustawienia

### TK203-WebAppMVC

Aplikacja webowa MVC w ASP.NET Core z integracją Microsoft Entra ID dla uwierzytelniania użytkowników.

**Technologie:**
- ASP.NET Core MVC
- Microsoft.Identity.Web
- Razor Views

**Uruchomienie:**
```bash
cd TK203-WebAppMVC
dotnet restore
dotnet run
```

### TK301-SPA-OBO

Zaawansowana demonstracja przepływu On-Behalf-Of (OBO), który pozwala Web API działać w imieniu zalogowanego użytkownika.

**Architektura przepływu OBO:**
1. SPA uwierzytelnia użytkownika i otrzymuje token dla API
2. SPA wywołuje Web API przekazując token
3. Web API waliduje token użytkownika
4. API wymienia token na token Microsoft Graph używając przepływu OBO
5. API wywołuje Microsoft Graph `/me` endpoint
6. API zwraca dane profilu do SPA

**Szczegółowa dokumentacja:**
Zobacz [TK301-SPA-OBO/README.md](TK301-SPA-OBO/README.md) dla pełnej dokumentacji konfiguracji i uruchomienia.

**Komponenty:**
- `api` - ASP.NET Core Web API z Microsoft.Identity.Web
- `spa` - Aplikacja TypeScript z MSAL.js

## Rozpoczęcie pracy

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/tkopacz/azure-club-entra-id.git
cd azure-club-entra-id
```

### 2. Konfiguracja Azure App Registrations

Dla każdej demonstracji musisz utworzyć odpowiednie rejestracje aplikacji w portalu Azure:

1. Przejdź do [Azure Portal](https://portal.azure.com)
2. Otwórz **Microsoft Entra ID**
3. Wybierz **Rejestracje aplikacji** → **Nowa rejestracja**
4. Skonfiguruj aplikację zgodnie z wymaganiami konkretnej demonstracji

### 3. Konfiguracja ustawień

Każda demonstracja wymaga własnej konfiguracji. Ogólne kroki:

**Dla projektów .NET:**
- Zaktualizuj `appsettings.json` danymi swojej dzierżawy:
  ```json
  "AzureAd": {
    "TenantId": "<twój-tenant-id>",
    "ClientId": "<twój-client-id>",
    "ClientSecret": "<twój-client-secret>"
  }
  ```

**Dla projektów TypeScript/SPA:**
- Zaktualizuj konfigurację MSAL w plikach źródłowych:
  ```typescript
  export const msalConfig = {
    auth: {
      clientId: "<twój-client-id>",
      authority: "https://login.microsoftonline.com/<tenant-id>",
      redirectUri: "https://localhost:5173"
    }
  };
  ```

### 4. Uruchom wybraną demonstrację

Przejdź do katalogu wybranej demonstracji i postępuj zgodnie z instrukcjami uruchomienia opisanymi powyżej.

## Wskazówki bezpieczeństwa

⚠️ **Ważne uwagi dotyczące bezpieczeństwa:**

- **Nigdy nie commituj** kluczy tajnych (client secrets) do repozytorium
- Używaj **zmiennych środowiskowych** lub **Azure Key Vault** dla danych wrażliwych
- Te demonstracje są **wyłącznie do celów edukacyjnych**
- W środowisku produkcyjnym stosuj wszystkie najlepsze praktyki bezpieczeństwa
- Regularnie rotuj klucze tajne i certyfikaty

## Dodatkowe zasoby

- [Dokumentacja Microsoft Entra ID](https://learn.microsoft.com/azure/active-directory/)
- [Dokumentacja MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web)
- [Protokół OAuth 2.0 On-Behalf-Of](https://learn.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow)

## Licencja

Ten projekt jest dostępny na licencji MIT - zobacz plik [LICENSE](LICENSE) po szczegóły.

Copyright (c) 2025 Tomasz Kopacz

## Autor

**Tomasz Kopacz**

Prezentacja dla Azure Club - 16 października 2025

---

**English version:** See [README.md](README.md) for English documentation.
