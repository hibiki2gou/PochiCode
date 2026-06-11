import { useState } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';
import Header from './src/components/Header';
import SnippetBar from './src/components/SnippetBar';
import { styles } from './src/styles';

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
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />

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
                        <Text style={styles.previewSubText}>プレビュー内容</Text>
                    </View>
                )}
            </View>

            {/* フッター領域 */}
            {activeTab === 'editor' && (
                <SnippetBar handleSnippetPress={handleSnippetPress} />
            )}
        </SafeAreaView>
    );
}
