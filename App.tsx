import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

type ToggleSetting = {
  id: string;
  label: string;
  description: string;
  value: boolean;
};

type LinkSetting = {
  id: string;
  label: string;
  description: string;
  value: string;
};

const profile = {
  name: 'Maya Johnson',
  handle: '@maya.j',
  plan: 'Pro Annual',
  location: 'Johannesburg, South Africa',
};

const initialToggles: ToggleSetting[] = [
  {
    id: 'push',
    label: 'Push notifications',
    description: 'Receive mentions, replies, and shared activity.',
    value: true,
  },
  {
    id: 'email',
    label: 'Email summaries',
    description: 'Get a weekly digest of account activity.',
    value: false,
  },
  {
    id: 'biometric',
    label: 'Face ID / biometrics',
    description: 'Require biometric authentication before opening the app.',
    value: true,
  },
  {
    id: 'private',
    label: 'Private profile',
    description: 'Only approved followers can see your activity.',
    value: false,
  },
];

const linkSettings: LinkSetting[] = [
  {
    id: 'language',
    label: 'Language',
    description: 'App display language',
    value: 'English',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Theme and app icon',
    value: 'Sunset',
  },
  {
    id: 'storage',
    label: 'Storage',
    description: 'Downloaded media and cached files',
    value: '2.4 GB',
  },
  {
    id: 'devices',
    label: 'Connected devices',
    description: 'Manage active sessions',
    value: '3 devices',
  },
];

const shortcuts = [
  'Edit profile',
  'Payment methods',
  'Subscription',
  'Help center',
];

export default function App() {
  const [toggles, setToggles] = useState(initialToggles);
  const [isSecurityCheckLoading, setIsSecurityCheckLoading] = useState(false);
  const securityCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const enabledCount = useMemo(
    () => toggles.filter((setting) => setting.value).length,
    [toggles],
  );

  useEffect(() => {
    return () => {
      if (securityCheckTimeoutRef.current) {
        clearTimeout(securityCheckTimeoutRef.current);
      }
    };
  }, []);

  const updateToggle = (id: string, nextValue: boolean) => {
    setToggles((current) =>
      current.map((setting) =>
        setting.id === id ? { ...setting, value: nextValue } : setting,
      ),
    );
  };

  const stopSecurityCheck = () => {
    if (securityCheckTimeoutRef.current) {
      clearTimeout(securityCheckTimeoutRef.current);
      securityCheckTimeoutRef.current = null;
    }

    setIsSecurityCheckLoading(false);
  };

  const runSecurityCheck = () => {
    if (isSecurityCheckLoading) {
      return;
    }

    setIsSecurityCheckLoading(true);
    securityCheckTimeoutRef.current = setTimeout(stopSecurityCheck, 1800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>MJ</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile.plan}</Text>
            </View>
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileHandle}>
            {profile.handle} • {profile.location}
          </Text>

          <View style={styles.heroFooter}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{enabledCount}</Text>
              <Text style={styles.heroStatLabel}>Active toggles</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>98%</Text>
              <Text style={styles.heroStatLabel}>Security score</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>3</Text>
              <Text style={styles.heroStatLabel}>Devices</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.shortcutGrid}>
            {shortcuts.map((shortcut) => (
              <Pressable key={shortcut} style={styles.shortcutCard}>
                <Text style={styles.shortcutLabel}>{shortcut}</Text>
                <Text style={styles.shortcutArrow}>+</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.panel}>
            {toggles.map((setting, index) => (
              <View
                key={setting.id}
                style={[
                  styles.row,
                  index !== toggles.length - 1 && styles.rowBorder,
                ]}
              >
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{setting.label}</Text>
                  <Text style={styles.rowSubtitle}>{setting.description}</Text>
                </View>
                <Switch
                  trackColor={{ false: '#3A4B63', true: '#7AE5B0' }}
                  thumbColor={setting.value ? '#0E1A2B' : '#F5F7FB'}
                  value={setting.value}
                  onValueChange={(value) => updateToggle(setting.id, value)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account overview</Text>
          <View style={styles.panel}>
            {linkSettings.map((setting, index) => (
              <Pressable
                key={setting.id}
                style={[
                  styles.row,
                  index !== linkSettings.length - 1 && styles.rowBorder,
                ]}
              >
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{setting.label}</Text>
                  <Text style={styles.rowSubtitle}>{setting.description}</Text>
                </View>
                <View style={styles.rowValueGroup}>
                  <Text style={styles.rowValue}>{setting.value}</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.securityCard}>
            <Text style={styles.securityLabel}>Last password update</Text>
            <Text style={styles.securityValue}>12 days ago</Text>
            <Text style={styles.securityDescription}>
              Review your devices and recovery methods to keep the account in
              good standing.
            </Text>
            <Pressable
              style={[
                styles.securityButton,
                isSecurityCheckLoading && styles.securityButtonDisabled,
              ]}
              disabled={isSecurityCheckLoading}
              onPress={runSecurityCheck}
            >
              <Text style={styles.securityButtonText}>Run security check</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={isSecurityCheckLoading}
        onRequestClose={stopSecurityCheck}
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#7AE5B0" />
            <Text style={styles.loadingTitle}>Running security check</Text>
            <Text style={styles.loadingSubtitle}>
              Reviewing devices, login activity, and recovery options.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07111F',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 22,
  },
  heroCard: {
    marginTop: 12,
    padding: 20,
    borderRadius: 28,
    backgroundColor: '#10233D',
    borderWidth: 1,
    borderColor: '#29496E',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#F3B95F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#10233D',
    fontSize: 24,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#173252',
  },
  badgeText: {
    color: '#7AE5B0',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  profileName: {
    color: '#F6FAFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  profileHandle: {
    color: '#9DB2CD',
    fontSize: 14,
    marginBottom: 22,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B182A',
    padding: 14,
    borderRadius: 20,
  },
  heroStat: {
    flex: 1,
  },
  heroStatValue: {
    color: '#F6FAFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  heroStatLabel: {
    color: '#89A0BF',
    fontSize: 12,
  },
  heroDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#223753',
    marginHorizontal: 12,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#F6FAFF',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 2,
  },
  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  shortcutCard: {
    width: '48%',
    minHeight: 90,
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#122741',
    borderWidth: 1,
    borderColor: '#243E60',
    justifyContent: 'space-between',
  },
  shortcutLabel: {
    color: '#E8F1FB',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  shortcutArrow: {
    color: '#7AE5B0',
    fontSize: 22,
    fontWeight: '500',
  },
  panel: {
    borderRadius: 24,
    backgroundColor: '#0F2036',
    borderWidth: 1,
    borderColor: '#223A58',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#213650',
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    color: '#F4F8FD',
    fontSize: 15,
    fontWeight: '700',
  },
  rowSubtitle: {
    color: '#8EA5C1',
    fontSize: 13,
    lineHeight: 18,
  },
  rowValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    color: '#D6E4F6',
    fontSize: 14,
    fontWeight: '600',
  },
  chevron: {
    color: '#7AE5B0',
    fontSize: 20,
    lineHeight: 20,
  },
  securityCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#F3B95F',
  },
  securityLabel: {
    color: '#594113',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  securityValue: {
    color: '#10233D',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  securityDescription: {
    color: '#5A451B',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  securityButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#10233D',
  },
  securityButtonDisabled: {
    opacity: 0.75,
  },
  securityButtonText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 17, 31, 0.58)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: '#10233D',
    borderWidth: 1,
    borderColor: '#29496E',
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: 18,
    color: '#F6FAFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  loadingSubtitle: {
    marginTop: 10,
    color: '#9DB2CD',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
