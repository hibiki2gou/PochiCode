import { RefObject } from 'react';
import { TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from '../styles';
import { Selection, TabType } from '../types';

interface MainAreaProps {
    activeTab: TabType;
    code: string;
    setCode: (code: string) => void;
    textInputRef: RefObject<TextInput>;
    setSelection: (selection: Selection) => void;
}

export default function MainArea({ activeTab, code, setCode, textInputRef, setSelection }: MainAreaProps) {
    return (
        <View style={styles.main}>
            {activeTab === 'editor' ? (
                <TextInput
                    ref={textInputRef}
                    style={styles.editor}
                    multiline
                    placeholder="ここにコードをポチポチ書きます..."
                    value={code}
                    onChangeText={setCode}
                    onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
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
    );
}
