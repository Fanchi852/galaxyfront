import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';
import {TextInput, Button, List, Text, Divider} from 'react-native-paper';
import { commonStyles } from '../styles/CommonStyles';
import { useNavigation, useRoute  } from '@react-navigation/native';
import { apiRequest } from '../services/API';

const EmpireCard = ({
  empireName,
  capitalName,
  coordinates,
  imageUrl,
  onDelete,
}) =>  {
  return (
  <View style={styles.card}>
    {imageUrl ? (
      <Image source={{ uri: imageUrl }} style={styles.image} />
    ) : (
      <View style={styles.imagePlaceholder} />
    )}
    <View style={styles.cardInfo}>
      <Text>Nombre imperio: {empireName}</Text>
      <Text>Nombre capital: {capitalName}</Text>
      <Text>Coordenadas: {coordinates}</Text>
    </View>
    <Button mode="contained" onPress={onDelete} style={styles.deleteButton} compact>
      X
    </Button>
  </View>
  );
};

const ImperiumMenuScreen = () => {
  const [empireName, setEmpireName] = useState('');
  const [empireList, setEmpireList] = useState([]);

  const route = useRoute(); // Obtiene información sobre la ruta actual
  const userSessionId = route.params.userSessionId; // Obtiene el userSession_id desde los parámetros de la ruta

  useEffect(() => {
    const fetchEmpires = async () => {
      try {
        const endpoint = 'imperium/loadimperium';
        const method = 'POST';
        const requestData = {
          userSession_id: userSessionId,
          name: empireName,
        };
        const responseData = await apiRequest(endpoint, method, JSON.stringify(requestData));
        // Actualiza la lista de imperios con la respuesta del servidor
        setEmpireList(responseData);
      } catch (error) {
        console.error('Error fetching empires:', error);
      }
    };
    fetchEmpires();
  }, []);

  const addEmpire = () => {
    // Comprobar que el imperio no exista previamente.
    if (!empireList.some((empire) => empire.empireName === empireName)) {
      // Añadir el imperio a la lista (aquí puedes agregar la información correspondiente).
      setEmpireList([
        ...empireList,
        { empireName, capitalName: '', coordinates: '', imageUrl: '' },
      ]);
      setEmpireName('');
    }
  };
  
  const searchEmpire = () => {
    if (empireName) {
      const filteredList = empireList.filter((empire) =>
        empire.empireName.toLowerCase().includes(empireName.toLowerCase())
      );
      setEmpireList(filteredList);
    } else {
      // Restaurar la lista de imperios completa si el término de búsqueda está vacío
      setEmpireList(empireList);

    }
  };
  const deleteEmpire = (index) => {
    // Eliminar el imperio de la lista.
    setEmpireList(empireList.filter((_, i) => i !== index));
  };

  const logout = () => {
    // Cerrar sesión y volver a la pantalla de inicio.
    useNavigation.navigate('Login');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedItem(item.id)}
      style={commonStyles.listItem}
    >
      <Image
        source={require('../assets/1.jpg')} // Añade la ruta de la imagen de muestra
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text>Nombre imperio: {item.empireName}</Text>
        <Text>Nombre capital: {item.capitalName}</Text>
        <Text>Coordenadas: {item.coordinates}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Imperium</Text>
      <TextInput
        label="Nombre del imperio"
        value={empireName}
        onChangeText={(text) => setEmpireName(text)}
      />
      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={addEmpire}>
          Añadir
        </Button>
        <Button mode="contained" onPress={searchEmpire}>
          Buscar
        </Button>
      </View>
      {empireList.map((empire, index) => (
        <EmpireCard
          key={index}
          {...empire}
          onDelete={() => deleteEmpire(index)}
        />
      ))}
      <Button mode="contained" onPress={logout} style={styles.logoutButton}>
        Cerrar sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
  backgroundColor: '#ccc',
  marginRight: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardInfo: {
    flexShrink: 1,
  },
  deleteButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 16,
  },
});

export default ImperiumMenuScreen;