import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import { commonStyles } from '../styles/CommonStyles';
import BuildingCard from '../components/BuildingCard';
import PlanetListBanner from '../components/PlanetListBanner';
import PlanetDetail from '../components/PlanetDetail';
import Swal from 'sweetalert2';

const PlanetScreen = ({ route }) => {
  const { imperium, userSessionId } = route.params;
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  console.log("este es el imperium", imperium, "este es el userSessionId", userSessionId, "este es el planeta seleccionado", selectedPlanet);

  useEffect(() => {
    async function getPlanets() {
      let planetsList = await fetchPlanetsList(imperium);
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
    console.log("FJMO: requestData:", JSON.stringify(requestData, null, 2));
    
    try {
      const planetsList = await apiRequest(endpoint, method, JSON.stringify(requestData));
      console.log("FJMO: planetsList:", JSON.stringify(planetsList, null, 2));
      return planetsList;
    } catch (error) {
      console.error("Error fetching planets list:", error);
    }
  }

  async function changePlanet(planetInput){
    let planetsList = await fetchPlanetsList(imperium);
    setPlanets(planetsList);
    setSelectedPlanet(planetInput);
  }

  if(selectedPlanet && planets){
    return (
      <View>
        <PlanetListBanner 
          planetList={planets}
          planet={selectedPlanet}
          onSelectParent={(planetInput) => changePlanet(planetInput)}
        />
        <PlanetDetail 
          planet={selectedPlanet}
          userSessionId={userSessionId}
          useNavigation={useNavigation}
          imperium={imperium}
          onReload={() => fetchPlanetsList(imperium)}
        />
    </View>
    );
  }
};

export default PlanetScreen;