import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions} from 'react-native';
import PlanetListBanner from '../components/PlanetListBanner';
import {Picker} from '@react-native-picker/picker';
import { apiRequest } from '../services/API';
import { commonStyles } from '../styles/CommonStyles';
import AlertModal from '../components/AlertModal';

var windowWidth = Dimensions.get('window').width;
console.log("ancho de la pagina: ", windowWidth);

const FleetAction = ( {inputVisible, fleet, onChangeModalVisible} ) => {
  var [modalVisible, setModalVisible] = useState(false);
  var [planetsList, setPlanetsList] = useState([]);
  var [starsList, setStarList] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedStar, setSelectedStar] = useState();
  const fleetTypestranslation = {"exploration": "Exploración","military": "Militar","transport": "Transporte"}
  const [selectedFleetType, setSelectedFleetType] = useState(fleetTypestranslation[fleet.fleetType.ftype]);
  var [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertModalData, setAlertModalData] = useState({});

  async function handleCloseAlertModal() {
    setAlertModalVisible(false);
  }

  //pide al servidor que la flota seleccionada se vaya a explorar una estrella desconocida y devuelve la nueva estrella
  async function sendFleetToExplore(fleet) {
    const endpoint = 'fleet/explore';
    const method = 'POST';
    const requestData = {
      "imperium":{"imperiumId":fleet.imperium.imperiumId}
    };

    try {
      let newStar = await apiRequest(endpoint, method, JSON.stringify(requestData));
      console.log("newStar: ", newStar);
      setAlertModalData({
        title: 'exploracion exitosa!',
        text: 'se ha explorado la estrella ' + newStar.star.name + ' con exito!',
        icon: 'success',
        buttons: [
          {
              name: 'CLOSE',
              text: 'Aceptar',
              syle: commonStyles.buttonOk,
              textStyle: commonStyles.textStyle
          }
      ]
      })
      setAlertModalVisible(true);
      return newStar;
    } catch (error) {
      console.error("Error fetching fleets list: ", error);
    }
  }

  //trae una lista con todas las estrellas de la galaxia
  async function fetchStarsList() {
    const endpoint = 'star/liststar';
    const method = 'GET';
    const requestData = {};

    try {
      let starsListData = await apiRequest(endpoint, method, JSON.stringify(requestData));
      setStarList(starsListData);
    } catch (error) {
      console.error("Error fetching stars list:", error);
    }
  }

  //trae una lista con las estrellas de la galaxi que conozcas
  async function fetchStarsListKnown() {
    const endpoint = 'star/liststarknown';
    const method = 'POST';
    const requestData = {
      "imperiumId": fleet.imperium.imperiumId
    };

    try {
      let starsListData = await apiRequest(endpoint, method, JSON.stringify(requestData));
      setStarList(starsListData);
    } catch (error) {
      console.error("Error fetching stars list:", error);
    }
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

    setSelectedFleetType(fleetTypestranslation[fleet.fleetType.ftype])
    setModalVisible(inputVisible);
    if(inputVisible){
      async function getPlanetsFleet() {
        
        if(fleet.fleetType.ftype == "exploration"){
          await fetchStarsList();
        }else if(fleet.fleetType.ftype == "military"){
          await fetchStarsListKnown();
        }else if(fleet.fleetType.ftype == "transport"){
          await fetchStarsListKnown();
        }
        await fetchPlanetsList(fleet);
      }
      getPlanetsFleet();
    }
  },[inputVisible]);

  async function changeModalVisible(){
    onChangeModalVisible(false);
  }

  async function handleCloseAlertModal(){
    setAlertModalVisible(false);
    setModalVisible(false);
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

  console.log("---ZZ>>>>estrella seleccio0nada: ", JSON.stringify(selectedStar, null, 2));

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          changeModalVisible();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={commonStyles.texSubTitle}>Ordenes para la flota</Text>
            <View style={styles.centeredView}>
              <Text style={styles.modalText}>{fleet.name}</Text>
              <Text style={styles.modalText}>tipo de flota: {selectedFleetType}</Text>
            </View>
            <Picker
              selectedValue={selectedStar}
              onValueChange={(itemValue) =>
                setSelectedStar(itemValue)
              }>
              {starsList?.map(star => (
                <Picker.Item key={star.starId} label={star.name} value={star}/>
              ))}
            </Picker>
            <PlanetListBanner 
              styles={styles.PlanetListBanner}
              planetList={planetsList}
              planet={selectedPlanet}
              onSelectParent={(planetInput) => changePlanet(planetInput)}
            />
            {selectedFleetType == "Exploración" ? 
              <Pressable
                style={[styles.button, commonStyles.brandButton]}
                onPress={() => sendFleetToExplore(fleet)}>
                <Text style={styles.textStyle}>Explorar las estrellas</Text>
              </Pressable> 
            : null}
            <Pressable
              style={[styles.button, commonStyles.brandButton]}
              onPress={() => changeModalVisible()}>
              <Text style={styles.textStyle}>Realizar Ordenes</Text>
            </Pressable>  
            <Pressable
              style={[styles.button, commonStyles.buttonCancel]}
              onPress={() => changeModalVisible()}>
              <Text style={styles.textStyle}>Cancelar ordenes</Text>
            </Pressable>
          </View>
          <View>
            <AlertModal
              inputVisible = {alertModalVisible}
              data = {alertModalData}
              onCloseModal={() => handleCloseAlertModal()}
            />
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
    backgroundColor: '#CFD8DC',
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