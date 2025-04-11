import { css } from 'styled-components';

export const breakpoints = {
  xSmall: '576px',
  small: '768px',
  medium: '992px',
  large: '1200px',
  xLarge: '1400px',
};

const mediaFactory = (key) => {
  return (style, ...interpolations) => {
    return css`
      @media only screen and (min-width: ${breakpoints[key]}) {
        ${css(style, ...interpolations)}
      }
    `;
  };
};

export const media = {
  screen: {
    xSmall: mediaFactory('xSmall'),
    small: mediaFactory('small'),
    medium: mediaFactory('medium'),
    large: mediaFactory('large'),
    xLarge: mediaFactory('xLarge'),
  },
};
