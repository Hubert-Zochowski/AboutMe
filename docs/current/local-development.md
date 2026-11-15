# Lokalne przygotowanie panelu treści

Gałąź: `feature/content-management`. To fundament etapu 0, nie gotowy CMS. Publiczny `index.html` i `data.js` nie zostały zmienione w tym etapie.

## Co jest gotowe

- Konfiguracja lokalnego Workera ze statycznym ekranem panelu i bazą D1.
- Migracja tabel szkiców, obrazów, sesji, stanów OAuth, operacji publikacji i blokady publikacji.
- Kod logowania GitHub z kontrolą jednego user ID, jednorazowym stanem OAuth i sesją przechowywaną jako hash.
- Ochrona prywatnych tras, ciasteczka sesji, kontrola Origin przy wylogowaniu, nagłówki bezpieczeństwa i odpowiedzi bez prywatnych szczegółów błędu.
- Testy kodu API na SQLite, kontrola TypeScript, próbne budowanie i kontrola lokalnego HTTP.

Formularze, zapis szkiców przez API, upload i publikacja nie są jeszcze zaimplementowane. Tabele przygotowują kontrakt tych funkcji. Nie ma trybu omijającego logowanie. Testy wstrzykują sesje wyłącznie do bazy testowej w pamięci.

## Narzędzia

Wymagany Node.js 24 LTS i npm. Zależności są przypięte w `package-lock.json`. Wrangler wymaga wspieranego systemu, w tym Windows 11; instalację sprawdzono na Windows 11.

W tym środowisku pobrano przenośny Node.js z oficjalnej dystrybucji i sprawdzono SHA-256. Jest w ignorowanym `.tools/`, bez zmiany systemowego PATH. Możesz użyć:

```powershell
.\scripts\npm-local.cmd ci
.\scripts\npm-local.cmd run db:migrate:local
.\scripts\npm-local.cmd run dev:admin
```

Jeśli masz Node.js 24 LTS w PATH, użyj zwykłego `npm.cmd` zamiast `scripts\npm-local.cmd`. Skrypt lokalny nie zmienia polityki wykonywania PowerShell ani ustawień systemu.

Panel: `http://localhost:8787`. Zakończenie serwera: `Ctrl+C`. Lokalna baza jest w `worker/.wrangler/` i nie jest wersjonowana. Nie uruchamiaj statycznej strony głównej przez ten serwer — serwuje on wyłącznie katalog `admin`.

## Sprawdzanie

```powershell
.\scripts\npm-local.cmd test
.\scripts\npm-local.cmd run check
.\scripts\npm-local.cmd run build:worker
```

Przy działającym lokalnym serwerze, z drugiego terminala:

```powershell
.\scripts\npm-local.cmd run check:local
```

Testy OAuth używają symulowanych odpowiedzi GitHuba i prawdziwej bazy SQLite w pamięci. Nie potwierdzają zdalnego logowania, kosztu CPU na Workers Free ani wdrożenia Pages. Test magazynu sprawdza 512 KiB, ale nie jest testem gotowego uploadu obrazów.

## Brak konfiguracji logowania

Bez konfiguracji ekran informuje o gotowym panelu i bazie. Prywatne endpointy oraz `/auth/login` zwracają `503 not_configured`. To oczekiwane zachowanie; nie dodawaj publicznego obejścia autoryzacji dla wygody testowania.

Opcjonalnie skopiuj `worker/.dev.vars.example` do ignorowanego `worker/.dev.vars`. Wypełnia się tam origin, numeryczne ID administratora i dane klienta GitHub App. Nie umieszczaj sekretów w czacie, Git, plikach publicznych ani `wrangler.jsonc`.

Realne logowanie wymaga rejestracji GitHub App z callbackiem dokładnie `http://localhost:8787/auth/callback`. Dane konfiguracyjne dotyczą kolejnej próby zdalnej; nie trzeba ich podawać do testów lokalnych. Parametr `APP_ORIGIN` musi odpowiadać adresowi otwieranemu w przeglądarce. Sesje produkcyjne wymagają HTTPS.

## Przed zdalnym etapem 0

Pozostają: konto Cloudflare i potwierdzenie darmowego planu, rejestracja/instalacja GitHub App, prawdziwy test konta administratora i obcego konta, budżet CPU Workera oraz atomowy commit i identyfikacja wdrożenia Pages. Zgodnie z decyzją użytkownika nie wykonywano zdalnej konfiguracji.

Plik `worker/wrangler.jsonc` ma celowo pusty identyfikator lokalnej bazy oraz wyłączone publiczne adresy Worker/preview. Nie jest konfiguracją gotową do publikacji. Skrypt `build:worker` używa wyłącznie `--dry-run`. Nie dodano automatycznych wdrożeń.

Źródła: [instalacja Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), [Node.js](https://nodejs.org/en/download).
