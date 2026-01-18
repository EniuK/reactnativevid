import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

export type SortOption = 'date' | 'dateDesc' | 'viewCount';
export type SortOptionLabel = 'Upload date: latest' | 'Upload date: oldest' | 'Most popular';

interface SortModalProps {
  visible: boolean;
  selectedSort: SortOption;
  onClose: () => void;
  onSelect: (sort: SortOption) => void;
}

const sortOptions: Array<{ value: SortOption; label: SortOptionLabel }> = [
  { value: 'date', label: 'Upload date: latest' },
  { value: 'dateDesc', label: 'Upload date: oldest' },
  { value: 'viewCount', label: 'Most popular' },
];

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  selectedSort,
  onClose,
  onSelect,
}) => {
  const handleSelect = (sort: SortOption) => {
    onSelect(sort);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Text style={styles.title}>Sort records by:</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.option}
                  onPress={() => handleSelect(option.value)}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radio,
                        selectedSort === option.value && styles.radioSelected,
                      ]}
                    >
                      {selectedSort === option.value && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.optionText}>{option.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  option: {
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2B2D42',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#2B2D42',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2B2D42',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
  },
  confirmButton: {
    backgroundColor: '#343A40',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});
