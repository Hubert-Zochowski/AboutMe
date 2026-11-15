# Punkt wznowienia — panel zarządzania treścią

Data przerwy: 2026-11-15. Gałąź: `feature/content-management`.

## Gdzie skończyliśmy

Użytkownik uruchomił lokalny panel i potwierdził wynik `PASS` polecenia `check:local`. Następnym krokiem jest utworzenie GitHub App i konfiguracja prawdziwego logowania lokalnego. Utworzenie aplikacji nie zostało jeszcze potwierdzone. Nie zakładać, że istnieje ani że skonfigurowano sekrety.

Prace zostały wstrzymane na prośbę użytkownika. Po powrocie zacząć od tego punktu, bez powtarzania wywiadu wymagań i przygotowania środowiska.

## Wykonane działania

- Zainstalowano lokalnie skill Matta Pococka `grilling` w `.agents/skills/grilling`.
- Utworzono strukturę aktualnej dokumentacji, planowanych funkcjonalności i szablon kolejnych opisów.
- Uzgodniono zakres wydania 1, przygotowano architekturę oraz uporządkowaną listę zadań.
- Utworzono gałąź `feature/content-management` z aktualnego `origin/main`.
- Przygotowano Node.js 24 LTS lokalnie w ignorowanym `.tools`, przypięte zależności npm, TypeScript i Wrangler.
- Dodano lokalnego Workera, początkowy ekran panelu, migrację D1, kod logowania GitHub, sesje oraz ochronę dostępu.
- Dodano testy i instrukcję uruchamiania; zweryfikowano lokalny zapis BLOB 512 KiB w emulatorze D1.
- Nie zmieniono publicznych `index.html` i `data.js`, nie wykonano migracji danych ani wdrożenia panelu.

## Uzgodniony kierunek

Jeden administrator logowany przez GitHub. Formularze na komputerze i telefonie dla biblioteki, projektów, cytatów, profilu i kontaktu. Prywatne szkice, ręczny zapis, podgląd bieżącej treści i publikacja pojedynczego wpisu. Upload okładki/zdjęcia lub URL. Usuwanie z potwierdzeniem, bez kosza. Publiczna strona pozostaje na GitHub Pages i działa niezależnie od panelu. Brak obowiązkowego abonamentu. Dalsze funkcje dopiero w kolejnym wydaniu.

Na razie użytkownik wybrał **wyłącznie lokalne przygotowanie**, bez konfiguracji usług Cloudflare. Prawdziwy login GitHub można sprawdzić lokalnie. Zdalna próba publikacji i konfiguracja Cloudflare pozostają kolejnymi krokami wymagającymi wznowienia tego zakresu przez użytkownika.

## Następna czynność: GitHub App

Ostatnia przekazana instrukcja: wejść na `https://github.com/settings/apps/new` i utworzyć aplikację:

- unikalna nazwa, np. `AboutMe Content Admin Hubert`;
- Homepage URL: `http://localhost:8787`;
- Callback URL: `http://localhost:8787/auth/callback`;
- webhook wyłączony;
- instalacja tylko na własnym koncie;
- na pierwszy test logowania bez dodatkowych uprawnień repozytorium.

Po potwierdzeniu utworzenia aplikacji przygotować ignorowany `worker/.dev.vars` na podstawie `worker/.dev.vars.example`: `APP_ORIGIN`, numeryczny `ADMIN_GITHUB_USER_ID`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`. Użytkownik wpisuje sekret lokalnie — nie przesyła go w czacie ani nie dodaje do Git. Sprawdzić login właściwego konta, odmowę obcemu kontu, wylogowanie i wygaśnięcie sesji. Następnie wrócić do otwartych zadań etapu 0.

## Uruchomienie po powrocie

Z katalogu projektu, przy istniejącym lokalnym Node.js:

```powershell
.\scripts\npm-local.cmd run db:migrate:local
.\scripts\npm-local.cmd run dev:admin
```

Panel: `http://localhost:8787`. W drugim terminalu:

```powershell
.\scripts\npm-local.cmd run check:local
```

Brak konfiguracji logowania oznacza oczekiwane `503 not_configured` na prywatnych trasach. Nie dodawać obejścia autoryzacji. Po sklonowaniu repozytorium trzeba zainstalować Node.js 24 LTS i zależności (`npm.cmd ci`); `.tools`, `node_modules`, lokalna baza i sekrety nie są wersjonowane.

## Wyniki weryfikacji

- 14 testów kodu API na SQLite: poprawne.
- TypeScript: poprawny.
- Migracja lokalnego D1 i dry-run budowania: poprawne.
- HTTP panelu, zasoby, nagłówki i blokowanie prywatnego API: poprawne.
- Zapis/odczyt 524288 bajtów w emulatorze D1: poprawny; próbny rekord usunięty.
- Użytkownik potwierdził własny `PASS` kontroli lokalnej.

Nie sprawdzono prawdziwego OAuth GitHub, logowania na telefonie, produkcyjnego budżetu CPU, planu Cloudflare ani publikacji przez GitHub App na Pages. Formularze, upload i publikacja nie są jeszcze zaimplementowane.

## Dokumenty do dalszej pracy

- [Instrukcja lokalna](current/local-development.md)
- [Zakres i kryteria akceptacji](planned/001-nowa-funkcjonalnosc.md)
- [Architektura](planned/001-architektura.md)
- [Plan implementacji i postęp](planned/001-plan-implementacji.md)
