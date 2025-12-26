/* PLIK DANYCH (data.js) */

window.myAppConfig = {
    profile: {
        name: "Hubert Żochowski",
        image: "https://github.com/Hubert-Zochowski/AboutMe/blob/main/me.jpg?raw=true", 
        welcomeMessage: "Cześć, miło mi Cię powitać na mojej stronie",
        // Krótkie bio pod zdjęciem
        bio: "Pasjonat technologii, ludzi i rozwoju osobistego. Specjalizuję się w rozwiązywaniu problemów i znajdowaniu dróg dotarcia do rezultatów",
        
        // --- NOWOŚĆ: DŁUŻSZY OPIS O TOBIE ---
        aboutMeExtended: `Jestem osobą, która uwielbia łączyć kropki między różnymi dziedzinami wiedzy. Na co dzień zajmuję się tworzeniem systemów informatycznych w branży farmaceutycznej. Zarządzam 30osobowym zespołem IT, który autonomicznie dostarcza wartość biznesową.
        
        W wolnym czasie nie tylko stawiam na rozwój osobisty, ale także na spędzanie czasu z moją rodziną. Poznaję siebie przy wsparciu mojej cudownej rodziny: żony Edytki i dzieci Agatki oraz Ksawerego`,
        
        buttonText: "Zobacz moją kolekcję",
        buttonText: "Przeglądaj listę",
        
        // --- NOWE DANE KONTAKTOWE ---
        email: "zochowski92@gmail.com",
        socialLinks: [
            { name: "LinkedIn", url: "https://www.linkedin.com/in/hubert-zochowski/" }
        ]
    },
// --- NOWOŚĆ: SEKJA PROJEKTY I OSIĄGNIĘCIA ---
    projects: [
        {
            title: "Testowanie i wdrażanie złożonych systemów IT",
            role: "Inżynier DevOps",
            year: "2019",
            description: "5 lat doświadczenia w tworzeniu i rozwijaniu skomplikowanych systemów informatycznych w dynamicznej i złożonej strukturze",
            link: "#" // Link do projektu (lub # jeśli brak)
        },
        {
            title: "Kierownik Działu Jakości Oprogramowania",
            role: "Manager",
            year: "2021",
            description: "Zarządzałem zespołem specjalistów IT zajmujących się dostarczaniem informacji o jakości rozwiązań ibformatycznych",
            link: "" 
        },
        {
            title: "Kierownik działu usług IT - Sprzedaż",
            role: "Manager",
            year: "2026",
            description: "Zarządzam 30osobowym zespołem specjalistów IT: analitycy, programiści, testerzy i administratorzy",
            link: "" 
        }
    ],
    items: [
        // --- NOWE POZYCJE (2025) ---
        {
            id: 10,
            title: "Rozmyślania",
            author: "Marek Aureliusz",
            category: "book",
            rating: 9,
            date: "2025-06-01",
            image: "", 
            description: `Ponadczasowa mądrość stoicka. Cesarz rzymski pisze sam do siebie o tym, jak radzić sobie z trudnościami, ludźmi i własnym umysłem.`,
            link: "https://lubimyczytac.pl/ksiazka/rozmyslania"
        },
        {
            id: 11,
            title: "Oczy Szeroko Otwarte",
            author: "Marek Bartosiak",
            category: "book",
            rating: 8,
            date: "2025-05-01",
            image: "", 
            description: `(Uzupełnij opis...)`,
            link: "https://lubimyczytac.pl/ksiazka/5171089/oczy-szeroko-otwarte-strategia-polski-na-czas-wojny-swiatowej"
        },
        {
            id: 12,
            title: "Przeszkoda czy wyzwanie",
            author: "Ryan Holiday", // Zakładam, że chodzi o tę książkę ("The Obstacle Is the Way")
            category: "book",
            rating: 8,
            date: "2025-04-01",
            image: "", 
            description: `Stoicyzm w praktyce. O tym, jak to, co stoi nam na drodze, staje się drogą.`,
            link: "https://lubimyczytac.pl/ksiazka/285251/przeszkoda-czy-wyzwanie-stoicka-sztuka-przekuwania-problemow-w-sukcesy"
        },
        {
            id: 13,
            title: "Dzień dobry potworku",
            author: "Catherine Gildiner", 
            category: "book", // Sprawdź czy to książka czy film
            rating: 7,
            date: "2025-03-01",
            image: "", 
            description: `(Uzupełnij opis...)`,
            link: "https://lubimyczytac.pl/ksiazka/5023781/dzien-dobry-potworku-historie-z-terapii-ktore-inspiruja-do-walki-o-samego-siebie"
        },
        {
            id: 14,
            title: "Mężczyzna o pięknym głosie",
            author: "Lillian B. Rubin", // Uzupełnij autora/reżysera
            category: "book", // Strzelam, że to film/serial? Zmień na 'book' jeśli książka
            rating: 7,
            date: "2025-02-01",
            image: "", 
            description: `(Uzupełnij opis...)`,
            link: "https://lubimyczytac.pl/ksiazka/5073937/mezczyzna-o-pieknym-glosie-opowiesci-o-terapii-ktora-lamie-reguly"
        },
        {
            id: 15,
            title: "Odwaga bycia nielubianym",
            author: "Ichiro Kishimi, Fumitake Koga",
            category: "book",
            rating: 10,
            date: "2025-01-01",
            image: "", 
            description: `Japoński fenomen. Dialog między filozofem a młodym człowiekiem oparty na psychologii Adlera. O tym, jak odzyskać wolność i przestać żyć oczekiwaniami innych.`,
            link: "https://lubimyczytac.pl/ksiazka/odwaga-bycia-nielubianym"
        },
        {
            id: 16,
            title: "Wielka wojna o chipy",
            author: "Chris Miller",
            category: "book",
            rating: 9,
            date: "2025-08-01",
            image: "", 
            description: `Fascynująca historia technologii, która rządzi światem. Jak walka o półprzewodniki kształtuje geopolitykę USA i Chin.`,
            link: "https://lubimyczytac.pl/ksiazka/5061451/wielka-wojna-o-chipy-jak-usa-i-chiny-walcza-o-technologiczna-dominacje-nad-swiatem"
        },
		        {
            id: 17,
            title: "Minuta ciszy",
            author: "Jacek Lusiński",
            category: "series",
            rating: 9,
            date: "2025-11-08",
            image: "", 
            description: `Opowieść o branży pogrzebowej i lokalnej społeczności`,
            link: "https://www.filmweb.pl/serial/Minuta+ciszy-2022-10003607"
        },
		{
            id: 18,
            title: "Heweliusz",
            author: "Jan Holoubek",
            category: "series",
            rating: 9,
            date: "2025-12-01",
            image: "", 
            description: `Fascynująca historia technologii, która rządzi światem. Jak walka o półprzewodniki kształtuje geopolitykę USA i Chin.`,
            link: "https://www.filmweb.pl/serial/Heweliusz-2025-10025579"
        },
{
            id: 19,
            title: "W stronę długowieczności",
            author: "Marek Pustuła i Marcin Łuniewski",
            category: "book",
            rating: 10,
            date: "2025-12-01",
            image: "", 
            description: `Jak długo możemy żyć?`,
link:""
        },
    ],
	// --- NOWA ODRĘBNA SEKCJA CYTATÓW ---
    quotes: [
        {
            text: "Nasz los zależy od naszych myśli. Niech więc będą one dobre, proste i pełne życzliwości.",
            author: "Marek Aureliusz"
        },
        {
            text: "Wolność to bycie nielubianym przez innych ludzi. To dowód na to, że żyjesz własnym życiem.",
            author: "Ichiro Kishimi"
        },
        {
            text: "Nie wolno się bać, strach zabija duszę. Strach to mała śmierć, a wielkie unicestwienie.",
            author: "Frank Herbert"
        },
        {
            text: "Im więcej wiesz, tym mniej musisz mówić.",
            author: "Jim Rohn"
        },
        {
            text: "Zacznij tam gdzie jesteś, użyj tego co masz, zrób co możesz.",
            author: "Arthur Ashe"
        }
    ]

};


