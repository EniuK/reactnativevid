# TWG Video App

Aplikacja do nauki oparta na YouTube, zbudowana z użyciem React Native, Expo i TypeScript. Umożliwia przeglądanie, wyszukiwanie i odtwarzanie filmów edukacyjnych z YouTube.

## Wymagania

- **Node.js** 18 lub nowszy
- **npm** lub **yarn**
- **Expo CLI** (zainstalowany globalnie lub przez npx)
- **YouTube Data API v3 Key** - wymagany do działania aplikacji

### Opcjonalnie (do uruchomienia na urządzeniach):

- **iOS**: Xcode (tylko na macOS)
- **Android**: Android Studio

## Instalacja

1. **Sklonuj repozytorium** (lub pobierz projekt)

```bash
git clone <repository-url>
cd twg-video-app
```

2. **Zainstaluj zależności**

```bash
npm install
```

lub jeśli używasz yarn:

```bash
yarn install
```

## Konfiguracja środowiska

Aplikacja wymaga klucza API YouTube do działania. Wykonaj następujące kroki:

1. **Utwórz plik `.env` w głównym katalogu projektu**

```bash
touch .env
```

2. **Dodaj do pliku `.env` następującą linię:**

```env
YOUTUBE_API_KEY=twoj_klucz_api_youtube
```

3. **Jak uzyskać klucz YouTube Data API v3:**

   - Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
   - Utwórz nowy projekt lub wybierz istniejący
   - Włącz **YouTube Data API v3** dla swojego projektu
   - Przejdź do **Credentials** (Poświadczenia) i utwórz **API Key**
   - Skopiuj wygenerowany klucz i wklej go do pliku `.env`

**Przykładowy plik `.env`:**

```env
YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Ważne:** Plik `.env` jest ignorowany przez Git (zgodnie z `.gitignore`), więc nie zostanie przypadkowo wysłany do repozytorium.

## Uruchomienie aplikacji

### Tryb deweloperski (Expo Go)

Najprostszy sposób na uruchomienie aplikacji:

```bash
npm start
```

lub:

```bash
npx expo start
```

Następnie:
- **iOS**: Naciśnij `i` w terminalu lub zeskanuj kod QR w aplikacji Expo Go
- **Android**: Naciśnij `a` w terminalu lub zeskanuj kod QR w aplikacji Expo Go

### Bezpośrednie uruchomienie na iOS

```bash
npm run ios
```

lub:

```bash
npx expo start --ios
```

**Wymaga:** Xcode zainstalowany na macOS

### Bezpośrednie uruchomienie na Android

```bash
npm run android
```

lub:

```bash
npx expo start --android
```

**Wymaga:** Android Studio z uruchomionym emulatorem lub podłączone urządzenie z włączonym trybem deweloperskim

### Uruchomienie na Web

```bash
npm run web
```

lub:

```bash
npx expo start --web
```

## Rozwiązywanie problemów

### Błąd: "YOUTUBE_API_KEY environment variable is not set"

- Upewnij się, że plik `.env` istnieje w głównym katalogu projektu
- Sprawdź, czy klucz API jest poprawnie wpisany w pliku `.env` (bez spacji, bez cudzysłowów)
- Jeśli błąd nadal występuje, zrestartuj serwer deweloperski (`npm start`)

### Problemy z cache

Jeśli napotkasz nieoczekiwane błędy, wyczyść cache:

```bash
npx expo start --clear
```

### Problemy z zależnościami

Jeśli masz problemy z instalacją zależności:

```bash
rm -rf node_modules
npm install
```

## Struktura projektu

```
twg-video-app/
├── src/
│   ├── api/           # Integracja z YouTube API
│   ├── components/    # Komponenty UI (VideoCard, SearchInput, itp.)
│   ├── constants/     # Stałe (kategorie, itp.)
│   ├── navigation/    # Konfiguracja nawigacji
│   ├── screens/       # Ekrany aplikacji
│   └── types/         # Definicje TypeScript
├── assets/            # Obrazy, ikony
├── android/           # Natywny kod Android
├── ios/               # Natywny kod iOS
├── app.config.js      # Konfiguracja Expo
├── .env               # Zmienne środowiskowe (nie w Git)
└── package.json       # Zależności projektu
```

## Technologie

- **React Native** 0.81.5
- **Expo** ~54.0.31
- **TypeScript** ~5.9.2
- **React Navigation** (Native Stack & Bottom Tabs)
- **React Native Video** (beta) - odtwarzanie wideo
- **Axios** - żądania HTTP
- **YouTube Data API v3** - pobieranie danych wideo

## Licencja

Projekt prywatny - wszystkie prawa zastrzeżone.
