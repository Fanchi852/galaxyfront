import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ImperiumMenuScreen = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const navigation = useNavigation();

  const handleAddItem = () => {
    // Lógica para agregar un nuevo elemento
  };

  const handleDeleteItem = () => {
    // Lógica para eliminar el elemento seleccionado
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedItem(item.id)}
      style={[
        styles.listItem,
        { backgroundColor: item.id === selectedItem ? '#ccc' : '#fff' },
      ]}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedItem}
      />
      <View style={styles.buttons}>
        <Button title="Agregar" onPress={handleAddItem} />
        <Button title="Eliminar" onPress={handleDeleteItem} />
      </View>
      <Button title="Cerrar sesión" onPress={handleLogout} style={styles.logout} />
    </View>
 );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    logout: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});

export default ImperiumMenuScreen;