import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PauseIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const PauseIcon: React.FC<PauseIconProps> = ({
  width = 32,
  height = 32,
  color = '#2B2D42',
}) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path
      d="M13.44 8.21769C13.44 6.09692 11.7208 4.37769 9.60001 4.37769C7.47924 4.37769 5.76001 6.09692 5.76001 8.21769V23.5776C5.76001 25.6985 7.47924 27.4176 9.60001 27.4176C11.7208 27.4176 13.44 25.6985 13.44 23.5776V8.21769Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M26.2401 8.21769C26.2401 6.09692 24.5209 4.37769 22.4001 4.37769C20.2792 4.37769 18.5601 6.09692 18.5601 8.21769V23.5776C18.5601 25.6985 20.2792 27.4176 22.4001 27.4176C24.5209 27.4176 26.2401 25.6985 26.2401 23.5776V8.21769Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
