# 001 — Panel zarządzania treścią: wydanie 1

Status: w realizacji — rozpoczęto lokalną część etapu 0. Dalsze próby zdalne odłożone zgodnie z decyzją użytkownika.

- [Proponowana architektura](001-architektura.md)
- [Kolejność i szczegóły implementacji](001-plan-implementacji.md)

## Cel

Zarządzanie treścią strony z przeglądarki na komputerze i telefonie: formularz → prywatny szkic → podgląd → publikacja, bez ręcznej edycji kodu i operacji Git.

## Uzgodniony zakres

| Obszar | Wymaganie wydania 1 |
| --- | --- |
| Treści | Biblioteka książek, filmów i seriali, projekty, cytaty, profil i kontakt |
| Operacje | Dodawanie, edycja i usuwanie wpisów; edycja pojedynczego profilu |
| Dostęp | Jeden administrator, logowanie GitHub, kontrola konkretnego konta po stronie API |
| Urządzenia | Komputer i telefon |
| Szkice | Prywatne, ręczny zapis przyciskiem, ostrzeżenie o niezapisanych zmianach |
| Synchronizacja | Między urządzeniami nie jest wymagana; może wynikać ze wspólnego magazynu bez osobnego modułu |
| Wersje | Edycja wpisu publicznego tworzy szkic; poprzednia wersja pozostaje publiczna do publikacji |
| Publikacja | Pojedynczy wpis, bez publikowania pozostałych szkiców, bez ręcznego PR/merge |
| Podgląd | Układ publicznej strony z bieżącą, także niezapisaną treścią; biblioteka uwzględnia statystyki i ranking |
| Tekst | Zwykły tekst, zachowanie podziałów linii i akapitów |
| Obrazy | Upload z urządzenia lub URL; jedna okładka pozycji biblioteki, jedno zdjęcie profilowe |
| Usuwanie | Potwierdzenie wskazujące wpis; bez kosza i przywracania z panelu |
| Hosting | Publiczna strona pozostaje na GitHub Pages |
| Koszty | Brak obowiązkowego abonamentu; dopuszczona dodatkowa usługa w darmowym planie |
| Czas publikacji | Kilka minut jest akceptowalne; panel odróżnia zapis od wdrożenia |
| Odporność | Publiczna strona działa podczas awarii panelu i logowania |
| Edycja ręczna | Osobny proces ręcznej edycji oraz interfejs rozwiązywania konfliktów nie są potrzebne |

## Przebieg pracy

1. Administrator loguje się przez GitHub i wybiera rodzaj treści.
2. Tworzy wpis lub edytuje istniejący, korzystając z formularza.
3. Ogląda podgląd i zapisuje szkic albo publikuje bieżącą treść.
4. Publikacja waliduje i utrwala aktualny formularz, następnie aktualizuje wyłącznie wybrany rekord publiczny.
5. Panel pokazuje stan operacji i potwierdzenie wdrożenia; inne szkice pozostają prywatne.

## Kryteria akceptacji

- [ ] Obce konto i użytkownik niezalogowany nie odczytają szkiców ani obrazów roboczych i nie zmienią treści przez API.
- [ ] Wszystkie uzgodnione typy treści są obsługiwane bez edycji plików i ręcznego Git.
- [ ] Szkice przetrwają zamknięcie przeglądarki; panel ostrzega o niezapisanych zmianach tam, gdzie pozwala przeglądarka.
- [ ] Szkice i robocze obrazy nie trafiają do publicznego repozytorium, Pages, adresów podglądu ani logów.
- [ ] Publikacja jednego wpisu nie publikuje pozostałych szkiców.
- [ ] Edycja szkicu nie zmienia dotychczasowej publicznej wersji.
- [ ] Podgląd pokazuje bieżący formularz; statystyki i ranking uwzględniają efekt tej pojedynczej publikacji.
- [ ] Upload i URL działają; błędny format i zbyt duży obraz dają czytelny błąd.
- [ ] Usuwanie wymaga potwierdzenia; usunięcie szkicu edycji nie usuwa publicznej wersji.
- [ ] Błąd publikacji zachowuje szkic; ponowienie nie tworzy duplikatów.
- [ ] Sukces oznacza wdrożenie właściwego commita, nie sam zapis w repozytorium.
- [ ] Panel działa na telefonie i z klawiatury, a błędy pól są opisane.
- [ ] Awaria panelu nie zatrzymuje publicznej strony.

## Poza wydaniem 1

Import zbiorczy, automatyczne metadane i okładki, harmonogram publikacji, bogaty edytor, galerie i zdjęcia projektów, wielu redaktorów, role, automatyczny zapis, kosz, przywracanie w panelu, interfejs rozwiązywania konfliktów. Dalsze funkcje otrzymają osobne specyfikacje kolejnego wydania.

## Status decyzji technicznych

Cloudflare, model GitHub App, limity obrazów i struktura plików to rekomendacje techniczne do zweryfikowania w pierwszym etapie, nie wcześniejsze decyzje użytkownika. Dokumentacja obecnego działania pozostaje niezmieniona do wdrożenia.
