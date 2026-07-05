import { useRef, useState } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import Header from './src/components/Header';
import MainArea from './src/components/MainArea';
import SnippetBar from './src/components/SnippetBar';
import { styles } from './src/styles';
import { Selection, TabType } from './src/types';

const PAIRS: Record<string, string> = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'", '<': '>' };
const CLOSING_CHARS = new Set(Object.values(PAIRS));

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>('editor');
    const [code, setCode] = useState<string>('');
    const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
    const [undoStack, setUndoStack] = useState<{ code: string; selection: Selection }[]>([]);
    const textInputRef = useRef<TextInput>(null);
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    const clearTypingBurst = () => {
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = null;
        isTypingRef.current = false;
    };

    const handleChangeText = (newCode: string): void => {
        // タイピングバースト開始時にスナップショットを保存
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            setUndoStack(prev => [...prev, { code, selection }]);
        }
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = setTimeout(() => {
            isTypingRef.current = false;
            undoTimerRef.current = null;
        }, 500);

        if (newCode.length === code.length - 1) {
            const deletedPos = selection.start - 1;
            const deletedChar = code[deletedPos];

            if (deletedChar && PAIRS[deletedChar] && newCode[deletedPos] === PAIRS[deletedChar]) {
                const withBothDeleted = newCode.substring(0, deletedPos) + newCode.substring(deletedPos + 1);
                setCode(withBothDeleted);
                setSelection({ start: deletedPos, end: deletedPos });
                return;
            }
        }
        setCode(newCode);
    };

    const handleSnippetPress = (snippet: string): void => {
        if (snippet === '↩') {
            if (undoStack.length === 0) return;
            clearTypingBurst();
            const prev = undoStack[undoStack.length - 1];
            setUndoStack(undoStack.slice(0, -1));
            setCode(prev.code);
            setSelection(prev.selection);
            return;
        }

        // スニペットは常に独立したUndoポイント
        clearTypingBurst();
        setUndoStack(prev => [...prev, { code, selection }]);

        const { start, end } = selection;
        const insertText = snippet === 'Tab' ? '  ' : snippet === '改行' ? '\n' : snippet;
        const nextChar = code.charAt(end);

        const moveCursor = (pos: number) => {
            setSelection({ start: pos, end: pos });
        };

        // 閉じカッコが次の文字と一致する場合はカーソルをスキップ
        if (CLOSING_CHARS.has(insertText) && nextChar === insertText) {
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
                setCode={handleChangeText}
                selection={selection}
                setSelection={setSelection}
                textInputRef={textInputRef}
            />
            {activeTab === 'editor' && (
                <SnippetBar handleSnippetPress={handleSnippetPress} />
            )}
        </SafeAreaView>
    );
}
