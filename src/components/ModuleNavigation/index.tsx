import { Container, Description, Header, HeaderBadge, HeaderText, Navigation, Tab, TabBadge, TabContent, TabDescription, TabIndex, TabTitle } from './styles';

export type AppModule = 'diagnostic' | 'das';

type ModuleNavigationProps = {
  active: AppModule;
  dasCount: number;
  onChange: (module: AppModule) => void;
};

export function ModuleNavigation({ active, dasCount, onChange }: ModuleNavigationProps) {
  return (
    <Container aria-label="Ferramentas do atendimento">
      <Header>
        <HeaderText>
          <h1>{active === 'diagnostic' ? 'Diagnóstico CNPJ' : 'Pendências DAS'}</h1>
          <Description>
            {active === 'diagnostic'
              ? 'Página principal do projeto. Use a navegação abaixo para acessar ferramentas complementares sem perder os dados já preenchidos.'
              : 'Detalhe competências, importe dados da consulta, revise valores e gere um PDF específico ou combine esta seção com o diagnóstico.'}
          </Description>
        </HeaderText>
        <HeaderBadge>2 ferramentas</HeaderBadge>
      </Header>

      <Navigation role="tablist" aria-label="Módulos do relatório">
        <Tab
          type="button"
          role="tab"
          aria-selected={active === 'diagnostic'}
          $active={active === 'diagnostic'}
          onClick={() => onChange('diagnostic')}
        >
          <TabIndex>01</TabIndex>
          <TabContent>
            <TabTitle>Diagnóstico CNPJ</TabTitle>
            <TabDescription>Projeto original completo</TabDescription>
          </TabContent>
          <TabBadge $primary>Principal</TabBadge>
        </Tab>

        <Tab
          type="button"
          role="tab"
          aria-selected={active === 'das'}
          $active={active === 'das'}
          onClick={() => onChange('das')}
        >
          <TabIndex>02</TabIndex>
          <TabContent>
            <TabTitle>Pendências DAS</TabTitle>
            <TabDescription>Detalhamento, análise e PDF específico</TabDescription>
          </TabContent>
          <TabBadge>{dasCount ? `${dasCount} registro${dasCount === 1 ? '' : 's'}` : 'Opcional'}</TabBadge>
        </Tab>
      </Navigation>
    </Container>
  );
}
