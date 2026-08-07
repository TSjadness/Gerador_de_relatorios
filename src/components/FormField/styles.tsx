import styled from 'styled-components';

export const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
`;

export const LabelLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 12.5px;
  font-weight: 700;
`;

export const HelpText = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 11.5px;
  line-height: 1.4;
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.4;
`;
