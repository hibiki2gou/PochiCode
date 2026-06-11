import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './src/style';

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
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'editor' && styles.activeTabButton]}
                    onPress={() => setActiveTab('editor')}
                >
                    <Text style={[styles.tabText, activeTab === 'editor' && styles.activeTabText]}>エディタ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'preview' && styles.activeTabButton]}
                    onPress={() => setActiveTab('preview')}
                >
                    <Text style={[styles.tabText, activeTab === 'preview' && styles.activeTabText]}>プレビュー</Text>
                </TouchableOpacity>
            </View>

            {/* メイン領域 */}
            <View style={styles.main}>
                {activeTab === 'editor' ? (
                    <TextInput
                        style={styles.editor}
                        multiline
                        placeholder="ここにコードをポチポチ書きます..."
                        value={code}
                        onChangeText={setCode}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                ) : (
                    <View style={styles.previewContainer}>
                        <Text style={styles.previewText}>ここにWebプレビューが表示されます</Text>
                        <Text style={styles.previewText}>プレビュー内容</Text>
                    </View>
                )}
            </View>

            {/* フッター領域 */}
            {activeTab === 'editor' && (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
            )}
        </SafeAreaView>
    );
}
