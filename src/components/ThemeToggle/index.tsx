import { useAppTheme } from '../../contexts/ThemeContext';
import { ToggleButton } from './styles';

export function ThemeToggle() {
  const { mode, toggleTheme } = useAppTheme();
  const dark = mode === 'dark';

  return (
    <ToggleButton
      type="button"
      icon={dark ? 'pi pi-sun' : 'pi pi-moon'}
      label={dark ? 'Tema claro' : 'Tema escuro'}
      onClick={toggleTheme}
      aria-label={dark ? 'Alterar para tema claro' : 'Alterar para tema escuro'}
    />
  );
}
