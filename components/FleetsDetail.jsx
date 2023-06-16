import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { apiRequest } from '../services/API';
import FleetRow from './FleetRow';
import FleetAction from './FleetAction';
import FleetResources from './FleetResources';
import { commonStyles } from '../styles/CommonStyles';

const FleetsDetail = ({ planet, onReload }) => {  
  const [fleets, setFleets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [resourcesModalVisible, setresourcesModalVisible] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState();

  //trae una lista con todos las flotas que estan en el planeta o se dirigen a el
  async function fetchFleetsList(planet) {
    const endpoint = 'fleet/listfleet';
    const method = 'POST';
    const requestData = {
      "planetId" : planet.planetId,
      "coordinates" : planet.coordinates
    };
    
    try {
      const fleetsList = await apiRequest(endpoint, method, JSON.stringify(requestData));
      return fleetsList;
    } catch (error) {
      console.error("Error fetching fleets list: ", error);
    }
  }

  useEffect(() => {
    async function getFleets() {
      let fleetsList = await fetchFleetsList(planet);
      setFleets(fleetsList);
    }
    getFleets();
  }, [planet]);

  async function openActionsModal(fleet){
    setSelectedFleet(fleet);
    setModalVisible(true);
  }
  async function openResourcesModal(fleet){
    setSelectedFleet(fleet);
    setresourcesModalVisible(true);
  }

  async function changeModalVisible(){
    setModalVisible(false);
    onReload();
  }
  async function handleCloseResourcesModal(){
    setresourcesModalVisible(false);
    onReload();
  }


  return (
    <View style={commonStyles.subContainer}>
      {selectedFleet ? <FleetAction inputVisible={modalVisible} fleet={selectedFleet} onChangeModalVisible={() => changeModalVisible()}/> : null}
      {selectedFleet ? <FleetResources inputVisible={resourcesModalVisible} fleet={selectedFleet} planet={planet} onCloseModal={() => handleCloseResourcesModal()}/> : null}
      <Card containerStyle= {commonStyles.subContainer}>
          <Card.Title>Puerto espacial</Card.Title>
          {fleets?.map(fleet => (
            <FleetRow 
              key={fleet.fleetId}
              fleet={fleet}
              imperium={planet.imperium}
              onOpenActionsModal={(fleet) => openActionsModal(fleet)}
              onOpenResourcesModal={(fleet) => openResourcesModal(fleet)}
            />
          ))}
        </Card>
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

export default FleetsDetail;