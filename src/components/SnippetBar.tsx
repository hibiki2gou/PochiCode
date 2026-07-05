import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface SnippetBarProps {
    handleSnippetPress: (snippet: string) => void;
}

export default function SnippetBar({ handleSnippetPress }: SnippetBarProps) {
    const snippets = ['改行', 'Tab', '<', '>', '/', '=', '"', "'", ';', ':', '{', '}', '(', ')', '[', ']', '↩'];

    return (
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
    );
}
