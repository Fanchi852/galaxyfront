import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import { commonStyles } from '../styles/CommonStyles';
import BuildingCard from '../components/BuildingCard';
import Swal from 'sweetalert2';

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

const PlanetImage = ({ planet, selected, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(planet)}>
      <Image
        style={[
          styles.planetImage,
          selected ? styles.selectedPlanet : null
        ]}
        source={{uri: planetImages[planet.planetType.image]}} 
      />
    </TouchableOpacity>
  );
};

const PlanetScreen = ({ route }) => {
  const { imperium, userSessionId } = route.params;
  console.log("este es el imperium", imperium, "este es el userSessionId", userSessionId);
  const [planetResources, setPlanetResources] = useState({
    normal_quantity: imperium.planet.resources.normal_quantity,
    rare_quantity: imperium.planet.resources.rare_quantity,
    population_quantity: imperium.planet.resources.population_quantity,
  });
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    async function getPlanets() {
      const planetsList = await fetchPlanetsList(imperium);
      setPlanets(planetsList);
      setSelectedPlanet(planetsList[0]);
    }
  
    getPlanets();
  }, []);

  //trae una lista con todos los planetas del imperio
  async function fetchPlanetsList(imperium) {
    const endpoint = 'planet/findplanets';
    const method = 'POST';
    const requestData = {
      "imperium":{"imperiumId":imperium.imperiumId}
    };
    console.log("requestData:", requestData);
    console.log("JSON.stringify(requestData):", JSON.stringify(requestData));
    
    try {
      const responseData = await apiRequest(endpoint, method, JSON.stringify(requestData));
      console.log("responseData: ", responseData);
      return responseData;
    } catch (error) {
      console.error("Error fetching planets list:", error);
    }
  }

  // Actualizar recursos cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setPlanetResources(prevResources => ({
        ...prevResources,
        normal_quantity: prevResources.normal_quantity + imperium.planet.normalOreProduction / 3600,
        rare_quantity: prevResources.rare_quantity + imperium.planet.rareOreProduction / 3600,
        population_quantity: prevResources.population_quantity + imperium.planet.population_changes / 3600
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const buildingTypes = [
    { id: 3, name: 'Mina', icon: "diamond", fields:[{fieldname: "normal_capacity", label: "capacidad de almacenamiento de minerales comunes"},{fieldname: "normalOreProduction", label: "Produccion"}] },
    { id: 4, name: 'Extractora de minerales raros', icon: "diamond", color: "blue",  fields:[{fieldname: "rare_capacity", label: "capacidad de almacenamiento de minerales raros"},{fieldname: "rareOreProduction", label: "Produccion"}]},
    { id: 5, name: 'Laboratorios de I+D', icon: 'flask', fields:[{fieldname: "cientific_data_changes", label: "produccion de ciencia"}]},
    { id: 6, name: 'Astilleros', icon: 'cog', fields:[{fieldname: "normal_capacity", label: "capacidad de almacenamiento de minerales comunes"}, {fieldname: "rare_capacity", label: "capacidad de almacenamiento de minerales raros"}, {fieldname: "population_capacity", label: "capacidad de viviendas"}]},
    { id: 7, name: 'Ciudad', icon: 'building', fields:[{fieldname: "population_capacity", label: "capacidad de viviendas"},{fieldname: "population_changes", label: "crecimiento de la poblacion"}]},
    { id: 8, name: 'Almacenes', icon: 'cubes', fields:[{fieldname: "normal_capacity", label: "capacidad de almacenamiento de minerales comunes"}, {fieldname: "rare_capacity", label: "capacidad de almacenamiento de minerales raros"}]}
  ];

  return (
    <ScrollView contentContainerStyle={{justifyContent: 'center'}}>
      <View style={styles.container}>
        <FlatList
          horizontal
          data={planets}
          renderItem={({ item }) => (
            <PlanetImage
              planet={item}
              selected={selectedPlanet === item}
              onSelect={setSelectedPlanet}
            />
          )}
          keyExtractor={(item) => item.planetId.toString()}
          showsHorizontalScrollIndicator={false}
        />
        <ImageBackground
          source={selectedPlanet?planetImages[selectedPlanet.planetType.image]:imperium.planet.planetType.image}
          style={styles.backgroundImage}
        >
          <Card>
            <Card.Title>Recursos</Card.Title>
            <View style={styles.resourcesContainer}>
              <View style={styles.resourceColumn}>
                <Icon name="diamond" type="font-awesome" />
                <Text>Minerales normales: {planetResources.normal_quantity.toFixed(2)}</Text>
              </View>
              <View style={styles.resourceColumn}>
                <Icon name="diamond" type="font-awesome" color="blue" />
                <Text>Minerales raros: {planetResources.rare_quantity.toFixed(2)}</Text>
              </View>
              <View style={styles.resourceColumn}>
                <Icon name="users" type="font-awesome" />
                <Text>Población: {planetResources.population_quantity.toFixed(0)}</Text>
              </View>
            </View>
          </Card>


          <View style={styles.planetInfo}>
            <Text>Nombre del planeta: {imperium.planet.name}</Text>
            <Text>Coordenadas: {imperium.planet.coordinates}</Text>
          </View>

          <Card>
            <Card.Title>Puerto espacial</Card.Title>
            <Text>Lista de flotas en el planeta (si hay)</Text>
          </Card>

          <View>
            <Text style={styles.buildingTitle}>Construcciones</Text>
            {buildingTypes.map(building => (
              <BuildingCard 
                key={building.id} 
                building={building} 
                color={building.color}
                imperium={imperium}
                fields = {building.fields}
              //onPress={() => fetchBuildingData(building.id)}
              />
            ))}
          </View>

          <View style={styles.menuButtons}>
            <Button
            title="Laboratorio"
            icon={{ name: 'flask', type: 'font-awesome' }}
            onPress={() => {
              // Navegar a la pantalla de Laboratorio de Investigaciones
            }}
          />
          <Button
            title="Hangar"
            icon={{ name: 'rocket', type: 'font-awesome' }}
            onPress={() => {
              // Navegar a la pantalla de Hangares
            }}
          />
        </View>
      </ImageBackground>
    </View>
    </ScrollView>
  );
};
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
  planetImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  selectedPlanet: {
    borderWidth: 2,
    borderColor: 'gold',
  },
});

export default PlanetScreen;