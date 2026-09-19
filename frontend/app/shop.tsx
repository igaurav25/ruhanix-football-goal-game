import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface ShopItem {
  id: number;
  item_name: string;
  item_type: string;
  price_xp: number;
  icon: string;
}

export default function ShopScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const playerName = params.name || "Player";
  const playerEmail = params.email || "";
  const playerXP = Number(params.xp) || 0;

  const [items, setItems] = useState<ShopItem[]>([]);

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      const response = await fetch('http://10.115.249.171/ruhanix_backend/api/auth/get_shop.php');
      const json = await response.json();
      if (json.status === 'success') {
        setItems(json.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const buyItem = (item: ShopItem) => {
    if (playerXP >= item.price_xp) {
      Alert.alert("Success! 🎉", `You successfully unlocked ${item.item_name}!`);
    } else {
      Alert.alert("Not Enough XP ❌", `You need ${item.price_xp - playerXP} more XP to buy this item.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🛒 RUHANIX SHOP 🛒</Text>
      <Text style={styles.xpText}>Your Balance: {playerXP} XP</Text>

      <FlatList<ShopItem>
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.itemName}>{item.item_name}</Text>
              <Text style={styles.itemType}>{item.item_type} • {item.price_xp} XP</Text>
            </View>
            <TouchableOpacity style={styles.buyButton} onPress={() => buyItem(item)}>
              <Text style={styles.buyButtonText}>UNLOCK</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← BACK TO LOBBY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f3460', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#ff9800', textAlign: 'center', marginBottom: 5 },
  xpText: { fontSize: 16, color: '#4caf50', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: '#1a1a2e', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  itemIcon: { fontSize: 35, marginRight: 15 },
  infoContainer: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  itemType: { fontSize: 14, color: '#a2a2bd', marginTop: 3 },
  buyButton: { backgroundColor: '#e94560', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  backButton: { marginTop: 15, backgroundColor: '#16213e', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e94560' },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});