import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#ddd' },
    tabButton: { paddingVertical: 8, paddingHorizontal: 20, backgroundColor: '#e0e0e0', borderRadius: 8 },
    activeTabButton: { backgroundColor: '#333' },
    tabText: { fontWeight: 'bold', color: '#333' },
    activeTabText: { color: '#fff' },
    main: { flex: 1, padding: 10 },
    editor: { flex: 1, backgroundColor: '#ffffff', padding: 15, borderRadius: 8, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', textAlignVertical: 'top' },
    previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8 },
    previewText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 10 },
    previewSubText: { fontSize: 14, color: '#888' },
    snippetBar: { height: 50, backgroundColor: '#2d2d2d', flexDirection: 'row', alignItems: 'center' },
    snippetButton: { paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#444' },
    snippetButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});
