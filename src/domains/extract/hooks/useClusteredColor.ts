import { RGBProp } from '@/types/color';
import { rgbToHex } from '@/utils/colorConverter';
import { useState } from 'react';

export const useClusteredColor = () => {
  const [colors, setColors] = useState<string[]>([]);

  const setClusteredHex = (clusteredData: RGBProp[]) => {
    const colors = clusteredData.map(({ r, g, b }) => rgbToHex(r, g, b));
    setColors(colors);
  };

  return { colors, setClusteredHex };
};
