# Aktualna dokumentacja projektu

Lokalny fundament nowego panelu i instrukcja uruchomienia: [rozwój panelu](local-development.md). Poniższy opis dotyczy obecnie publicznej strony; panel nie jest jeszcze wdrożony.

## Przeznaczenie

AboutMe to osobista strona prezentująca profil autora, projekty oraz bibliotekę książek, filmów i seriali wraz z ocenami i statystykami.

## Obecne funkcjonalności

- **O mnie:** zdjęcie lub placeholder, powitanie, krótka biografia, dłuższy opis oraz losowy cytat.
- **Projekty:** karty z tytułem, okresem, rolą, opisem i opcjonalnym linkiem.
- **Biblioteka:** wyszukiwanie po tytule lub autorze, filtrowanie po kategorii, sortowanie po dacie lub ocenie oraz rozwijanie długich opisów.
- **Statystyki:** wybór roku, liczniki kategorii i łącznej liczby pozycji.
- **Ranking roczny:** pozycje uporządkowane według ocen, wspólne miejsca przy remisach, średnia ocena i liczba ocen. Przy tej samej ocenie najnowsze pozycje są wyświetlane najpierw.
- **Kontakt:** adres e-mail i odnośniki do profili społecznościowych.
- **Interfejs:** układ responsywny, animacje uwzględniające ograniczenie ruchu, obsługa klawiatury i etykiety dla czytników ekranu.

## Budowa i pliki

Strona działa w przeglądarce bez frameworka, procesu budowania, serwera aplikacyjnego i bazy danych.

| Plik lub katalog | Przeznaczenie |
| --- | --- |
| `index.html` | Struktura strony, style CSS i logika JavaScript |
| `data.js` | Dane udostępniane jako `window.myAppConfig` |
| `me.jpg` | Lokalny plik zdjęcia; wyświetlany obraz wskazuje konfiguracja profilu |
| `.agents/skills/` | Lokalne umiejętności agenta, w tym `grilling` |
| `docs/current/` | Opis wdrożonego działania |
| `docs/planned/` | Opisy pomysłów, uzgodniony zakres i kryteria akceptacji |

## Dane

Konfiguracja w `data.js` zawiera:

- `profile`: dane autora, zdjęcie, opisy, e-mail i linki społecznościowe;
- `projects`: lista projektów;
- `items`: pozycje biblioteki z identyfikatorem, tytułem, kategorią, oceną, datą oraz opcjonalnym autorem, obrazem, opisem i linkiem;
- `quotes`: cytaty i ich autorzy.

Kategorie biblioteki to `book`, `movie` i `series`. Daty należy zapisywać jako `YYYY-MM-DD`, a oceny jako liczby od 0 do 10. Ranking i średnia uwzględniają wyłącznie prawidłowe oceny liczbowe z wybranego roku. Lista lat obejmuje lata danych oraz bieżący rok; domyślnie wybrany jest bieżący rok.

Teksty kart są wstawiane przez DOM i `textContent`. Adresy odnośników i obrazów są sprawdzane przed użyciem. Wyszukiwanie aktualizuje wyniki po 180 ms przerwy w pisaniu; okładki są ładowane leniwie.

## Uruchomienie i publikacja

Otwórz `index.html` w przeglądarce lub użyj lokalnego serwera, np. Live Server w VS Code. Zmiany danych wprowadzaj w `data.js`.

Strona jest publikowana w GitHub Pages z gałęzi `main`, z głównego katalogu repozytorium:

https://hubert-zochowski.github.io/AboutMe/

## Weryfikacja zmian

Po zmianie sprawdź nawigację, wyszukiwanie, filtry, sortowanie, rozwijanie opisów, obrazy i linki. Dla statystyk sprawdź różne lata, remisy w rankingu oraz rok bez ocen. Zweryfikuj widok telefonu, obsługę klawiatury i brak błędów w konsoli.

Projekt nie ma skonfigurowanego zestawu automatycznych testów. Kontrola struktury HTML nie zastępuje sprawdzenia działania w przeglądarce.
