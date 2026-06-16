import { useState } from 'react';

export type FontSizeOption = 'small' | 'regular' | 'large' | 'xlarge';

export const FONT_SIZE_OPTIONS: { key: FontSizeOption; label: string; scale: number }[] = [
  { key: 'small', label: 'Small', scale: 0.85 },
  { key: 'regular', label: 'Regular', scale: 1 },
  { key: 'large', label: 'Large', scale: 1.15 },
  { key: 'xlarge', label: 'Extra Large', scale: 1.3 },
];

export const useArticleDisplay = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>('regular');
  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const openFontSizeModal = () => setFontSizeModalVisible(true);
  const closeFontSizeModal = () => setFontSizeModalVisible(false);

  const fontScale = FONT_SIZE_OPTIONS.find((opt) => opt.key === fontSize)?.scale ?? 1;

  return {
    darkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    fontScale,
    fontSizeModalVisible,
    openFontSizeModal,
    closeFontSizeModal,
  };
};
