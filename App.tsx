import { useRef, useState } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import Header from './src/components/Header';
import MainArea from './src/components/MainArea';
import SnippetBar from './src/components/SnippetBar';
import { styles } from './src/styles';
import { Selection, TabType } from './src/types';

const PAIRS: Record<string, string> = { '{': '}', '(': ')', '"': '"', "'": "'", '<': '>' };
const CLOSING_CHARS = new Set(Object.values(PAIRS));

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>('editor');
    const [code, setCode] = useState<string>('');
    const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
    const textInputRef = useRef<TextInput>(null);

    const handleSnippetPress = (snippet: string): void => {
        const { start, end } = selection;
        const beforeText = code.substring(0, start);
        const afterText = code.substring(end);

        let insertText = snippet === 'スペース' ? ' ' : snippet === '改行' ? '\n' : snippet;

        const nextChar = code.charAt(end);

        // すでに閉じカッコが入力済みの場合はカーソルだけ進める
        if (CLOSING_CHARS.has(insertText) && nextChar === insertText) {
            textInputRef.current?.setNativeProps({
                selection: { start: start + 1, end: start + 1 },
            });
            return;
        }

        // 開きカッコの場合は閉じカッコを自動補完する
        if (PAIRS[insertText] && (nextChar === '' || nextChar === ' ' || nextChar === '\n')) {
            insertText = insertText + PAIRS[insertText];
            setCode(beforeText + insertText + afterText);
            setTimeout(() => {
                textInputRef.current?.setNativeProps({
                    selection: { start: start + 1, end: start + 1 },
                });
            }, 10);
            return;
        }

        // 通常入力
        setCode(beforeText + insertText + afterText);
        setTimeout(() => {
            const newPos = start + insertText.length;
            textInputRef.current?.setNativeProps({
                selection: { start: newPos, end: newPos },
            });
        }, 10);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <MainArea
                activeTab={activeTab}
                code={code}
                setCode={setCode}
                textInputRef={textInputRef}
                setSelection={setSelection}
            />
            {activeTab === 'editor' && (
                <SnippetBar handleSnippetPress={handleSnippetPress} />
            )}
        </SafeAreaView>
    );
}
