import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`
    ${reset}

    * {
      box-sizing:border-box;
    }

    ul, li {
      list-style: none;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    :root {
      --light-color: #fff;
      --dark-color: #000;
      --border-color: #ccc;
      --accent-color: #dc143c;
      --button-color: #1d9bf9;
    }

    html {
      font-size: 62.5%;
    }

    body {
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      /* align-items: center; */
      background: var(--dark-color);
      color: var(--light-color);
      font-size: 1.6rem;
      padding-top: 100px;
    }
`;

export default GlobalStyles;
