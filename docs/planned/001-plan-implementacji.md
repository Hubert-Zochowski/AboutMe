# 001 — Plan implementacji wydania 1

Status: w realizacji — etap 0, część lokalna. [Zakres](001-nowa-funkcjonalnosc.md), [architektura](001-architektura.md).

## Postęp 2026-11-15

Utworzono gałąź `feature/content-management` z aktualnego `origin/main`. Użytkownik ograniczył bieżące prace do części lokalnej. Przygotowano lokalnego Workera, bazę D1, kod logowania i sesji oraz ekran panelu. Przeszło 14 testów, kontrola TypeScript, migracja D1, dry-run budowania i kontrola HTTP. Emulator D1 zapisał i odczytał BLOB 524288 bajtów; rekord testowy następnie usunięto.

Rzeczywiste logowanie GitHub, plan Cloudflare, produkcyjny budżet CPU i publikacja Pages nie zostały zweryfikowane. Etap 0 jako całość pozostaje otwarty; nie rozpoczęto migracji danych publicznej strony. [Instrukcja lokalna i ograniczenia](../current/local-development.md).

## Etap 0 — Próba integracji i kosztów

- [x] Przygotować Node.js LTS, menedżer pakietów i Wrangler; sekrety poza Git.
- [ ] Potwierdzić Workers Free i D1 Free dla konta, bez wymaganej płatnej subskrypcji.
- [ ] Skonfigurować testową GitHub App i allowlistę user ID na repozytorium próbnym.
- [ ] Sprawdzić logowanie na komputerze i telefonie, sesję, wylogowanie, odmowę obcemu kontu.
- [ ] Przetestować prywatny zapis i odczyt obrazu 512 KiB oraz budżet CPU Workera.
- [ ] Utworzyć jeden commit JSON + obrazu i potwierdzić rzeczywiste wdrożenie Pages dla SHA.
- [ ] Sprawdzić reguły docelowej gałęzi main i wymagane uprawnienia bez zmiany ochrony.
- [ ] Potwierdzić odtwarzanie stanu operacji po zamknięciu panelu.

Rezultat: działający dowód ścieżki login → prywatny szkic → commit → Pages. Jeśli darmowe limity lub integracja przeszkadzają, skorygować architekturę przed budową panelu.

## Etap 1 — Dane i wspólne komponenty

- [ ] Schematy wszystkich typów treści, trwałe ID, wersja danych i walidacja.
- [ ] Jednorazowa migracja data.js do JSON z porównaniem liczby rekordów i zawartości.
- [ ] Wydzielenie rendererów i stylów współdzielonych przez stronę i podgląd.
- [ ] Obsługa błędu ładowania danych, adresy względne pod /AboutMe/.
- [ ] Regresja nawigacji, filtrów, sortowania, statystyk i rankingu.

Rezultat: dotychczasowa publiczna strona działa przez HTTP bez zmiany treści, a dane są walidowalne bez wykonywania JS.

## Etap 2 — Prywatny panel i API

- [ ] Migracje D1: szkice, sesje, obrazy, publikacje.
- [ ] Szkielet responsywnego panelu, nawigacja między typami treści i listy opublikowanych rekordów.
- [ ] Logowanie GitHub, allowlista, wygasanie sesji i wylogowanie.
- [ ] Autoryzacja endpointów, CSRF/Origin, limity żądań, bezpieczne błędy i prywatne odpowiedzi bez cache.
- [ ] Odczyt opublikowanego snapshotu bez tworzenia szkiców wszystkich wpisów.

Rezultat: wyłącznie administrator ma dostęp do prywatnych danych; strona publiczna nie wymaga API panelu.

## Etap 3 — Biblioteka od formularza do publikacji

