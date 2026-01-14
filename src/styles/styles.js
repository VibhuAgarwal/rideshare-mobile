import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // This color fills the iOS SafeArea inset behind the StatusBar.
    // Keep it aligned with the header so status bar icons stay readable.
    backgroundColor: '#2563eb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#dbeafe',
    marginTop: 4,
  },
  content: {
    flex: 1,
    // Main app surface (below header / above bottom nav)
    backgroundColor: '#f9fafb',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#6b7280',
  },
  navTextActive: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  authBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#2563eb',
    textAlign: 'center',
    fontSize: 14,
  },
  screenContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2563eb',
  },
  toggleButtonActiveGreen: {
    backgroundColor: '#16a34a',
  },
  toggleText: {
    color: '#374151',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  formContainer: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  dateInputButton: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 10,
  paddingVertical: 14,
  paddingHorizontal: 12,
  backgroundColor: '#fff',
},
  dateInputText: {
    fontSize: 16,
    color: '#111827',
  },
  dateInputPlaceholder: {
    color: '#6b7280',
  },
  clearDateButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearDateText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 12,
  },
  datePickerContainer: {
    marginTop: -8,
    marginBottom: 20,
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonGreen: {
    backgroundColor: '#16a34a',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  smallButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  dangerButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  inlineHint: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
  carRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  carRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  carTitle: {
    flex: 1,
    color: '#111827',
    fontWeight: '800',
    fontSize: 14,
  },
  carMeta: {
    marginTop: 6,
    color: '#374151',
    fontSize: 13,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  pickerButtonPlaceholder: {
    color: '#6b7280',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  modalItemSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  modalItemTitle: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 14,
  },
  modalItemSubtitle: {
    marginTop: 4,
    color: '#374151',
    fontSize: 13,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  modalSecondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  modalSecondaryButtonText: {
    color: '#111827',
    fontWeight: '800',
  },
  recentContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  recentLoadingRow: {
    paddingVertical: 8,
  },
  recentEmptyText: {
    color: '#6b7280',
    fontSize: 14,
    paddingVertical: 4,
  },
  recentRideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  timeButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  timeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  recentRideRoute: {
    flex: 1,
    color: '#111827',
    fontWeight: '700',
    fontSize: 14,
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rideCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rideRoute: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rideDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  rideDriver: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  rideDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileAvatarText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6b7280',
  },
  profileInfo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
  },

    /* =======================
     DATE TIME PICKER STYLES
     ======================= */

  dateTimeModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },

  dateTimeModalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
  },

  dateTimeModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },

  dateTimePickerBlock: {
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#020203',
  },

  dateTimeModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },

  dateTimeActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  dateTimeActionPrimary: {
    backgroundColor: '#2563eb',
  },

  dateTimeActionPrimaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  dateTimeActionSecondary: {
    backgroundColor: '#e5e7eb',
  },

  dateTimeActionSecondaryText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 14,
  },

  androidPickerWrapper: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

});

