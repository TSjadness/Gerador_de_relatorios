import styled from 'styled-components';

export const AppShell = styled.div`
  min-height: 100vh;
  padding-bottom: 108px;
  background:
    radial-gradient(circle at 12% 8%, color-mix(in srgb, ${({ theme }) => theme.colors.primary} 5%, transparent), transparent 31%),
    ${({ theme }) => theme.colors.background};

  @media (max-width: 480px) {
    padding-bottom: 154px;
  }
`;

export const SkipLink = styled.a`
  position: fixed;
  left: 16px;
  top: -80px;
  z-index: 200;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadow.raised};
  font-weight: 800;
  text-decoration: none;

  &:focus {
    top: 12px;
  }
`;

export const MainLayout = styled.main`
  width: min(1540px, 100%);
  margin: 0 auto;
  padding: clamp(18px, 2.6vw, 34px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 380px);
  gap: clamp(18px, 2vw, 28px);
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 680px) {
    padding: 14px;
    gap: 14px;
  }
`;

export const MainColumn = styled.section`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Sidebar = styled.aside`
  min-width: 0;
  position: sticky;
  top: 104px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 900px) {
    position: static;
  }
`;
