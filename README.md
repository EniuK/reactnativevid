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

## Rozwiązane problemy techniczne

Podczas rozwoju aplikacji napotkaliśmy kilka problemów technicznych. Poniżej opisane są główne wyzwania i zastosowane rozwiązania:

### 1. Wykrywanie połączenia internetowego

**Problem:** Biblioteka `NetInfo` zwracała `isInternetReachable` jako `null` na niektórych platformach, co powodowało fałszywe negatywne wyniki sprawdzania połączenia.

**Rozwiązanie:** 
- Zmodyfikowano logikę sprawdzania połączenia w `src/api/youtubeApi.ts`
- Użyto `isConnected === true` jako głównego sprawdzenia
- `isInternetReachable` jest traktowane jako sprawdzenie pomocnicze (tylko `false` jest traktowane jako brak połączenia)
- Jeśli `NetInfo.fetch()` rzuca błąd, zakładamy, że połączenie jest dostępne i pozwalamy API obsłużyć potencjalne błędy

### 2. Cache klucza API

**Problem:** Klucz API był cachowany w pamięci, co uniemożliwiało aktualizację po zmianie w pliku `.env` bez restartu aplikacji.

**Rozwiązanie:**
- Usunięto zmienną `cachedApiKey` z `src/api/youtubeApi.ts`
- Klucz API jest teraz odczytywany bezpośrednio z `Constants.expoConfig.extra.youtubeApiKey` przy każdym wywołaniu API
- Zapewnia to, że zmiany w pliku `.env` są natychmiast widoczne po restarcie serwera deweloperskiego

### 3. Fallback query w wyszukiwaniu

**Problem:** Wyszukiwarka używała domyślnego zapytania `'programming tutorial'` gdy użytkownik nie wpisał tekstu, co prowadziło do wyświetlania nieistotnych wyników.

**Rozwiązanie:**
- Usunięto fallback query z funkcji `searchVideos`
- Dodano walidację: jeśli `query` jest pusty, funkcja zwraca pustą tablicę
- Tylko wyraźnie wprowadzone przez użytkownika zapytania są używane do wyszukiwania

### 4. Renderowanie miniaturek na Androidzie

**Problem:** Miniatury filmów nie ładowały się poprawnie na Androidzie, wydawało się, że są zakryte przez `z-index`.

**Rozwiązanie:**
- Usunięto `position: 'relative'` z kontenera miniaturki
- Zmieniono `resizeMode` z `"contain"` na `"cover"` dla lepszego wypełnienia
- Dodano właściwości `zIndex` do kontenera i miniaturki dla poprawnego renderowania warstw na Androidzie

### 5. Kontrolki pełnoekranowe w odtwarzaczu wideo

**Problem:** W trybie pełnoekranowym nie było możliwości wyjścia z pełnego ekranu ani kontrolowania odtwarzania (pause/skip).

**Rozwiązanie:**
- Dodano stan `isFullscreen` do śledzenia trybu pełnoekranowego
- Zaimplementowano event listeners (`onFullscreenPlayerWillPresent`, `onFullscreenPlayerWillDismiss`)
- W trybie pełnoekranowym włączono natywne kontrolki (`controls={true}`), które zapewniają wszystkie opcje (play/pause, seek, volume, exit fullscreen)
- Niestandardowe kontrolki są ukrywane w trybie pełnoekranowym, aby uniknąć konfliktów

### 6. Błąd TypeScript w stylach wideo

**Problem:** TypeScript zgłaszał błąd typu dla tablicy stylów zawierającej wartości `false` (gdy warunek był fałszywy).

**Rozwiązanie:**
- Użyto `.filter(Boolean)` do usunięcia wartości falsy (`false`, `undefined`, `null`) z tablicy stylów
- Dodano `as any` dla tej konkretnej tablicy (React Native akceptuje takie tablice w runtime)
- Usunięto nieistniejące props `onFullscreenPlayerWillPresent` i `onFullscreenPlayerWillDismiss` z komponentu `VideoView`

