import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';

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

const PlanetListBanner = ({ planetList, planet, onSelectParent }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(planet);

  async function changePlanet(planetInput){
    setSelectedPlanet(planetInput);
    onSelectParent(planetInput);
  }

  return (
    <View>
      <FlatList
        horizontal
        data={planetList}
        renderItem={({ item }) => (
          <PlanetImage
            planet={item}
            selected={selectedPlanet === item}
            onSelect={changePlanet}
          />
        )}
        keyExtractor={(item) => item.planetId.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default PlanetListBanner;