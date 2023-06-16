import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import { commonStyles } from '../styles/CommonStyles';
import BuildingCard from '../components/BuildingCard';
import PlanetListBanner from '../components/PlanetListBanner';
import FleetsDetail from '../components/FleetsDetail';
import CustomNavigationButtons from '../components/CustomNavigationButtons';
import PlanetResources from '../components/PlanetResources';
import Swal from 'sweetalert2';

import ShipyardsDetails from '../components/ShipyardsDetails';

const HangarScreen = ({ route }) => {
  const { imperium, userSessionId } = route.params;
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  console.log("este es el imperium", imperium, "este es el userSessionId", userSessionId, "este es el planeta seleccionado", selectedPlanet);

  const navigation = useNavigation();

  const buttonList = [
    {
      key: 1,
      label: "Planetas",
      navigationScreen: "PlanetScreen",
      params: { imperium: imperium, userSessionId: userSessionId }
    },
    {
      key: 2,
      label: "Investigación",
      navigationScreen: "ResearchScreen",
      params: { imperium: imperium, userSessionId: userSessionId }
    }
  ];

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
    //console.log("requestData:", JSON.stringify(requestData, null, 2));
    
    try {
      const planetsList = await apiRequest(endpoint, method, JSON.stringify(requestData));
      //console.log("planetsList:", JSON.stringify(planetsList, null, 2));
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
      <View style={commonStyles.container}>
        <PlanetListBanner 
          planetList={planets}
          planet={selectedPlanet}
          onSelectParent={(planetInput) => changePlanet(planetInput)}
        />
        <PlanetResources
          planet={selectedPlanet}
        />
        <FleetsDetail 
          planet={selectedPlanet}
          imperium={imperium}
        />
        <ShipyardsDetails
          planet={selectedPlanet}
          imperium={imperium}
        />
        <CustomNavigationButtons
          navigation={navigation}
          buttonList={buttonList}
        />
    </View>
    );
  }
};

export default HangarScreen;