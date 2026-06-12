import { useState } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';
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
                    <WebView
                        style={{ flex: 1, backgroundColor: '#fff' }}
                        source={{ html: code }}
                    />
                )}
            </View>

            {/* フッター領域 */}
            {activeTab === 'editor' && (
                <SnippetBar handleSnippetPress={handleSnippetPress} />
            )}
        </SafeAreaView>
    );
}
