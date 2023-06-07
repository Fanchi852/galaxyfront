import React, {useState, useEffect} from 'react';
import { Modal, StyleSheet, Text, TextInput, Pressable, View } from 'react-native';
import { apiRequest } from '../services/API';
import AlertModal from '../components/AlertModal';
import { commonStyles } from '../styles/CommonStyles';

const FleetResources = ( {inputVisible, fleet, planet, onCloseModal} ) => {
  var [modalVisible, setModalVisible] = useState(false);
  var [alertModalVisible, setAlertModalVisible] = useState(false);
  const [normal, setNormal] = useState(0);
  const [rare, setrare] = useState(0);
  const [population, setPopulation] = useState(0);
  const [alertModalData, setAlertModalData] = useState({});

  const fleetTypestranslation = {
    "exploration": "Exploración",
    "military": "Militar",
    "transport": "Transporte"
  
  }

  //envia una peticion de transferencia de recursos desde la flota al planeta a la api
  const transferToPlanet = () => {
    const resources = {
      "normal_quantity": (normal == '') ? 0 : parseInt(normal),
      "population_quantity": (population == '') ? 0 : parseInt(population),
      "rare_quantity": (rare == '') ? 0 : parseInt(rare),
    }
    //comprombamos que la cantidad de recursos que queremos transferir no sea mayor a la que tenemos
    if(fleet.resources.normal_quantity < resources.normal_quantity){
      setAlertModalData({
        title: 'Error!',
        text: 'La cantidad de recursos normales que quieres transferir es mayor a la que tiene la flota',
        icon: 'error',
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
    }else if(fleet.resources.population_quantity < resources.population_quantity){
      setAlertModalData({
        title: 'Error!',
        text: 'La cantidad de recursos de poblacion que quieres transferir es mayor a la que tiene la flota',
        icon: 'error',
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
    }else if(fleet.resources.rare_quantity < resources.rare_quantity){
      setAlertModalData({
        title: 'Error!',
        text: 'La cantidad de recursos raros que quieres transferir es mayor a la que tiene la flota',
        icon: 'error',
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
    }else{
      //comprombamos que la cantidad de recursos que queremos transferir va a caber en el planeta
      if(planet.resources.normal_capacity < planet.resources.normal_quantity + resources.normal_quantity){
        setAlertModalData({
          title: 'Error!',
          text: 'La cantidad de recursos normales que quieres transferir es mayor a la que puede almacenar el planeta',
          icon: 'error',
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
      }else if(planet.resources.population_capacity < planet.resources.population_quantity + resources.population_quantity){
        setAlertModalData({
          title: 'Error!',
          text: 'La cantidad de recursos de poblacion que quieres transferir es mayor a la que puede almacenar el planeta',
          icon: 'error',
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
      }else if(planet.resources.rare_capacity < planet.resources.rare_quantity + resources.rare_quantity){
        setAlertModalData({
          title: 'Error!',
          text: 'La cantidad de recursos raros que quieres transferir es mayor a la que puede almacenar el planeta',
          icon: 'error',
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
      }else{
        //comprobamos que la cantidad de recursos que queremos transferir no sea negativa
        if(resources.normal_quantity < 0 || resources.population_quantity < 0 || resources.rare_quantity < 0){
          setAlertModalData({
            title: 'Error!',
            text: 'La cantidad de recursos que quieres transferir no puede ser negativa',
            icon: 'error',
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
        }else{
          tradeResourceToPlanet(fleet, planet, resources);
          setAlertModalData({
            title: 'Hecho!',
            text: 'Se ha realizado la transferencia de recursos',
            icon: 'ok',
            buttons: [
              {
                  name: 'CONFIRM',
                  text: 'Aceptar',
                  syle: commonStyles.buttonOk,
                  textStyle: commonStyles.textStyle
              }
          ]
          });
          setAlertModalVisible(true);
        }
      }
    }
  }

  //envia una peticion de transferencia de recursos desde el planeta a la flota a la api
  const transferToFleet = () => {
    const resources = {
      "normal_quantity": (normal == '') ? 0 : parseInt(normal),
      "population_quantity": (population == '') ? 0 : parseInt(population),
      "rare_quantity": (rare == '') ? 0 : parseInt(rare),
    }
    //comprombamos que la cantidad de recursos que queremos transferir no sea mayor a la que tenemos
    if(planet.resources.normal_quantity < resources.normal_quantity){
      setAlertModalData({
        title: 'Error!',
        text: 'La cantidad de recursos normales que quieres transferir es mayor a la que tiene el planeta',
        icon: 'error',
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
    }else if(planet.resources.population_quantity < resources.population_quantity){
      setAlertModalData({
        title: 'Error!',
        text: 'La cantidad de recursos de poblacion que quieres transferir es mayor a la que tiene el planeta',
        icon: 'error',
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
    }else if(planet.resources.rare_quantity < resources.rare_quantity){
      setAlertModalData({
        title: 'Error!',
        text: 'La cantidad de recursos raros que quieres transferir es mayor a la que tiene el planeta',
        icon: 'error',
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
    }else{
      //comprombamos que la cantidad de recursos que queremos transferir va a caber en la flota
      if(fleet.resources.normal_capacity < fleet.resources.normal_quantity + resources.normal_quantity){
        setAlertModalData({
          title: 'Error!',
          text: 'La cantidad de recursos normales que quieres transferir es mayor a la que puede almacenar la flota',
          icon: 'error',
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
      }else if(fleet.resources.population_capacity < fleet.resources.population_quantity + resources.population_quantity){
        setAlertModalData({
          title: 'Error!',
          text: 'La cantidad de recursos de poblacion que quieres transferir es mayor a la que puede almacenar la flota',
          icon: 'error',
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
      }else if(fleet.resources.rare_capacity < fleet.resources.rare_quantity + resources.rare_quantity){
        setAlertModalData({
          title: 'Error!',
          text: 'La cantidad de recursos raros que quieres transferir es mayor a la que puede almacenar la flota',
          icon: 'error',
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
      }else{
        //comprobamos que la cantidad de recursos que queremos transferir no sea negativa
        if(resources.normal_quantity < 0 || resources.population_quantity < 0 || resources.rare_quantity < 0){
          setAlertModalData({
            title: 'Error!',
            text: 'La cantidad de recursos que quieres transferir no puede ser negativa',
            icon: 'error',
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
        }else{
          tradeResourceToFleet(fleet, planet, resources);
          setAlertModalData({
            title: 'Transferencia correcta',
            text: 'Se ha realizado la transferencia de recursos',
            icon: 'ok',
            buttons: [
              {
                  name: 'CONFIRM',
                  text: 'Aceptar',
                  syle: commonStyles.buttonOk,
                  textStyle: commonStyles.textStyle
              }
          ]
          });
          setAlertModalVisible(true);
          
        }
      }
    }
  }

  //llama a fetchResourceTrade para hacer una transaccion de recurso desde la flota a un planeta
    async function tradeResourceToPlanet(fleet, planet, resource) {
        const endpoint = 'resources/traderesources';
        const method = 'POST';
        const requestData = {
            "origin": {
                "normal_capacity": fleet.resources.normal_capacity,
                "normal_quantity": fleet.resources.normal_quantity,
                "population_capacity": fleet.resources.population_capacity,
                "population_quantity": fleet.resources.population_quantity,
                "rare_capacity": fleet.resources.rare_capacity,
                "rare_quantity": fleet.resources.rare_quantity,
                "resourceId": fleet.resources.resourceId,
            },
            "receiver": {
                "normal_capacity": planet.resources.normal_capacity,
                "normal_quantity": planet.resources.normal_quantity,
                "population_capacity": planet.resources.population_capacity,
                "population_quantity": planet.resources.population_quantity,
                "rare_capacity": planet.resources.rare_capacity,
                "rare_quantity": planet.resources.rare_quantity,
                "resourceId": planet.resources.resourceId,
            },
            "transaction": {
                "normal_quantity": resource.normal_quantity,
                "population_quantity": resource.population_quantity,
                "rare_quantity": resource.rare_quantity,
            }
        };
        try {
            let respons = await apiRequest(endpoint, method, JSON.stringify(requestData));
        }
        catch (error) {
            console.error("Error fetching planets list:", error);
        }
    }

    //llama a la api para hacer una transaccion de recurso desde el planeta a la flota
    async function tradeResourceToFleet(fleet, planet, resource) {
        const endpoint = 'resources/traderesources';
        const method = 'POST';
        const requestData = {
            "receiver": {
                "normal_capacity": fleet.resources.normal_capacity,
                "normal_quantity": fleet.resources.normal_quantity,
                "population_capacity": fleet.resources.population_capacity,
                "population_quantity": fleet.resources.population_quantity,
                "rare_capacity": fleet.resources.rare_capacity,
                "rare_quantity": fleet.resources.rare_quantity,
                "resourceId": fleet.resources.resourceId,
            },
            "origin": {
                "normal_capacity": planet.resources.normal_capacity,
                "normal_quantity": planet.resources.normal_quantity,
                "population_capacity": planet.resources.population_capacity,
                "population_quantity": planet.resources.population_quantity,
                "rare_capacity": planet.resources.rare_capacity,
                "rare_quantity": planet.resources.rare_quantity,
                "resourceId": planet.resources.resourceId,
            },
            "transaction": {
                "normal_quantity": resource.normal_quantity,
                "population_quantity": resource.population_quantity,
                "rare_quantity": resource.rare_quantity,
            }
        };
        try {
            let respons = await apiRequest(endpoint, method, JSON.stringify(requestData));
        }
        catch (error) {
            console.error("Error fetching planets list:", error);
        }
    }

    useEffect(()=>{
      setModalVisible(inputVisible);
    },[inputVisible]);

    async function closeModal(){
      setNormal(0);
      setrare(0);
      setPopulation(0);
      setModalVisible(false);
      onCloseModal();
    }

    async function handleCloseAlertModal(){
      setAlertModalVisible(false);
      closeModal();
    }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        presentationStyle="fullScreen">
        <View style={styles.centeredView}>
          <AlertModal
            inputVisible = {alertModalVisible}
            data = {alertModalData}
            onCloseModal={() => handleCloseAlertModal()}
           />
          <View style={styles.modalView}>
            <View style={styles.centeredView}>
                <Text style={styles.title}>Transporte de recursos para la flota</Text>
              <Text style={styles.modalText}>{fleet.name}</Text>
              <Text style={styles.modalText}>{fleetTypestranslation[fleet.fleetType.ftype]}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.centeredView}>
                    <Text style={styles.title}>FLOTA</Text>
                    <Text style={styles.modalText}>Minerales normales: </Text>
                    <Text style={styles.modalText}>{fleet.resources.normal_quantity}/{fleet.resources.normal_capacity}</Text>
                    <Text style={styles.modalText}>Minerales raros: </Text>
                    <Text style={styles.modalText}>{fleet.resources.rare_quantity}/{fleet.resources.rare_capacity}</Text>
                    <Text style={styles.modalText}>Poblacion: </Text>
                    <Text style={styles.modalText}>{fleet.resources.population_quantity}/{fleet.resources.population_capacity}</Text>
                </View>
                <View style={styles.centeredView}>
                    <Text style={styles.title}>PLANETA</Text>
                    <Text style={styles.modalText}>Minerales normales: </Text>
                    <Text style={styles.modalText}>{planet.resources.normal_quantity}/{planet.resources.normal_capacity}</Text>
                    <Text style={styles.modalText}>Minerales raros: </Text>
                    <Text style={styles.modalText}>{planet.resources.rare_quantity}/{planet.resources.rare_capacity}</Text>
                    <Text style={styles.modalText}>Poblacion: </Text>
                    <Text style={styles.modalText}>{planet.resources.population_quantity}/{planet.resources.population_capacity}</Text>
                </View>
            </View>
            <View style={styles.centeredView}>
              <View style={styles.fila}>
                <View style={styles.centeredView}>
                  <Text style={styles.title}>Recursos</Text>
                  <Text style={styles.modalText}>Minerales normales:</Text>
                  <Text style={styles.modalText}>Minerales raros:</Text>
                  <Text style={styles.modalText}>Poblacion:</Text>
                </View>
                <View style={styles.centeredView}>
                  <Text style={styles.title}>Cantidad</Text>
                  <TextInput
                    value={normal}
                    keyboardType="numeric"
                    onChangeText={setNormal}
                    style={[styles.input, {justifyContent: 'center'}, {alignItems: 'center'}]}
                  />
                  <TextInput
                    value={rare}
                    keyboardType="numeric"
                    onChangeText={setrare}
                    style={styles.input}
                  />
                  <TextInput
                    value={population}
                    keyboardType="numeric"
                    onChangeText={setPopulation}
                    style={styles.input}
                  />
                </View>
              </View>
              <View style={styles.fila}>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => transferToFleet()}>
                    <Text style={styles.textStyle}>Planeta --{'>'} Flota</Text>
                  </Pressable>
                  <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => transferToPlanet()}>
                    <Text style={styles.textStyle}>Planeta {'<'}-- Flota</Text>
                  </Pressable>
              </View>
            </View>
            <View style={styles.centeredView}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => closeModal()}>
                <Text style={styles.textStyle}>Cerrar Recursos</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderStartColor: '#000',
  },
  fila: {
      flexDirection: 'row',
  },
  container: {
      flexDirection: 'row',
      flex: 1,
      padding: 10,
  },
  PlanetListBanner:{
      width: '100%',
  },
  title: {
      flexWrap: 'nowrap',
      fontSize:18,
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
      padding: 10,
      borderRadius: 20,
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
      backgroundColor: '#2196F3',
  },
  textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
  },
  modalText: {
      
      paddingBottom: 4,
      marginBottom: 4,
      textAlign: 'center',
  },
});

export default FleetResources;