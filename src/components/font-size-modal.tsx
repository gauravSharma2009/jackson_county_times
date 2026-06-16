import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FONT_SIZE_OPTIONS, FontSizeOption } from '@/hooks/use-article-display';

type Props = {
  visible: boolean;
  value: FontSizeOption;
  darkMode: boolean;
  onSelect: (value: FontSizeOption) => void;
  onClose: () => void;
};

export function FontSizeModal({ visible, value, darkMode, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.sheet, darkMode && styles.sheetDark]}>
          <Text style={[styles.title, darkMode && styles.titleDark]}>Text Size</Text>
          {FONT_SIZE_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              style={[styles.option, darkMode && styles.optionDark]}
              onPress={() => {
                onSelect(option.key);
                onClose();
              }}>
              <Text
                style={[
                  styles.optionLabel,
                  darkMode && styles.optionLabelDark,
                  { fontSize: 14 * option.scale },
                ]}>
                {option.label}
              </Text>
              {value === option.key && (
                <Feather name="check" size={18} color={darkMode ? '#ffffff' : '#1a1a1a'} />
              )}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sheetDark: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  titleDark: {
    color: '#ffffff',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  optionDark: {
    borderTopColor: '#333333',
  },
  optionLabel: {
    color: '#222222',
  },
  optionLabelDark: {
    color: '#ffffff',
  },
});
