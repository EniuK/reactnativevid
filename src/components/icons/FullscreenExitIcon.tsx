import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FullscreenExitIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const FullscreenExitIcon: React.FC<FullscreenExitIconProps> = ({
  width = 32,
  height = 32,
  color = '#2B2D42',
}) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path
      d="M20 26.6666H26.6667V20M20 5.33325H26.6667V11.9999M12.0001 26.6666H5.33337V20M12.0001 5.33327H5.33337V12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
