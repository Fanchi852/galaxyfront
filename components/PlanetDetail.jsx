import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BuildingCard from '../components/BuildingCard';
/*
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
*/
const PlanetDetail = ({ planet, onReload, userSessionId }) => {

  const buildingTypes = [
    { id: 3, name: 'Mina', icon: "diamond", fields:[{fieldname: "normal_capacity", label: "capacidad de almacenamiento de minerales comunes"},{fieldname: "normalOreProduction", label: "Produccion"}] },
    { id: 4, name: 'Extractora de minerales raros', icon: "diamond", color: "blue",  fields:[{fieldname: "rare_capacity", label: "capacidad de almacenamiento de minerales raros"},{fieldname: "rareOreProduction", label: "Produccion"}]},
    { id: 5, name: 'Laboratorios de I+D', icon: 'flask', fields:[{fieldname: "cientific_data_changes", label: "produccion de ciencia"}]},
    { id: 6, name: 'Astilleros', icon: 'cog', fields:[{fieldname: "normal_capacity", label: "capacidad de almacenamiento de minerales comunes"}, {fieldname: "rare_capacity", label: "capacidad de almacenamiento de minerales raros"}, {fieldname: "population_capacity", label: "capacidad de viviendas"}]},
    { id: 7, name: 'Ciudad', icon: 'building', fields:[{fieldname: "population_capacity", label: "capacidad de viviendas"},{fieldname: "population_changes", label: "crecimiento de la poblacion"}]},
    { id: 8, name: 'Almacenes', icon: 'cubes', fields:[{fieldname: "normal_capacity", label: "capacidad de almacenamiento de minerales comunes"}, {fieldname: "rare_capacity", label: "capacidad de almacenamiento de minerales raros"}]}
  ];

  return (
    <View>
    <ScrollView contentContainerStyle={{justifyContent: 'center'}}>
      <View style={styles.container}>
        <View style={styles.planetInfo}>
          <Text>Nombre del planeta: {planet.name}</Text>
          <Text>Coordenadas: {planet.coordinates}</Text>
          <Text>Descripcion: {planet.planetType.description}</Text>
        </View>
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
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  padding: 10,
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
});

export default PlanetDetail;