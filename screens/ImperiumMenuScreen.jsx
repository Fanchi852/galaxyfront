import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Asset } from 'expo-asset';
import { TextInput, Button, Text } from 'react-native-paper';
import { commonStyles } from '../styles/CommonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import AlertModal from '../components/AlertModal';

var myUserSessionId = null;
var imperiums = null;

const planetImages = {
  '1.png': require('../assets/planets/1.png'),
  '2.png': require('../assets/planets/2.png'),
  '3.png': require('../assets/planets/3.png'),
  '4.png': require('../assets/planets/4.png'),
  '5.png': require('../assets/planets/5.png'),
  '6.png': require('../assets/planets/6.png'),
  '7.png': require('../assets/planets/7.png'),
  '8.png': require('../assets/planets/8.png'),
  '9.png': require('../assets/planets/9.png'),
};
const getPlanetImageUrl = async (imageFilename) => {
  const asset = Asset.fromModule(planetImages[imageFilename]);
  await asset.downloadAsync();
  return asset.uri;
};

//funcion para buscar un imperio en una lista de imperios
const findEmpire = (empireList, empireName) => {
  for (let i = 0; i < empireList.length; i++) {
    if (empireList[i].name === empireName) {
      return empireList[i];
    }
  }
  return null;
};

// Componente para mostrar la tarjeta de información del imperio
const EmpireCard = React.memo(({ imperium, onDelete }) => {
  const navigation = useNavigation(); // Hook para la navegación
  const goToPlanetScreen = () => {
    // Busca el imperio en la lista de imperios
    const myImperium = findEmpire(imperiums, imperium.empireName);
    navigation.navigate('PlanetScreen', { imperium: myImperium, userSessionId: myUserSessionId });
  };
  return (
    // Muestra la imagen del imperio si está disponible, de lo contrario muestra un marcador de posición.
    // Despues muestra la información del imperio
    // y por ultimo muestra el botón para eliminar el imperio
    <View style={commonStyles.card}>
      <View style={commonStyles.leftSection}>
        {imperium.imageUrl ? (
          <Image source={imperium.imageUrl ? { uri: imperium.imageUrl } : null} style={commonStyles.image} />
        ) : (
          <View style={commonStyles.imagePlaceholder} />
        )}
        <View style={commonStyles.cardInfo}>
          <Text>Nombre imperio: {imperium.empireName}</Text>
          <Text>Nombre capital: {imperium.capitalName}</Text>
          <Text>Coordenadas: {imperium.coordinates}</Text>
        </View>
      </View>
      <View style={commonStyles.buttonGroup}>
        <TouchableOpacity onPress={goToPlanetScreen} style={commonStyles.enterButton}>
          <Text style={commonStyles.enterButtonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={commonStyles.deleteButton}>
          <Image source={require('../assets/trash_icon.png')} style={commonStyles.trashIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

// Pantalla principal de ImperiumMenu
const ImperiumMenuScreen = () => {
  // Estado para almacenar el nombre del imperio y la lista de imperios
  const [empireName, setEmpireName] = useState('');
  const [empireList, setEmpireList] = useState([]);
  // Añade un nuevo estado para almacenar la lista original
  const [originalEmpireList, setOriginalEmpireList] = useState([]);
  const navigation = useNavigation(); // Hook para la navegación

  // Hooks para obtener información sobre la ruta y navegación
  const route = useRoute(); // Obtiene información sobre la ruta actual
  const userSessionId = route.params.userSessionId; // Obtiene el userSession_id desde los parámetros de la ruta
  myUserSessionId = userSessionId;

  // variables para el modal de alertas
  var [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertModalData, setAlertModalData] = useState({});
  const [empireToDelete, setEmpireToDelete] = useState({});

  async function handleCloseAlertModal(buttonNamePressed) {
    setAlertModalVisible(false);

    if (buttonNamePressed === 'CONFIRM') {
      try {
        const endpoint = 'imperium/deleteimperium';
        const method = 'POST';
        const requestData = {
          session_id: userSessionId,
          imperium_name: empireToDelete.empireName,
        };
        const responseData = await apiRequest(endpoint, method, JSON.stringify(requestData));
        const updatedEmpireList = empireList.filter(imperium => imperium.empireName !== empireToDelete.empireName);
        //const updatedEmpireList = empireList.filter((_, i) => i !== index);
        updateEmpireLists(updatedEmpireList);
        setAlertModalData({
          title: 'Eliminado!',
          text: 'El imperio ha sido eliminado.',
          icon: 'ok',
          buttons: [
            {
              name: 'CLOSE',
              text: 'Aceptar',
              syle: commonStyles.buttonOk,
              textStyle: commonStyles.textStyle
            }
          ]
        })
        setAlertModalVisible(true);
      } catch (error) {
        setAlertModalData({
          title: 'Error!',
          text: 'Error al eliminar el imperio',
          icon: 'error',
          buttons: [
            {
              name: 'CLOSE',
              text: 'Aceptar',
              syle: commonStyles.buttonOk,
              textStyle: commonStyles.textStyle
            }
          ]
        })
        setAlertModalVisible(true);
      }
    } else {
      setEmpireToDelete(null);
    }
  }

  const updateEmpireLists = (newEmpireList) => {
    setEmpireList(newEmpireList);
    setOriginalEmpireList(newEmpireList);
  };

  // El useEffect para cargar la lista de imperios al montar el componente
  useEffect(() => {
    const fetchEmpires = async () => {
      try {
        // Configurar la petición a la API
        const endpoint = 'imperium/loadimperium';
        const method = 'POST';
        const requestData = {
          userSession_id: userSessionId,
        };
        // Realizar la petición a la API y almacenar la respuesta en una variable
        const responseData = await apiRequest(endpoint, method, JSON.stringify(requestData));
        // Actualiza la lista de imperios con la respuesta del servidor
        imperiums = responseData;
        // Mapea la estructura de los datos recibidos de la API a la estructura esperada
        const mappedData = await Promise.all(responseData.map(async empire => {
          const imageUrl = await getPlanetImageUrl(empire.planet.planetType.image);
          return {
            empireName: empire.name,
            capitalName: empire.planet.name || '',
            coordinates: empire.planet.coordinates || '',
            imageUrl: imageUrl,
          };
        }));
        // Actualiza la lista original y la lista de imperios con los datos mapeados
        updateEmpireLists(mappedData);
      } catch (error) {
        setAlertModalData({
          title: 'Error!',
          text: 'Error inesperado.',
          icon: 'error',
          buttons: [
            {
              name: 'CLOSE',
              text: 'Aceptar',
              syle: commonStyles.buttonOk,
              textStyle: commonStyles.textStyle
            }
          ]
        })
        setAlertModalVisible(true);
      }
    };
    fetchEmpires();
  }, []);

  // Función para agregar un nuevo imperio a la lista
  const addEmpire = async () => {
    try {
      const endpoint = 'imperium/createImperium';
      const method = 'POST';
      const requestData = {
        session_id: userSessionId,
        name: empireName,
      };
      const responseData = await apiRequest(endpoint, method, JSON.stringify(requestData));
      if (responseData.hasOwnProperty('name')) {
        imperiums.push(responseData);
        const imageUrl = await getPlanetImageUrl(responseData.planet.planetType.image);
        const newEmpire = {
          empireName: empireName,
          capitalName: responseData.planet.name,
          coordinates: responseData.planet.coordinates,
          imageUrl: imageUrl || '',
        };
        const updatedEmpireList = [...empireList, newEmpire];
        updateEmpireLists(updatedEmpireList);
        setEmpireName('');
      } else {
        setAlertModalData({
          title: 'Error!',
          text: 'Error inesperado. No se pudo crear el imperio.',
          icon: 'error',
          buttons: [
            {
              name: 'CLOSE',
              text: 'Aceptar',
              syle: commonStyles.buttonOk,
              textStyle: commonStyles.textStyle
            }
          ]
        })
        setAlertModalVisible(true);
      }
    } catch (error) {
      setAlertModalData({
        title: 'Error!',
        text: 'Error inesperado. Error al agregar el imperio.',
        icon: 'error',
        buttons: [
          {
            name: 'CLOSE',
            text: 'Aceptar',
            syle: commonStyles.buttonOk,
            textStyle: commonStyles.textStyle
          }
        ]
      })
      setAlertModalVisible(true);
    }
  };

  // Función para buscar imperios en la lista
  const searchEmpire = () => {
    if (empireName) {
      // Filtra la lista de imperios según el término de búsqueda ingresado
      const filteredList = originalEmpireList.filter((empire) =>
        empire.empireName.toLowerCase().includes(empireName.toLowerCase())
      );
      setEmpireList(filteredList);
    } else {
      // Restaurar la lista de imperios completa si el término de búsqueda está vacío
      setEmpireList(originalEmpireList);
    }
  };

  // Función para eliminar un imperio de la lista
  const deleteEmpire = async (index) => {
    let empireToDeleteAux = empireList[index];
    setEmpireToDelete(empireToDeleteAux);
    const showDeleteAlert = async () => {

      setAlertModalData({
        title: '¿Estás seguro?',
        text: 'No podrás deshacer esta acción.',
        icon: 'warning',
        buttons: [
          {
            name: 'CONFIRM',
            text: 'Sí, eliminar',
            syle: commonStyles.buttonOk,
            textStyle: commonStyles.textStyle
          },
          {
            name: 'CLOSE',
            text: 'Cancelar',
            syle: commonStyles.buttonCancel,
            textStyle: commonStyles.textStyle
          }
        ]
      });
      setAlertModalVisible(true);
    };

    showDeleteAlert();
  };

  // Función para cerrar sesión y navegar a la pantalla de inicio
  const logout = () => {
    // Cerrar sesión y volver a la pantalla de inicio.
    navigation.navigate('Login');
  };

  return (
    <View style={commonStyles.container}>
      <View>
        <Text style={commonStyles.texTitle}>Menu Imperium</Text>
        <View>
          <TextInput
            label="Nombre del imperio"
            value={empireName}
            style={commonStyles.inputImperiumSearch}
            onChangeText={(text) => setEmpireName(text)}
          />
        </View>
        <View style={commonStyles.horizontalAlign}>
          <Button mode="contained" style={commonStyles.brandButton} onPress={addEmpire}>
            Añadir
          </Button>
          <Button mode="contained" style={commonStyles.brandButton} onPress={searchEmpire}>
            Buscar
          </Button>
        </View>
        <FlatList
          data={empireList}
          renderItem={({ item, index }) => (
            <EmpireCard
              key={index}
              {...item}
              imperium={item}
              onDelete={() => deleteEmpire(index)}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          extraData={originalEmpireList}
        />
        <View style={commonStyles.horizontalAlign}>
          <Button mode="contained" onPress={logout} style={commonStyles.logoutButton}>
            Cerrar sesión
          </Button>
        </View>
      </View>
      <View>
        <AlertModal
          inputVisible={alertModalVisible}
          data={alertModalData}
          onCloseModal={(buttonNamePressed) => handleCloseAlertModal(buttonNamePressed)}
        />
      </View>
    </View>
  );
};
export default ImperiumMenuScreen;