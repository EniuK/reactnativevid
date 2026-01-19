import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LeftArrowIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const LeftArrowIcon: React.FC<LeftArrowIconProps> = ({
  width = 32,
  height = 32,
  color = '#2B2D42',
}) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path
      d="M28.8 16H3.20001M3.20001 16L14.4 4.80005M3.20001 16L14.4 27.2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
