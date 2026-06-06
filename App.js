import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
    const [activeTab, setActiveTab] = useState('editor');
    const [code, setCode] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. ヘッダー領域（タブ切り替え） */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabText}>エディタ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabText}>プレビュー</Text>
                </TouchableOpacity>
            </View>

            {/* 2. メイン領域（コード入力エリア） */}
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

            {/* 3. フッター領域（スニペットバーの仮配置） */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.snippetBar}>
                    <Text style={styles.snippetText}>ここにパターンAの横スクロールボタンが並びます</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    tabText: {
        fontWeight: 'bold',
        color: '#333',
    },
    main: {
        flex: 1,
        padding: 10,
    },
    editor: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        textAlignVertical: 'top',
    },
    snippetBar: {
        height: 50,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    snippetText: {
        color: '#fff',
    }
});