### 7. Zarządzanie komponentami ikon

**Problem:** Każda ikona miała osobny plik `.tsx`, co prowadziło do duplikacji kodu i utrudniało utrzymanie.

**Rozwiązanie:**
- Skonsolidowano wszystkie ikony w jeden plik `src/components/SvgIcon.tsx`
- Wszystkie ikony używają bezpośrednio zawartości SVG z plików w `assets/icons/`
- Zaktualizowano wszystkie importy w aplikacji
- Usunięto cały katalog `src/components/icons/` z indywidualnymi plikami
- Zachowano wszystkie proporcje i `viewBox` z oryginalnych plików SVG

### 8. Pozycjonowanie timestamp w notatkach

**Problem:** Timestamp w notatkach nachodził na tekst notatki, co utrudniało czytelność.

**Rozwiązanie:**
- Zwiększono `paddingBottom` w stylu `noteText` z `4px` do `20px`
- Zwiększono `paddingRight` do `60px` dla zapewnienia miejsca na timestamp
- Timestamp jest pozycjonowany absolutnie w prawym dolnym rogu notatki
- Zapewniono wyraźną linię odstępu między tekstem a timestamp

## Struktura projektu

```
twg-video-app/
├── src/
│   ├── api/           # Integracja z YouTube API
│   ├── components/    # Komponenty UI (VideoCard, SearchInput, itp.)
│   ├── constants/     # Stałe (kategorie, itp.)
│   ├── hooks/         # Custom hooks (useNetworkState, itp.)
│   ├── navigation/    # Konfiguracja nawigacji
│   ├── screens/       # Ekrany aplikacji
│   └── types/         # Definicje TypeScript
├── assets/            # Obrazy, ikony SVG
├── android/           # Natywny kod Android
├── ios/               # Natywny kod iOS
├── app.config.js      # Konfiguracja Expo (dynamiczna z .env)
├── app.json           # Konfiguracja Expo (statyczna)
├── .env               # Zmienne środowiskowe (nie w Git)
└── package.json       # Zależności projektu
```

## Funkcjonalności

### Home Screen
- Cztery kategorie filmów: "React Native", "React", "TypeScript", "JavaScript"
- Poziome listy przewijane dla każdej kategorii
- Przycisk "Show more" dla każdej kategorii przekierowujący do Search Screen
- Pasek wyszukiwania w headerze przekierowujący do Search Screen

### Search Screen
- Wyszukiwanie filmów z YouTube Data API v3
- Lista wyników z miniaturką, tytułem i krótkim opisem
- Sortowanie wyników (latest, oldest, most popular)
- Lazy loading (początkowo 10 wyników, możliwość załadowania kolejnych)
- Każdy wynik jest klikalny i przekierowuje do Video Detail Screen

### Video Detail Screen
- Odtwarzacz wideo z `react-native-video` (fullscreen i minimized mode obsługiwane przez natywne kontrolki)
- Wyświetlanie tytułu, kanału i opisu filmu z API
- Zakładki Details/Notes:
  - **Details**: wyświetla pełny opis filmu
  - **Notes**: pozwala dodawać i edytować lokalnie przechowywane notatki do filmu
- Automatyczne zapisywanie notatek (z debounce 1 sekunda)
- Notatki są przechowywane lokalnie per video ID używając AsyncStorage

## Technologie

- **React Native** 0.81.5
- **Expo** ~54.0.31
- **TypeScript** ~5.9.2
- **React Navigation** (Native Stack & Bottom Tabs)
- **React Native Video** (beta) - odtwarzanie wideo
- **AsyncStorage** - lokalne przechowywanie notatek
- **Axios** - żądania HTTP
- **YouTube Data API v3** - pobieranie danych wideo

## Licencja

Projekt prywatny - wszystkie prawa zastrzeżone.
