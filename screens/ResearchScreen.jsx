import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import CustomNavigationButtons from '../components/CustomNavigationButtons';
import Swal from 'sweetalert2';

const technologiesImages = {
  '1.jpg': require('../assets/technologies/1.jpg'),
  '2.jpg': require('../assets/technologies/2.jpg'),
  '3.jpg': require('../assets/technologies/3.jpg'),
  '4.jpg': require('../assets/technologies/4.jpg'),
  '5.jpg': require('../assets/technologies/5.jpg'),
  '6.jpg': require('../assets/technologies/6.jpg'),
  '7.jpg': require('../assets/technologies/7.jpg'),
  '8.jpg': require('../assets/technologies/8.jpg'),
  '9.jpg': require('../assets/technologies/9.jpg'),
  '10.jpg': require('../assets/technologies/10.jpg'),
  '11.jpg': require('../assets/technologies/11.jpg'),
  '12.jpg': require('../assets/technologies/12.jpg'),
  '13.jpg': require('../assets/technologies/13.jpg'),
};

// Componente para mostrar la ciencia acumulada por el imperio.
const TotalScience = ({imperium}) => {
  const totalScience = imperium.cientificData;

  return (
    <Card>
      <Card.Title>Investigacion</Card.Title>
        <View style={styles.planetInfo}>
          <Text>{`Ciencia acumulada: ${totalScience}`}</Text>
          <Text>{`Los reportes con nuevos datos cientificos llegaran cada hora`}</Text>
        </View>
    </Card>
  );
};

// esta funcion actualiza una tecnologia
async function fetchUpdateTech(tech) {
  const endpoint = 'technology/techupdate';
  const method = 'POST';
  const requestData = {
    "technologyImperiumId": tech.technology_imperium_id,
    "level": tech.level + 1
  };
  console.log("requestData:", JSON.stringify(requestData, null, 2));
  
  try {
    const UpdateTech = await apiRequest(endpoint, method, JSON.stringify(requestData));
    console.log("UpdateTech:", JSON.stringify(UpdateTech, null, 2));
    if (UpdateTech == 1){
      
    }
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
    <Card>
      <Card.Title>Datos de la Tecnologia</Card.Title>
        <View style={styles.planetInfo}>
          <Text>{`Nombre: ${selectedTech.name}`}</Text>
          <Text>{`Nivel: ${selectedTech.level}`}</Text>
          <Text>{`Descripción: ${selectedTech.descripcion}`}</Text>
          <Text>{`Bono: ${selectedTech.bono}`}</Text>
          <Text>{`Costo: ${selectedTech.basic_cost}`}</Text>
          <Button title="Investigar" onPress={() => increaseLevel(selectedTech)} />
        </View>
    </Card>
  );
};

// Componente para mostrar el árbol de investigación.
const ResearchTree = ({ techList, techType, setTechType, setSelectedTech }) => {
  const [filteredTechList, setFilteredTechList] = useState([]);

  useEffect(() => {
    setFilteredTechList(techList.filter(tech => tech.type === techType));
  }, [techType, techList]);

  return (
    <Card>
      <Card.Title>Tecnologias</Card.Title>
          <View style={styles.planetInfo}>
            <Button title="Tecnologías Militares" onPress={() => {
                console.log("Militares button pressed");
                setTechType('military');
                console.log(`techType is now ${techType}`);
                console.log(`techList is now ${techList}`);
              }} />
            <Button title="Tecnologías Industriales" onPress={() => {
                console.log("Industriales button pressed");
                setTechType('industrial');
                console.log(`techType is now ${techType}`);
                console.log(`techList is now ${techList}`);
              }} />
            <ScrollView>
              {filteredTechList.map(tech => (
                <TouchableOpacity key={tech.technology_imperium_id} onPress={() => setSelectedTech(tech)}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{width: 50, height: 50}}
                      source={{uri : technologiesImages[tech.image]}} />
                  
                    <Text>{tech.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </View>
    </Card>
  );
};

const ResearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imperium, userSessionId } = route.params;
  const [techList, setTechList] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [techType, setTechType] = useState('military');

  const buttonList = [
    {
      key: 1,
      label: "Hangar",
      navigationScreen: "HangarScreen",
      params: { imperium: imperium, userSessionId: userSessionId }
    },
    {
      key: 2,
      label: "Planetas",
      navigationScreen: "PlanetScreen",
      params: { imperium: imperium, userSessionId: userSessionId }
    }
  ];

  // Función para obtener la lista de tecnologías.
  async function fetchTechList(imperium) {
    const endpoint = 'technology/techlist';
    const method = 'POST';
    const requestData = {
      "imperiumId": imperium.imperiumId
    };
    console.log("requestData:", JSON.stringify(requestData, null, 2));
    
    try {
      const techList = await apiRequest(endpoint, method, JSON.stringify(requestData));
      console.log("techList:", JSON.stringify(techList, null, 2));
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
      <CustomNavigationButtons
          navigation={navigation}
          buttonList={buttonList}
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