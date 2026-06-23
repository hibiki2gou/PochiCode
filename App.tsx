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
        const insertText = snippet === 'スペース' ? ' ' : snippet === '改行' ? '\n' : snippet;
        const nextChar = code.charAt(end);

        const moveCursor = (pos: number) => {
            setSelection({ start: pos, end: pos });
            setTimeout(() => {
                textInputRef.current?.setNativeProps({ selection: { start: pos, end: pos } });
            }, 10);
        };

        // `>` を除く閉じカッコが次の文字と一致する場合はカーソルをスキップ
        if (CLOSING_CHARS.has(insertText) && insertText !== '>' && nextChar === insertText) {
            moveCursor(start + 1);
            return;
        }

        // 開きカッコの処理
        if (PAIRS[insertText]) {
            const matchingClose = PAIRS[insertText];
            const beforeText = code.substring(0, start);
            const afterText = code.substring(end);

            if (nextChar === matchingClose && insertText !== matchingClose) {
                // 対応する閉じカッコの直後に新たなペアを挿入（例: <> → <><>）
                const newCode = code.substring(0, end + 1) + insertText + matchingClose + code.substring(end + 1);
                setCode(newCode);
                moveCursor(end + 2);
                return;
            }

            if (nextChar === '' || nextChar === ' ' || nextChar === '\n') {
                setCode(beforeText + insertText + matchingClose + afterText);
                moveCursor(start + 1);
                return;
            }
        }

        // 通常入力
        const beforeText = code.substring(0, start);
        const afterText = code.substring(end);
        setCode(beforeText + insertText + afterText);
        moveCursor(start + insertText.length);
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
