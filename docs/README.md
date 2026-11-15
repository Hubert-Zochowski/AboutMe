# Dokumentacja projektu

Przy powrocie do prac zacznij od [punktu wznowienia](RESUME.md).

Dokumentacja rozdziela obecne działanie strony od pomysłów na jej rozwój.

```text
docs/
├── README.md
├── current/
│   └── README.md                  # Obecne funkcje, budowa i utrzymanie
└── planned/
    ├── README.md                  # Lista planów i zasady ich opisywania
    ├── TEMPLATE.md                # Szablon kolejnej funkcjonalności
    └── 001-nowa-funkcjonalnosc.md  # Miejsce na pierwszy opis
```

## Jak korzystać

1. Opisz pomysł w [pierwszym pliku funkcjonalności](planned/001-nowa-funkcjonalnosc.md).
2. Dla kolejnych pomysłów skopiuj [szablon](planned/TEMPLATE.md) do pliku `002-nazwa-funkcjonalnosci.md` itd.
3. Dodaj odnośnik i status do [listy planowanych funkcjonalności](planned/README.md).
4. Po wdrożeniu zaktualizuj [aktualną dokumentację](current/README.md), a opisowi funkcjonalności nadaj status `Wdrożone`.

Opis pomysłu nie oznacza zgody na jego wdrożenie. Otwarte pytania i zakres należy uzgodnić przed rozpoczęciem prac.
