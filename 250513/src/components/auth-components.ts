import styled from "styled-components";

export const Container = styled.div`
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 4rem;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1.8rem;
  &:focus {
    outline: none;
  }
  &[type="submit"] {
    opacity: 1;
    transition: opacity 0.3s;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  color: #ff6347;
  font-weight: 600;
  text-align: center;
`;

export const Switcher = styled.span`
  margin-bottom: 20px;
  a {
    color: #ff6347;
  }
`;
