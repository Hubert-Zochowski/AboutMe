const status = document.getElementById('status');
const login = document.getElementById('login');
const logout = document.getElementById('logout');
const retry = document.getElementById('retry');

async function refresh() {
    login.hidden = logout.hidden = retry.hidden = true;
    status.textContent = 'Sprawdzanie połączenia…';
    try {
        const response = await fetch('/api/health', { cache: 'no-store' });
        if (!response.ok) throw new Error();
        const health = await response.json();
        if (health.authentication !== 'configured') {
            status.textContent = 'Lokalny panel i baza danych są gotowe. Logowanie GitHub wymaga konfiguracji aplikacji — prywatne API pozostaje zablokowane.';
            return;
        }
        const session = await fetch('/api/session', { cache: 'no-store' });
        if (session.ok) {
            const user = await session.json();
            status.textContent = `Zalogowano jako ${user.login}. Dostęp do panelu jest aktywny.`;
            logout.hidden = false;
        } else if (session.status === 401) {
            status.textContent = 'Zaloguj się kontem GitHub administratora.';
            login.hidden = false;
        } else throw new Error();
    } catch {
        status.textContent = 'Nie udało się połączyć z panelem. Sprawdź, czy lokalny serwer działa i migracje bazy zostały wykonane.';
        retry.hidden = false;
    }
}

logout.addEventListener('click', async () => {
    logout.disabled = true;
    try {
        const response = await fetch('/auth/logout', { method: 'POST' });
        if (!response.ok && response.status !== 401) throw new Error();
        await refresh();
    } catch { status.textContent = 'Wylogowanie nie powiodło się. Spróbuj ponownie.'; }
    finally { logout.disabled = false; }
});
retry.addEventListener('click', refresh);
refresh();
