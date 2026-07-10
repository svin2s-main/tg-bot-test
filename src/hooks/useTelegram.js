import { useState, useEffect, useCallback } from 'react';

const tg = window.Telegram?.WebApp;

export function useTelegram() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tg) return;

    tg.ready();
    tg.expand();

    setUser(tg.initDataUnsafe?.user || null);
    setTheme(tg.themeParams || {});

    const handleTheme = () => setTheme(tg.themeParams || {});
    tg.onEvent('themeChanged', handleTheme);

    setReady(true);

    return () => {
      tg.offEvent('themeChanged', handleTheme);
    };
  }, []);

  const haptic = useCallback((type = 'light') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  }, []);

  const showMainButton = useCallback((text, callback) => {
    if (!tg?.MainButton) return;
    tg.MainButton.setText(text);
    tg.MainButton.show();
    tg.MainButton.onClick(callback);
  }, []);

  const hideMainButton = useCallback(() => {
    if (!tg?.MainButton) return;
    tg.MainButton.hide();
    tg.MainButton.offClick();
  }, []);

  const showBackButton = useCallback((callback) => {
    if (!tg?.BackButton) return;
    tg.BackButton.show();
    tg.BackButton.onClick(callback);
  }, []);

  const hideBackButton = useCallback(() => {
    if (!tg?.BackButton) return;
    tg.BackButton.hide();
    tg.BackButton.offClick();
  }, []);

  const close = useCallback(() => {
    tg?.close();
  }, []);

  return {
    user,
    theme,
    ready,
    tg,
    haptic,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    close,
  };
}
