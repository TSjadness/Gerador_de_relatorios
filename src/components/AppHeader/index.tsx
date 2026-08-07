import logo from '../../assets/images/logo.png';
import { TEMPLATE_OPTIONS } from '../../constants/diagnostic';
import { ThemeToggle } from '../ThemeToggle';
import {
  Actions,
  Brand,
  BrandCopy,
  BrandLogo,
  BrandSubtitle,
  BrandTitle,
  Header,
  HeaderInner,
  ModelSelect,
  ResetButton
} from './styles';

type AppHeaderProps = {
  onApplyTemplate: (key: string) => boolean;
  onReset: () => void;
};

export function AppHeader({ onApplyTemplate, onReset }: AppHeaderProps) {
  const handleTemplateChange = (value: string) => {
    if (!value) return;
    onApplyTemplate(value);
  };

  return (
    <Header>
      <HeaderInner>
        <Brand>
          <BrandLogo src={logo} alt="Identidade visual do Gerador de Diagnóstico MEI" />
          <BrandCopy>
            <BrandTitle>Gerador de Diagnóstico</BrandTitle>
            <BrandSubtitle>Painel interno · Portal do MEI Brasil</BrandSubtitle>
          </BrandCopy>
        </Brand>
        <Actions>
          <ModelSelect value="" onChange={(event) => handleTemplateChange(event.target.value)} aria-label="Aplicar modelo de relatório">
            {TEMPLATE_OPTIONS.map((option) => (
              <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
            ))}
          </ModelSelect>
          <ThemeToggle />
          <ResetButton type="button" icon="pi pi-file-plus" label="Novo relatório" onClick={onReset} />
        </Actions>
      </HeaderInner>
    </Header>
  );
}
