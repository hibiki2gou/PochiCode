import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
    const [activeTab, setActiveTab] = useState('editor');
    const [code, setCode] = useState('');

    const snippets = ['<', '>', '/', '=', '"', "'", '{', '}', '(', ')', ';', ':', 'スペース', '改行'];

    const handleSnippetPress = (snippet) => {
        if (snippet === 'スペース') {
            setCode(code + ' ');
        } else if (snippet === '改行') {
            setCode(code + '\n');
        } else {
            setCode(code + snippet);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* ヘッダー領域 */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabText}>エディタ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabText}>プレビュー</Text>
                </TouchableOpacity>
            </View>

            {/* メイン領域 */}
            <View style={styles.main}>
                <TextInput
                    style={styles.editor}
                    multiline
                    placeholder="ここにコードをポチポチ書きます..."
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {/* フッター領域 */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.snippetBar}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always">
                        {snippets.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.snippetButton}
                                onPress={() => handleSnippetPress(item)}
                            >
                                <Text style={styles.snippetButtonText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#ddd' },
    tabButton: { paddingVertical: 8, paddingHorizontal: 20, backgroundColor: '#e0e0e0', borderRadius: 8 },
    tabText: { fontWeight: 'bold', color: '#333' },
    main: { flex: 1, padding: 10 },
    editor: { flex: 1, backgroundColor: '#ffffff', padding: 15, borderRadius: 8, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', textAlignVertical: 'top' },

    // スニペットバーのデザイン
    snippetBar: {
        height: 50,
        backgroundColor: '#2d2d2d',
        flexDirection: 'row',
        alignItems: 'center'
    },
    snippetButton: {
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#444'
    },
    snippetButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    }
});