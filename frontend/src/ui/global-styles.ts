import 'normalize.css'

import { css } from '@linaria/core'

import {
  backgroundColor,
  fontSizePx,
  getCssVariableDefinitions,
  textShade,
} from './styles'

export const globalStyles = css`
  :global() {
    :root {
      ${getCssVariableDefinitions()}
    }

    html,
    body {
      height: 100%;
      background: ${backgroundColor};
      color: ${textShade(0)};
      margin: 0;
      padding: 0;
      font-size: ${fontSizePx}px;
      font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;

      /* remove 300ms click delay */
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    div,
    span,
    p {
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    }

    a {
      color: ${textShade(0)};
      text-decoration: none;
      cursor: pointer;
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    h3 {
      font-size: 1.125rem;
    }

    h4 {
      font-size: 1rem;
    }

    h1,
    h2,
    h3,
    h4 {
      font-weight: normal;
      margin: 1rem 0;

      &:first-child {
        margin-top: 0;
      }
    }

    #root {
      height: 100%;
    }
  }
`
