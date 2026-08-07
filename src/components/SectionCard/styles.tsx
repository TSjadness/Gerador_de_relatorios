import styled from 'styled-components';

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: clamp(18px, 2vw, 26px);
  box-shadow: ${({ theme }) => theme.shadow.soft};
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

export const IconBox = styled.span`
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 17px;
  line-height: 1.25;
  font-weight: 800;
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 12.5px;
  line-height: 1.45;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 680px) {
    display: none;
  }
`;
