import styled from 'styled-components';

export const Container = styled.section`
  width: min(1540px, 100%);
  margin: 0 auto;
  padding: clamp(18px, 2.6vw, 34px) clamp(18px, 2.6vw, 34px) 0;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const HeaderText = styled.div`
  min-width: 0;

  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: clamp(23px, 2.4vw, 31px);
    line-height: 1.1;
    letter-spacing: -0.035em;
  }
`;

export const Description = styled.p`
  max-width: 880px;
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 13px;
  line-height: 1.55;
`;

export const HeaderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 11px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
`;

export const Navigation = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  appearance: none;
  width: 100%;
  min-width: 0;
  min-height: 76px;
  padding: 13px 14px;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $active }) => $active ? theme.colors.primarySoft : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme, $active }) => $active ? `0 10px 26px color-mix(in srgb, ${theme.colors.primary} 10%, transparent)` : theme.shadow.soft};
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  @media (max-width: 430px) {
    grid-template-columns: 36px minmax(0, 1fr);
  }
`;

export const TabIndex = styled.span`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 11px;
  font-weight: 900;
`;

export const TabContent = styled.span`
  min-width: 0;
`;

export const TabTitle = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13.5px;
  font-weight: 800;
`;

export const TabDescription = styled.span`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 11.5px;
`;

export const TabBadge = styled.span<{ $primary?: boolean }>`
  justify-self: end;
  padding: 5px 9px;
  border-radius: 999px;
  background: ${({ theme, $primary }) => $primary ? theme.colors.primary : theme.colors.surfaceSoft};
  color: ${({ theme, $primary }) => $primary ? theme.colors.primaryText : theme.colors.textSoft};
  border: 1px solid ${({ theme, $primary }) => $primary ? theme.colors.primary : theme.colors.border};
  font-size: 10.5px;
  font-weight: 800;
  white-space: nowrap;

  @media (max-width: 430px) {
    display: none;
  }
`;
