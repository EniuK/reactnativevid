import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface AppIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  width = 128,
  height = 128,
  color = '#2B2D42',
}) => (
  <Svg width={width} height={height} viewBox="0 0 128 128" fill="none">
    <Path
      d="M10.6667 64C10.6667 38.8584 10.6667 26.2876 18.4772 18.4772C26.2876 10.6667 38.8584 10.6667 64 10.6667C89.1413 10.6667 101.713 10.6667 109.523 18.4772C117.333 26.2876 117.333 38.8584 117.333 64C117.333 89.1414 117.333 101.713 109.523 109.523C101.713 117.333 89.1413 117.333 64 117.333C38.8584 117.333 26.2876 117.333 18.4772 109.523C10.6667 101.713 10.6667 89.1414 10.6667 64Z"
      stroke={color}
      strokeWidth="8"
    />
    <Path
      d="M114.667 42.6667H13.3333"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
    />
    <Path
      d="M56 13.3334L37.3333 42.6667"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
    />
    <Path
      d="M90.6667 13.3334L72 42.6667"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
    />
    <Path
      d="M80 77.3334C80 73.9552 76.4693 71.6774 69.408 67.1211C62.2501 62.503 58.6709 60.1936 56.0021 61.8891C53.3333 63.5846 53.3333 68.1675 53.3333 77.3334C53.3333 86.4992 53.3333 91.0822 56.0021 92.7776C58.6709 94.4731 62.2501 92.1638 69.408 87.5456C76.4693 82.9894 80 80.7115 80 77.3334Z"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
    />
  </Svg>
);
