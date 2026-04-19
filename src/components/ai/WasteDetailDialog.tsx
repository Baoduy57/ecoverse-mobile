import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WasteHistoryItem } from '@/types/wasteClassification';

export interface BinMeta {
  color: string;
  softColor: string;
  gradient: [string, string] | readonly [string, string, ...string[]];
  icon: string;
  label: string;
  emoji: string;
  tip: string;
}

interface WasteDetailDialogProps {
  visible: boolean;
  onDismiss: () => void;
  selectedItem: WasteHistoryItem | null;
  selectedMeta: BinMeta | null;
  formatDate: (date?: string) => string;
}

export default function WasteDetailDialog({
  visible,
  onDismiss,
  selectedItem,
  selectedMeta,
  formatDate,
}: WasteDetailDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Chi tiết vật đã quét</Dialog.Title>
        <Dialog.Content>
          {selectedItem && selectedMeta && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedItem.image_url ? (
                <Image source={{ uri: selectedItem.image_url }} style={styles.dialogImage} />
              ) : (
                <View style={styles.dialogImageFallback}>
                  <MaterialCommunityIcons name="image-off-outline" size={28} color="#9CA3AF" />
                </View>
              )}

              <View style={styles.dialogMetaRow}>
                <View style={[styles.badge, { backgroundColor: selectedMeta.softColor }]}>
                  <MaterialCommunityIcons
                    name={selectedMeta.icon as any}
                    size={16}
                    color={selectedMeta.color}
                  />
                  <Text style={[styles.badgeText, { color: selectedMeta.color }]}>
                    {selectedMeta.label}
                  </Text>
                </View>
                <Text style={styles.dialogDateText}>{formatDate(selectedItem.created_at)}</Text>
              </View>

              <Text style={styles.dialogItemName}>{selectedItem.name}</Text>
              <Text style={styles.dialogDescription}>
                {selectedItem.description || 'Mục này chưa có mô tả chi tiết.'}
              </Text>

              <View style={styles.tipBox}>
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  size={20}
                  color={selectedMeta.color}
                />
                <Text style={styles.tipText}>{selectedMeta.tip}</Text>
              </View>
            </ScrollView>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} labelStyle={styles.closeBtn}>Đóng</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  dialogTitle: {
    fontWeight: '900',
    fontSize: 20,
  },
  dialogImage: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  dialogImageFallback: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dialogDateText: {
    fontSize: 13,
    color: '#64748B',
    flexShrink: 1,
    textAlign: 'right',
  },
  dialogItemName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
  },
  dialogDescription: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 18,
  },
  tipBox: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: '700',
  },
});
