import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useUiStore } from '../store/ui';

export function RootLayout() {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <Outlet />;
}
