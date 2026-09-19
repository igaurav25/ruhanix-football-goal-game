import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LeaderboardUser {
  name: string;
  current_level: number;
  xp: number;
}

export default function LobbyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const playerName = params.name || "Player";
  const playerEmail = params.email || "";
  const playerLevel = params.level || 1;
  const playerXP = params.xp || 0;

  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://10.115.249.171/ruhanix_backend/api/auth/get_leaderboard.php');
      const json = await response.json();
      if (json.status === 'success') {
        setLeaderboardData(json.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLeaderboardVisible(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userSession');
    router.replace('/' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🏆 PRO LOBBY 🏆</Text>

      <View style={styles.card}>
        <Text style={styles.avatar}>🧑‍🎤</Text>
        <Text style={styles.playerName}>{playerName}</Text>
        <Text style={styles.levelText}>Level: {playerLevel}  |  XP: {playerXP}</Text>
      </View>

      {/* Start Match Button */}
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={() => router.push({
          pathname: '/match',
          params: { email: playerEmail, name: playerName }
        } as any)}
      >
        <Text style={styles.playButtonText}>▶ START MATCH</Text>
      </TouchableOpacity>

      {/* Shop & Inventory Button (NEW STEP 4 FEATURE) */}
      <TouchableOpacity 
        style={styles.shopButton} 
        onPress={() => router.push({
          pathname: '/shop',
          params: { email: playerEmail, name: playerName, xp: playerXP }
        } as any)}
      >
        <Text style={styles.shopButtonText}>🛒 OPEN SHOP</Text>
      </TouchableOpacity>

      {/* Leaderboard Button */}
      <TouchableOpacity style={styles.leaderboardButton} onPress={fetchLeaderboard}>
        <Text style={styles.leaderboardButtonText}>🏆 VIEW LEADERBOARD</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={leaderboardVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔥 TOP PLAYERS 🔥</Text>
            
            <FlatList<LeaderboardUser>
              data={leaderboardData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.row}>
                  <Text style={styles.rowText}>{index + 1}. {item.name}</Text>
                  <Text style={styles.rowText}>Lvl: {item.current_level} | {item.xp} XP</Text>
                </View>
              )}
            />

            <TouchableOpacity style={styles.closeButton} onPress={() => setLeaderboardVisible(false)}>
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f3460' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#e94560', marginBottom: 20 },
  card: { backgroundColor: '#1a1a2e', padding: 25, borderRadius: 15, alignItems: 'center', width: '80%', borderWidth: 2, borderColor: '#e94560', marginBottom: 25 },
  avatar: { fontSize: 50, marginBottom: 5 },
  playerName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  levelText: { fontSize: 16, color: '#4caf50', marginTop: 5 },
  playButton: { backgroundColor: '#4caf50', paddingVertical: 15, width: '80%', borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  playButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  shopButton: { backgroundColor: '#9c27b0', paddingVertical: 15, width: '80%', borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  shopButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  leaderboardButton: { backgroundColor: '#ff9800', paddingVertical: 15, width: '80%', borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  leaderboardButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { padding: 10 },
  logoutButtonText: { color: '#a2a2bd', fontSize: 16, textDecorationLine: 'underline' },
  
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { width: '85%', backgroundColor: '#1a1a2e', borderRadius: 15, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#ff9800', maxHeight: '70%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#ff9800', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  rowText: { color: '#fff', fontSize: 16 },
  closeButton: { marginTop: 20, backgroundColor: '#e94560', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 8 },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});