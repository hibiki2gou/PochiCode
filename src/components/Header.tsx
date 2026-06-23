import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { TabType } from '../types';

interface HeaderProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
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
