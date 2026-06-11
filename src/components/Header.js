import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

export default function Header({ activeTab, setActiveTab }) {
    return (
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
    );
}