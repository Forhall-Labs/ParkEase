// @author AleLeonMarin
import { useEffect, useState, type FormEvent } from 'react';
import { useLogin } from './hooks/useLogin';
import { Layout } from './layout/layout';
import { Dashboard, DashboardCardsPanel, Vehicles } from './components/UI/dashboard';
import { Users } from './components/UI/users';
import { Settings } from './components/UI/settings';
import { Reports } from './components/UI/reports';
import { initI18n, t } from './i18n';

function App() {
  useEffect(() => {
    initI18n();
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  const [activePath, setActivePath] = useState('/dashboard');
  const [quickAddVehicleToken, setQuickAddVehicleToken] = useState(0);

  const { form, isLoading, error, currentUser, setField, submitLogin, logout } = useLogin();

  const isLight = theme === 'light';

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((previousTheme) => (previousTheme === 'dark' ? 'light' : 'dark'));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitLogin();
  }

  if (currentUser) {
    const showStats = false;

    const renderContent = () => {
      switch (activePath) {
        case '/usuarios':
          return <Users theme={theme} />;
        case '/vehiculos':
          return (
            <Vehicles
              theme={theme}
              triggerQuickAddToken={quickAddVehicleToken}
              onQuickAddHandled={() => setQuickAddVehicleToken(0)}
            />
          );
        case '/reportes':
          return <Reports theme={theme} />;
        case '/configuracion':
          return <Settings theme={theme} onThemeChange={setTheme} />;
        default:
          return (
            <Dashboard
              theme={theme}
              onGoToVehicles={() => setActivePath('/vehiculos')}
              onQuickAddVehicle={() => {
                setQuickAddVehicleToken((current) => current + 1);
                setActivePath('/vehiculos');
              }}
            />
          );
      }
    };

    return (
      <Layout
        userName={currentUser.user_name}
        title="ParkEase"
        subtitle="Panel de gestión"
        showWelcomeBanner={activePath === '/dashboard' || activePath === '/'}
        asideContent={showStats ? <DashboardCardsPanel theme={theme} /> : undefined}
        activePath={activePath}
        onNavigate={setActivePath}
        onLogout={logout}
        theme={theme}
      >
        {activePath === '/dashboard' || activePath === '/' ? (
          <Dashboard
            theme={theme}
            onGoToVehicles={() => setActivePath('/vehiculos')}
            onQuickAddVehicle={() => {
              setQuickAddVehicleToken((current) => current + 1);
              setActivePath('/vehiculos');
            }}
          />
        ) : (
          renderContent()
        )}
      </Layout>
    );
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden ${isLight ? 'bg-stone-50 text-slate-900' : 'bg-slate-950 text-white'}`}
    >
      <div
        className={`absolute inset-0 ${
          isLight
            ? 'bg-[radial-gradient(circle_at_top_left,rgba(120,113,108,0.04),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(168,162,158,0.04),transparent_46%),linear-gradient(135deg,#fafaf9_0%,#f5f5f4_55%,#e7e5e4_100%)]'
            : 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]'
        }`}
      />
      <div
        className={`absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[42px_42px] ${
          isLight ? 'opacity-18' : 'opacity-30'
        }`}
      />

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={toggleTheme}
          className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
            isLight
              ? 'border-stone-200 bg-stone-50 text-slate-700 hover:bg-stone-100'
              : 'border-white/10 bg-slate-950/40 text-slate-100 hover:bg-slate-900/80'
          }`}
        >
          {isLight ? t('settings.theme.dark') : t('settings.theme.light')}
        </button>
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <section
          className={`grid w-full overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] ${
            isLight
              ? 'border-stone-200 bg-stone-50 shadow-stone-200/20'
              : 'border-white/10 bg-white/8 shadow-slate-950/50'
          }`}
        >
          <div className="relative flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-12">
            <div
              className={`absolute inset-y-0 right-0 hidden w-px bg-linear-to-b from-transparent lg:block ${
                isLight ? 'via-slate-200 to-transparent' : 'via-white/15 to-transparent'
              }`}
            />

            <div className="mx-auto flex max-w-xl flex-1 flex-col justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h1
                  className={`text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl ${isLight ? 'text-slate-900' : 'text-white'}`}
                >
                  {t('login.welcome')}
                </h1>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center p-8 sm:p-10 lg:p-12 ${isLight ? 'bg-stone-50' : 'bg-slate-950/40'}`}
          >
            <form
              className={`w-full space-y-6 rounded-[1.75rem] border p-6 shadow-xl sm:p-8 ${
                isLight
                  ? 'border-stone-200 bg-stone-50 shadow-stone-200/20'
                  : 'border-white/10 bg-slate-900/70 shadow-slate-950/30'
              }`}
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <h2
                  className={`text-2xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
                >
                  {t('login.login')}
                </h2>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t('login.enterCredentials')}
                </p>
              </div>

              {error && (
                <p
                  className={`rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-rose-400/30 bg-rose-500/10 text-rose-200'}`}
                >
                  {error}
                </p>
              )}

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span
                    className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
                  >
                    {t('login.username')}
                  </span>
                  <input
                    placeholder="usuario"
                    value={form.user_username}
                    onChange={(event) => setField('user_username', event.target.value)}
                    autoComplete="username"
                    className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10 ${
                      isLight
                        ? 'border-stone-200 bg-stone-50 text-slate-900 placeholder:text-slate-400 focus:bg-stone-100'
                        : 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:bg-white/10'
                    }`}
                  />
                </label>

                <label className="block space-y-2">
                  <span
                    className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
                  >
                    {t('login.password')}
                  </span>
                  <input
                    type="password"
                    placeholder="contraseña"
                    value={form.user_password}
                    onChange={(event) => setField('user_password', event.target.value)}
                    autoComplete="current-password"
                    className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10 ${
                      isLight
                        ? 'border-stone-200 bg-stone-50 text-slate-900 placeholder:text-slate-400 focus:bg-stone-100'
                        : 'border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:bg-white/10'
                    }`}
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300 active:translate-y-0"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 3v18" />
                  </svg>
                  {isLoading ? t('login.loggingIn') : t('login.enter')}
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-semibold transition hover:-translate-y-0.5 active:translate-y-0 ${
                    isLight
                      ? 'border-stone-200 bg-stone-50 text-slate-700 hover:bg-stone-100'
                      : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.73 1.22 9.26 3.6l6.93-6.93C35.98 2.36 30.4 0 24 0 14.62 0 6.54 5.38 2.56 13.22l8.05 6.26C12.52 13.77 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.5 24.5c0-1.45-.13-2.84-.37-4.19H24v7.93h12.71c-.55 2.97-2.23 5.48-4.77 7.16l7.31 5.69C43.76 36.57 46.5 31.05 46.5 24.5z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.61 28.98A14.37 14.37 0 0 1 9.5 24c0-1.73.3-3.41.84-4.92L2.29 12.82A24 24 0 0 0 0 24c0 3.86.92 7.5 2.56 10.78l8.05-5.8z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.53 0 12.01-2.15 16.01-5.86l-7.31-5.69c-2.04 1.39-4.65 2.21-8.7 2.21-6.26 0-11.48-4.27-13.39-9.99l-8.05 5.8C6.54 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
