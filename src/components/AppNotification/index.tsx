import type { NotificationTone } from '../../types/diagnostic';
import { NotificationBox } from './styles';

type AppNotificationProps = {
  id: number;
  message: string;
  tone: NotificationTone;
};

export function AppNotification({ id, message, tone }: AppNotificationProps) {
  return (
    <NotificationBox key={id} $tone={tone} role="status" aria-live="polite" aria-atomic="true">
      <i className={tone === 'success' ? 'pi pi-check-circle' : tone === 'error' ? 'pi pi-times-circle' : tone === 'warning' ? 'pi pi-exclamation-triangle' : 'pi pi-info-circle'} />
      <span>{message}</span>
    </NotificationBox>
  );
}