- [ ] Lista, wyszukiwanie, filtr kategorii i oznaczenie szkic/opublikowane/zmiany robocze.
- [ ] Formularz tytułu, autora, kategorii, oceny, daty, opisu i adresów.
- [ ] Zapis szkicu, komunikat stanu zapisu, ostrzeżenie o opuszczeniu formularza.
- [ ] Prywatny podgląd aktualnej treści i efektu dla statystyk/rankingu.
- [ ] Publikacja jednego wpisu: ID operacji, snapshot, blokada, atomowy commit i status wdrożenia.
- [ ] Bezpieczne ponawianie błędu, zachowanie nowszej edycji i wznowienie odczytu statusu.
- [ ] Oddzielne potwierdzane usuwanie szkicu i wpisu publicznego; bez kosza.

Rezultat: pełna ścieżka działa z telefonu, początkowo bez uploadu, z pustą okładką lub URL. Opublikowanie jednego z dwóch szkiców nie ujawnia drugiego.

## Etap 4 — Obrazy

- [ ] Wybór pliku, podgląd, limity, skalowanie i kodowanie w przeglądarce.
- [ ] Walidacja na API, prywatny BLOB, metadane i odczyt tylko z sesją.
- [ ] Obraz i treść w jednym commicie, adres z hashem, obsługa błędu obrazu.
- [ ] Łączny limit magazynu, porządkowanie nieużywanych zasobów z ochroną aktywnych operacji.
- [ ] Test zdjęć z telefonu, HEIC/nieobsługiwanego formatu, zbyt dużego i uszkodzonego pliku, przerwanego przesyłania.

Rezultat: roboczy obraz pozostaje prywatny, opublikowany działa z Pages bez Workera.

## Etap 5 — Projekty, cytaty, profil i kontakt

- [ ] Projekty: lista, tytuł, okres, rola, opis, link.
- [ ] Cytaty: lista, treść, autor.
- [ ] Profil: dane autora, powitanie, biografia, dłuższy opis, zdjęcie.
- [ ] Kontakt: e-mail, dodawanie/edycja/usuwanie linków społecznościowych jako części profilu.
- [ ] Ponowne wykorzystanie zapisu, walidacji, podglądu, publikacji i potwierdzeń usuwania.

Rezultat: wszystkie uzgodnione typy obsługiwane przez panel. Profil/kontakt są publikowane razem; nie usuwamy całego profilu.

## Etap 6 — Testy, uruchomienie i dokumentacja

- [ ] Testy jednostkowe schematów, dat, ocen, średniej/rankingu i nakładania pojedynczej zmiany na publiczny snapshot.
- [ ] Testy integracyjne API: obce konto, brak sesji, CSRF, prywatne obrazy, zapis szkicu, idempotencja, usuwanie.
- [ ] Błędy publikacji: utrata odpowiedzi po commicie, timeout Pages, druga operacja w toku, powrót do panelu, nowszy szkic w trakcie wdrożenia.
- [ ] Testy przeglądarkowe pełnej ścieżki, wszystkich typów treści, telefonu, klawiatury, wygasłej sesji i utraty połączenia.
- [ ] Sprawdzenie braku szkiców i sekretów w publicznych plikach, repozytorium, logach i URL podglądu.
- [ ] Kopia danych przed migracją produkcyjną i instrukcja awaryjnego cofnięcia commita przez opiekuna repozytorium, bez funkcji przywracania w panelu.
- [ ] Wdrożenie panelu/API, kontrolowana publikacja produkcyjna i sprawdzenie strony Pages.
- [ ] Instrukcja obsługi, konfiguracja sekretów, limity, utrzymanie i aktualizacja docs/current.

Rezultat: spełnione i sprawdzone kryteria specyfikacji. Dopiero wtedy status Wdrożone.

## Kolejność i zależności

**0 → 1 → 2 → 3 → 4 → 5 → 6.** Najpierw potwierdzamy najtrudniejszą integrację i koszty, potem zabezpieczamy dane. Pełna ścieżka biblioteki poprzedza rozbudowę wszystkich formularzy. Funkcje kolejnego wydania nie są częścią tych zadań.
