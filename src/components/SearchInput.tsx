import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchIcon } from './SvgIcon';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  compact?: boolean;
  /**
   * When true, input is read-only (used e.g. on HomeScreen where tap navigates to Search).
   */
  readOnly?: boolean;
  /**
   * Optional handler for pressing the whole input container (e.g. navigate to Search screen).
   */
  onPressContainer?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onQueryChange,
  placeholder = 'Search videos...',
  defaultValue = '',
  compact = false,
  readOnly = false,
  onPressContainer,
}) => {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  /**
   * Validates and sanitizes search input
   * Prevents extremely long queries and dangerous characters
   * @param {string} text - Input text to validate
   * @returns {string} Sanitized text
   */
  const sanitizeInput = (text: string): string => {
    // Limit length to 200 characters to prevent performance issues
    if (text.length > 200) {
      return text.substring(0, 200);
    }
    // Remove control characters but allow normal text
    return text.replace(/[\x00-\x1F\x7F]/g, '');
  };

  const handleChange = (text: string) => {
    const sanitized = sanitizeInput(text);
    setQuery(sanitized);
    if (onQueryChange) {
      onQueryChange(sanitized);
    }
  };

  const handleSubmit = () => {
    const trimmedQuery = query.trim();
    // Validate query is not empty and has reasonable length
    if (trimmedQuery && trimmedQuery.length >= 1 && trimmedQuery.length <= 200) {
      onSearch(trimmedQuery);
    }
  };

  const ContainerComponent = onPressContainer ? TouchableOpacity : View;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <ContainerComponent
        style={styles.inputContainer}
        {...(onPressContainer
          ? {
              onPress: onPressContainer,
              activeOpacity: 0.7,
            }
          : {})}
      >
        <View style={styles.icon}>
          <SearchIcon width={20} height={20} color="#2B2D42" />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          editable={!readOnly}
        />
      </ContainerComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  containerCompact: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2B2D42',
    paddingHorizontal: 16,
    height: 48,
  },
  icon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
  },
});
