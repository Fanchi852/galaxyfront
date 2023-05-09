import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import { commonStyles } from '../styles/CommonStyles';
import BuildingCard from '../components/BuildingCard';
import Swal from 'sweetalert2';

const PlanetScreen = ({ route }) => {
  const { imperium, userSessionId } = route.params;
  console.log("este es el imperium", imperium, "este es el userSessionId", userSessionId);
  const [planetResources, setPlanetResources] = useState({
    normal_quantity: imperium.planet.resources.normal_quantity,
    rare_quantity: imperium.planet.resources.rare_quantity,
    population_quantity: imperium.planet.resources.population_quantity,
  });

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
    { id: 1, name: 'Mina', icon: "diamond" },
    { id: 2, name: 'Extractora de minerales raros', icon: "diamond", color: "blue"  },
    { id: 3, name: 'Laboratorios de I+D', icon: 'flask' },
    { id: 4, name: 'Astilleros', icon: 'cog' },
    { id: 5, name: 'Ciudad', icon: 'building' },
    { id: 6, name: 'Almacenes', icon: 'cubes' }
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
            <BuildingCard key={building.id} building={building} color={building.color}/>
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

export default PlanetScreen;