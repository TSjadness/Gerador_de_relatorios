import type { PropsWithChildren, ReactNode } from 'react';
import { Badge, Card, Header, HeaderContent, IconBox, Subtitle, Title } from './styles';

type SectionCardProps = PropsWithChildren<{
  icon: string;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
}>;

export function SectionCard({ icon, title, subtitle, badge, children }: SectionCardProps) {
  return (
    <Card>
      <Header>
        <HeaderContent>
          <IconBox aria-hidden="true">{icon}</IconBox>
          <div>
            <Title>{title}</Title>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
          </div>
        </HeaderContent>
        {badge ? <Badge>{badge}</Badge> : null}
      </Header>
      {children}
    </Card>
  );
}
