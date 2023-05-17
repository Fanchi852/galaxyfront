import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import BuildingCard from '../components/BuildingCard';

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

const PlanetDetail = ({ planet, onReload, userSessionId, useNavigation, imperium }) => {
  var [planetResources, setPlanetResources] = useState({
    normal_quantity: planet.resources.normal_quantity,
    rare_quantity: planet.resources?.rare_quantity,
    population_quantity: planet.resources?.population_quantity,
  });

  const navigation = useNavigation(); // Hook para la navegación

  useEffect(() => {
    const interval = setInterval(() => {
      setPlanetResources(prevResources => ({
        ...prevResources,
        normal_quantity: prevResources.normal_quantity + planet.normalOreProduction / 3600,
        rare_quantity: prevResources.rare_quantity + planet.rareOreProduction / 3600,
        population_quantity: prevResources.population_quantity + planet.population_changes / 3600
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    setPlanetResources({
      normal_quantity: planet.resources.normal_quantity,
      rare_quantity: planet.resources?.rare_quantity,
      population_quantity: planet.resources?.population_quantity,
    });
  },[planet]);

  if(!planetResources){
    setPlanetResources(() => ({
      normal_quantity: planet.resources.normal_quantity,
      rare_quantity: planet.resources.normal_quantity,
      population_quantity: planet.resources.normal_quantity
    }));
  }

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
          <Text>Nombre del planeta: {planet.name}</Text>
          <Text>Coordenadas: {planet.coordinates}</Text>
          <Text>Descripcion: {planet.planetType.description}</Text>
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
              planet={planet}
              fields = {building.fields}
              userSessionId={userSessionId}
              onReload={() => onReload()}
            />
          ))}
        </View>

        <View style={styles.menuButtons}>
          <Button
          title="ResearchScreen"
          icon={{ name: 'flask', type: 'font-awesome' }}
          onPress={() => {
            navigation.navigate('ResearchScreen', {imperium: imperium, userSessionId: userSessionId});
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

export default PlanetDetail;