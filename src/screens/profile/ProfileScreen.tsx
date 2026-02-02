import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme';

export default function ProfileScreen() {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Surface style={styles.avatarContainer} elevation={2}>
          <Image
            source={require('../../../assets/images/default-avatar.jpg')}
            style={styles.avatar}
          />
        </Surface>

        <Text variant="headlineSmall" style={styles.name}>
          Kiddo
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          kiddo@ecoverse.com
        </Text>

        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutButton}
          textColor={colors.status.error}
        >
          Đăng xuất
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  avatarContainer: {
    borderRadius: 60,
    marginBottom: 24,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  email: {
    color: colors.text.secondary,
    marginBottom: 32,
  },
  logoutButton: {
    borderColor: colors.status.error,
    borderRadius: 20,
    minWidth: 150,
  },
});
