import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import PlanetListBanner from '../components/PlanetListBanner';
import PlanetDetail from '../components/PlanetDetail';
import CustomNavigationButtons from '../components/CustomNavigationButtons';
import FleetsDetail from '../components/FleetsDetail';
import PlanetResources from '../components/PlanetResources';
import { commonStyles } from '../styles/CommonStyles';

const PlanetScreen = ({ route }) => {
  const { imperium, userSessionId } = route.params;
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const navigation = useNavigation();

  const buttonList = [
    {
      key: 1,
      label: "Investigación",
      navigationScreen: "ResearchScreen",
      params: { imperium: imperium, userSessionId: userSessionId }
    },
    {
      key: 2,
      label: "Hangar",
      navigationScreen: "HangarScreen",
      params: { imperium: imperium, userSessionId: userSessionId }
    }
  ];

  // esta funcion recarga el imperio
async function fetchReloadImperium(userSessionId) {
  const endpoint = 'imperium/loadimperium';
  const method = 'POST';
  const requestData = {
    "userSession_id": userSessionId
  };
  console.log("requestData:", JSON.stringify(requestData, null, 2));
  
  try {
    const reloadImperium = await apiRequest(endpoint, method, JSON.stringify(requestData));
    console.log("Imperium reload :", JSON.stringify(UpdateTech, null, 2));
    if (UpdateTech == 1){
      
    }
    return reloadImperium;
  } catch (error) {
    console.error("Error fetching Update Tech:", error);
  }
}

  useEffect(() => {
    async function getPlanets() {
      let planetsList = await fetchPlanetsList(imperium);
      setPlanets(planetsList);
      setSelectedPlanet(planetsList[0]);
    }
  
    getPlanets();
  }, [imperium]);

  //trae una lista con todos los planetas del imperio
  async function fetchPlanetsList(imperium) {
    const endpoint = 'planet/findplanets';
    const method = 'POST';
    const requestData = {
      "imperium":{"imperiumId":imperium.imperiumId}
    };
    
    try {
      const planetsList = await apiRequest(endpoint, method, JSON.stringify(requestData));
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

  async function reload(){
    let planetsList = await fetchPlanetsList(imperium);
    setPlanets(planetsList);
    let auxselectedPlanet = planetsList.find(planet => planet.planetId == selectedPlanet.planetId);
    setSelectedPlanet(auxselectedPlanet);
  }

  if(selectedPlanet && planets){
    return (
      <View style={commonStyles.container}>
        <ScrollView>
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
            onReload={() => reload()}
          />
          <PlanetDetail 
            planet={selectedPlanet}
            userSessionId={userSessionId}
            useNavigation={useNavigation}
            imperium={imperium}
            onReload={() => fetchPlanetsList(imperium)}
          />
          <CustomNavigationButtons
            navigation={navigation}
            buttonList={buttonList}
          />
        </ScrollView>
    </View>
    );
  }
};

export default PlanetScreen;