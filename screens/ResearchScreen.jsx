import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ImageBackground, Picker } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import Swal from 'sweetalert2';

// Componente para mostrar la ciencia acumulada por el imperio.
const TotalScience = ({imperium}) => {
  const totalScience = imperium.cientificData;
  return (
    <Card>
      <Card.Title>Imvestigacion</Card.Title>
        <View style={styles.planetInfo}>
          <Text>{`Ciencia acumulada: ${totalScience}`}</Text>
        </View>
    </Card>
  );
};

// esta funcion actualiza una tecnologia
async function fetchUpdateTech(tech) {
  const endpoint = 'Technology/findplanets';
  const method = 'POST';
  const requestData = {
    "technology_imperium_id": tech.technology_imperium_id,
    "level": tech.level + 1
  };
  console.log("FJMO: requestData:", JSON.stringify(requestData, null, 2));
  
  try {
    const UpdateTech = await apiRequest(endpoint, method, JSON.stringify(requestData));
    console.log("FJMO: UpdateTech:", JSON.stringify(UpdateTech, null, 2));
    return UpdateTech;
  } catch (error) {
    console.error("Error fetching Update Tech:", error);
  }
}

// Componente para mostrar la investigación seleccionada.
const SelectedResearch = ({ selectedTech }) => {
  if (!selectedTech) return null;
  
  const increaseLevel = (tech) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres investigar ${tech.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        fetchUpdateTech(tech);
        Swal.fire(
          '¡Investigación iniciada!',
          `La investigación de ${tech.name} ha comenzado.`,
          'success'
        );
      }
    });
  };

  return (
    <View>
      <Text>{`Nombre: ${selectedTech.name}`}</Text>
      <Text>{`Descripción: ${selectedTech.descripcion}`}</Text>
      <Text>{`Bono: ${selectedTech.bono}`}</Text>
      <Text>{`Costo: ${selectedTech.basic_cost}`}</Text>
      <Button title="Investigar" onPress={() => increaseLevel(selectedTech)} />
    </View>
  );
};

// Componente para mostrar el árbol de investigación.
const ResearchTree = ({ techList, techType, setTechType, setSelectedTech }) => {
  const filteredTechList = techList.filter(tech => tech.type === techType);
  
  return (
    <View>
      <Button title="Tecnologías Militares" onPress={() => {
          console.log("Militares button pressed");
          setTechType('military');
          console.log(`techType is now ${techType}`);
        }} />
      <Button title="Tecnologías Industriales" onPress={() => {
          console.log("Industriales button pressed");
          setTechType('industrial');
          console.log(`techType is now ${techType}`);
        }} />
      <ScrollView>
        {filteredTechList.map(tech => (
          <TouchableOpacity key={tech.technology_imperium_id} onPress={() => setSelectedTech(tech)}>
            <Image source={tech.image} />
            <Text>{tech.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Componente para los botones de navegación.
const NavigationButtons = ({ navigation, imperium, userSessionId }) => {
  return (

    <View style={styles.menuButtons}>
      <Button
      title="Hangar"
      icon={{ name: 'flask', type: 'font-awesome' }}
      onPress={() => {
        navigation.navigate('Hangar', {imperium: imperium, userSessionId: userSessionId});
        // Navegar a la pantalla de hangares
      }}
      />
      <Button
        title="Planeta"
        icon={{ name: 'globe', type: 'font-awesome' }}
        onPress={() => {
          navigation.navigate('PlanetScreen', {imperium: imperium, userSessionId: userSessionId});
          // Navegar a la pantalla de planetas
        }}
      />
    </View>

  );
};

const ResearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imperium, userSessionId } = route.params;
  const [techList, setTechList] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [techType, setTechType] = useState('military');

  // Función para obtener la lista de tecnologías.
  async function fetchTechList(imperium) {
    const endpoint = 'Technology/techlist';
    const method = 'POST';
    const requestData = {
      "imperiumId":"5"
    };
    console.log("FJMO: requestData:", JSON.stringify(requestData, null, 2));
    
    try {
      const planetsList = await apiRequest(endpoint, method, JSON.stringify(requestData));
      console.log("FJMO: techList:", JSON.stringify(planetsList, null, 2));
      return techList;
    } catch (error) {
      console.error("Error fetching technologies list:", error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const fetchedTechList = await fetchTechList(imperium);
        setTechList(fetchedTechList);
      } catch (error) {
        console.error("Error setting technologies list:", error);
      }
    })();
  }, [imperium]);

  return (
    <View>
      <TotalScience 
        imperium={imperium} 
      />
      <SelectedResearch 
        selectedTech={selectedTech} 
      />
      <ResearchTree 
        techList={techList} 
        techType={techType} 
        setTechType={setTechType} 
        setSelectedTech={setSelectedTech} 
      />
      <NavigationButtons 
        navigation={navigation} 
        imperium={imperium} 
        userSessionId={userSessionId} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  padding: 10,
  },
  resourceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  },
  planetInfo: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  marginVertical: 10,
  },
  buildingTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  marginVertical: 10,
  },
  menuButtons: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 10,
  },
  resourcesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  resourceColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default ResearchScreen;