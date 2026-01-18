import React from 'react';
import Svg, { Path, G, ClipPath, Defs, Rect } from 'react-native-svg';

interface PersonIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const PersonIcon: React.FC<PersonIconProps> = ({
  width = 32,
  height = 32,
  color = '#2B2D42',
}) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <G clipPath="url(#clip0_27_468)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.5001 28.8H5.50108C4.37085 28.8 3.53624 27.6848 3.96253 26.6592C5.94042 21.9168 10.5871 19.2 15.9998 19.2C21.4141 19.2 26.0607 21.9168 28.0386 26.6592C28.4649 27.6848 27.6303 28.8 26.5001 28.8ZM9.46667 9.59998C9.46667 6.07038 12.3984 3.19998 15.9998 3.19998C19.6028 3.19998 22.5329 6.07038 22.5329 9.59998C22.5329 13.1296 19.6028 16 15.9998 16C12.3984 16 9.46667 13.1296 9.46667 9.59998Z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_27_468">
        <Rect width="32" height="32" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
