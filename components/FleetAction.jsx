import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions} from 'react-native';
import PlanetListBanner from '../components/PlanetListBanner';
import { apiRequest } from '../services/API';

var windowWidth = Dimensions.get('window').width;
console.log("ancho de la pagina: ", windowWidth);

const FleetAction = ( {inputVisible, fleet, onChangeModalVisible} ) => {
  var [modalVisible, setModalVisible] = useState(false);
  var [planetsList, setPlanetsList] = useState([]);
  var [starsList, setStarList] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  
  const fleetTypestranslation = {
    "exploration": "Exploración",
    "military": "Militar",
    "transport": "Transporte"
  }

  //trae una lista con todos los planetas de la estrella en la que estemos
  async function fetchPlanetsList(fleet) {
    const endpoint = 'planet/findplanets';
    const method = 'POST';
    const requestData = {
      "star":{"starId": fleet.coordinates.split(":")[0]}
    };
    
    try {
      let planetsListData = await apiRequest(endpoint, method, JSON.stringify(requestData));
      setplanets(planetsListData);
      
      //return planetsListData;
    } catch (error) {
      console.error("Error fetching planets list:", error);
    }
    
  }

  useEffect(()=>{
    setModalVisible(inputVisible);
    if(inputVisible){
      async function getPlanetsFleet() {
        await fetchPlanetsList(fleet);
      }
      getPlanetsFleet();
    }
  },[inputVisible]);

  async function changeModalVisible(){
    onChangeModalVisible(!modalVisible);
  }

  //se creara la lista de planetas en funcion del tipo de flota
  function setplanets (planetsListInput) {
    let listPlanetResult = [];
    if(fleet.fleetType.ftype == "exploration"){
      listPlanetResult = planetsListInput.filter(planet => planet.imperium.imperiumId == 0);
    }else if(fleet.fleetType.ftype == "military"){
      listPlanetResult = planetsListInput.filter(planet => planet.imperium.imperiumId != 0);
    }else if(fleet.fleetType.ftype == "transport"){
      listPlanetResult = planetsListInput.filter(planet => planet.imperium.imperiumId != 0 && planet.imperium.imperiumId == fleet.imperium.imperiumId);
    }
    setPlanetsList(listPlanetResult);
  }

  async function changePlanet(planetInput){
    setSelectedPlanet(planetInput);
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        presentationStyle="fullScreen"
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          changeModalVisible();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={styles.title}>Ordenes para la flota</Text>
            <View style={styles.centeredView}>
              <Text style={styles.modalText}>{fleet.name}</Text>
              <Text style={styles.modalText}>{fleetTypestranslation[fleet.fleetType.ftype]}</Text>
              <Text style={styles.modalText}>Selecciona el planeta al cual quieres que vaya la flota.</Text>
              <Text style={styles.modalText}>Las flotas de exploracion iran a planetas vacios para colonizarlos.</Text>
              <Text style={styles.modalText}>Las flotas de de transporte se pueden mover entre tus planetas.</Text>
              <Text style={styles.modalText}>Las flotas de militares defenderan tus planetas o atacaran los de otros imperios.</Text>
            </View>
            <PlanetListBanner 
              styles={styles.PlanetListBanner}
              planetList={planetsList}
              planet={selectedPlanet}
              onSelectParent={(planetInput) => changePlanet(planetInput)}
            />

            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => changeModalVisible()}>
              <Text style={styles.textStyle}>Realizar Ordenes</Text>
            </Pressable>  
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => changeModalVisible()}>
              <Text style={styles.textStyle}>Cancelar ordenes</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({  
  PlanetListBanner:{
    width: windowWidth,
  },
  title: {
    fontSize:18,
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
},
text: {
    fontSize:14,
    flex: 1,
    textAlign: 'center',
},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#DB654C',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default FleetAction;