import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useState } from 'react';

export const colors = {
  navy: '#0f2a55',
  blue: '#2563eb',
  orange: '#ea580c',
  ink: '#0f172a',
  muted: '#64748b',
  bg: '#f8fafc',
  border: '#e2e8f0',
  white: '#fff',
  red: '#dc2626',
  green: '#047857',
};

export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.secondary,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  keyboardType,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry === true;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={isPassword ? styles.inputWrapper : null}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
            isPassword && styles.passwordInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={isPassword && !showPassword}
          multiline={multiline}
          keyboardType={keyboardType}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>
              {showPassword ? '🙈' : '👁'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.blue} size="large" />
    </View>
  );
}

export function ErrorText({ message }) {
  return <Text style={styles.error}>{message}</Text>;
}

export function Empty({ title, body }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {body && <Text style={styles.muted}>{body}</Text>}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    padding: 20,
  },

  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },

  heading: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },

  button: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },

  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  secondaryText: {
    color: colors.ink,
  },

  disabled: {
    opacity: 0.5,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },

  inputWrapper: {
    position: 'relative',
  },

  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 13,
    color: colors.ink,
  },

  passwordInput: {
    paddingRight: 55,
  },

  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  eyeText: {
    fontSize: 20,
  },

  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  error: {
    color: colors.red,
    marginVertical: 10,
  },

  muted: {
    color: colors.muted,
    lineHeight: 20,
  },

  empty: {
    padding: 30,
    alignItems: 'center',
  },

  emptyTitle: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 17,
    marginBottom: 6,
  },
});