import { useRef, useState } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import Header from './src/components/Header';
import MainArea from './src/components/MainArea';
import SnippetBar from './src/components/SnippetBar';
import { styles } from './src/styles';
import { Selection, TabType } from './src/types';

const PAIRS: Record<string, string> = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'", '<': '>' };
const CLOSING_CHARS = new Set(Object.values(PAIRS));
// 閉じタグを持たない void 要素は自動クローズの対象外
const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'link', 'meta', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>('editor');
    const [code, setCode] = useState<string>('');
    const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });
    const [forcedSelection, setForcedSelection] = useState<Selection | null>(null);
    const [undoStack, setUndoStack] = useState<{ code: string; selection: Selection }[]>([]);
    const [redoStack, setRedoStack] = useState<{ code: string; selection: Selection }[]>([]);
    const textInputRef = useRef<TextInput>(null);
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    const clearTypingBurst = () => {
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = null;
        isTypingRef.current = false;
    };

    // カーソル位置がある行の先頭スペース（インデント）を取得
    const getIndent = (text: string, pos: number): string => {
        const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
        const match = text.slice(lineStart, pos).match(/^ */);
        return match ? match[0] : '';
    };

    const buildNewline = (start: number, end: number): { newCode: string; cursor: number } => {
        const beforeText = code.substring(0, start);
        const afterText = code.substring(end);
        const indent = getIndent(code, start);

        // { の直後の改行はスマートインデント（次行を1段深くし、} を対応する位置に置く）
        if (beforeText.endsWith('{')) {
            const inner = indent + '  ';
            const close = afterText.startsWith('}') ? '' : '}';
            return {
                newCode: beforeText + '\n' + inner + '\n' + indent + close + afterText,
                cursor: start + 1 + inner.length,
            };
        }

        return {
            newCode: beforeText + '\n' + indent + afterText,
            cursor: start + 1 + indent.length,
        };
    };

    // プログラム側からカーソルを動かすときだけ selection を TextInput に強制適用する
    const moveCursorTo = (sel: Selection) => {
        setSelection(sel);
        setForcedSelection(sel);
    };

    const handleSelectionChange = (sel: Selection) => {
        setSelection(sel);
        setForcedSelection(null);
    };

    const handleChangeText = (newCode: string): void => {
        // タイピングバースト開始時にスナップショットを保存
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            setUndoStack(prev => [...prev, { code, selection }]);
            setRedoStack([]);
        }
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = setTimeout(() => {
            isTypingRef.current = false;
            undoTimerRef.current = null;
        }, 500);

        // キーボードからの改行にもオートインデントを適用
        const { start, end } = selection;
        if (
            newCode.length === code.length - (end - start) + 1 &&
            newCode.charAt(start) === '\n' &&
            newCode.slice(0, start) === code.slice(0, start) &&
            newCode.slice(start + 1) === code.slice(end)
        ) {
            const { newCode: indented, cursor } = buildNewline(start, end);
            setCode(indented);
            moveCursorTo({ start: cursor, end: cursor });
            return;
        }

        if (newCode.length === code.length - 1) {
            const deletedPos = selection.start - 1;
            const deletedChar = code[deletedPos];

            if (deletedChar && PAIRS[deletedChar] && newCode[deletedPos] === PAIRS[deletedChar]) {
                const withBothDeleted = newCode.substring(0, deletedPos) + newCode.substring(deletedPos + 1);
                setCode(withBothDeleted);
                moveCursorTo({ start: deletedPos, end: deletedPos });
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
            setRedoStack(prev => [...prev, { code, selection }]);
            setCode(prev.code);
            moveCursorTo(prev.selection);
            return;
        }

        if (snippet === '↪') {
            if (redoStack.length === 0) return;
            clearTypingBurst();
            const next = redoStack[redoStack.length - 1];
            setRedoStack(redoStack.slice(0, -1));
            setUndoStack(prev => [...prev, { code, selection }]);
            setCode(next.code);
            moveCursorTo(next.selection);
            return;
        }

        // スニペットは常に独立したUndoポイント（Redoはリセット）
        clearTypingBurst();
        setUndoStack(prev => [...prev, { code, selection }]);
        setRedoStack([]);

        const { start, end } = selection;
        if (snippet === 'clog') {
            const beforeText = code.substring(0, selection.start);
            const afterText = code.substring(selection.end);
            setCode(beforeText + 'console.log()' + afterText);
            moveCursorTo({ start: selection.start + 12, end: selection.start + 12 });
            return;
        }

        if (snippet === '改行') {
            const { newCode, cursor } = buildNewline(start, end);
            setCode(newCode);
            moveCursorTo({ start: cursor, end: cursor });
            return;
        }

        const insertText = snippet === 'Tab' ? '  ' : snippet;
        const nextChar = code.charAt(end);

        const moveCursor = (pos: number) => {
            moveCursorTo({ start: pos, end: pos });
        };

        // HTML タグの自動クローズ（例: <div + > → <div></div>）
        if (insertText === '>') {
            const beforeText = code.substring(0, start);
            const tagMatch = beforeText.match(/<([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)$/);
            if (tagMatch && !tagMatch[2].endsWith('/') && !VOID_TAGS.has(tagMatch[1].toLowerCase())) {
                // 括弧補完で挿入済みの > がカーソル直後にある場合はそれを利用する
                const afterText = code.substring(nextChar === '>' ? end + 1 : end);
                setCode(beforeText + '>' + '</' + tagMatch[1] + '>' + afterText);
                moveCursor(start + 1);
                return;
            }
        }

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
                selection={forcedSelection}
                setSelection={handleSelectionChange}
                textInputRef={textInputRef}
            />
            {activeTab === 'editor' && (
                <SnippetBar handleSnippetPress={handleSnippetPress} />
            )}
        </SafeAreaView>
    );
}
