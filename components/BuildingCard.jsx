import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { apiRequest } from '../services/API';
import { commonStyles } from '../styles/CommonStyles';
import * as Progress from 'react-native-progress';
import AlertModal from '../components/AlertModal';
import { useNavigation  } from '@react-navigation/native';

const BuildingCard = ({ building, planet, fields, onReload, userSessionId  }) => {
  const [expanded, setExpanded] = useState(false);
  const [buildingData, setBuildingData] = useState(null);
  const [inProgressBuilding, setInProgressBuilding] = useState(null);
  var [buildingProgress, setBuildingProgress] = useState({
    value: 0.0,
    increment: 0.1
  });
  var [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertModalData, setAlertModalData] = useState({});

  async function handleCloseAlertModal(){
    setAlertModalVisible(false);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildingProgress(prev => ({
        ...prev,
        value: prev.value + prev.increment
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    if (expanded) {
      loadData();
    }
  },[planet]);

  const handlePress = async () => {
    if (!expanded) {
      await loadData();
    }
    setExpanded(!expanded);
  };

  async function loadData(){
    let data = await fetchBuildingData(building.id);
    let auxdata = buildingData !=null ? buildingData : {};
    if(data.length === 0){
      return auxdata;
    }
    auxdata ["parcel"] = data[0];//Revisar
    auxdata ["count"] = data.filter(element => element.Building.buildType_id === building.id).length;
    auxdata ["planet"] = planet;

    let newInProgressBuilding = data.find(element => element.Building.buildType_id === 2);
    setInProgressBuilding(newInProgressBuilding);
    if(newInProgressBuilding){
      let regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      let startDateLong = Date.parse(regex.exec(newInProgressBuilding.construction_start_date));
      let startDate = new Date(startDateLong);
      let timeNeededLong = newInProgressBuilding.basic_time_cost * 1000;
      let endDateLong = startDateLong + timeNeededLong;
      let endDate = new Date(endDateLong);
      let today = new Date();

      if(today < endDate){
        auxdata ["state"] = data.find(element => element.Building.buildType_id === 2) ? "inConstruction" : "ready";
      }else{
        auxdata ["state"] = "toFinish";
      }
      /*
      console.log('startDate: ' + startDate.toLocaleDateString(`es-ES`) + ' ' + startDate.toLocaleTimeString(`es-ES`));
      console.log('endDate: ' + endDate.toLocaleDateString(`es-ES`) + ' ' + endDate.toLocaleTimeString(`es-ES`));
      console.log('today: ' + today.toLocaleDateString(`es-ES`) + ' ' + today.toLocaleTimeString(`es-ES`));
*/
      let actualTime = today - startDateLong;/*
      console.log('actualTime: ' + actualTime);
      console.log('timeNeededLong: ' + timeNeededLong);*/
      let actualPercentage = actualTime / timeNeededLong;/*
      console.log('actualPercentage: ' + actualPercentage);
      console.log('newInProgressBuilding.basic_time_cost: ' + newInProgressBuilding.basic_time_cost);*/
      let increment = 1000 / timeNeededLong;/*
      console.log('increment: ' + increment);*/
      setBuildingProgress({
        value: actualPercentage,
        increment: increment
      });
    }else{
      auxdata ["state"] = "ready";
    }
    setBuildingData(auxdata);
  }

  async function fetchBuildingData(buildingTypeId) {
    const endpoint = 'parcels/getparcelsbytype';
    const method = 'POST';
    const requestData = {
      "building": { "buildType_id": buildingTypeId },
      "location": planet.planetId,
      "locationT": "planet"
    };
    
    try {
      const responseData = await apiRequest(endpoint, method, JSON.stringify(requestData));
      return responseData;
    } catch (error) {
      console.error("Error fetching building data:", error);
    }
  };

  const startConstruction = async () => {
    const endpoint = 'parcels/startconstruction';
    const method = 'POST';
    const requestData = {
      to_building: {
        buildType_id: building.id
      },
      location: planet.planetId
    };
    
    try {
      const responseData = await apiRequest(endpoint, method, JSON.stringify(requestData), userSessionId);
      if (!responseData){
        const navigation = useNavigation();
        navigation.navigate('Login');
      }
      if(responseData.status){
        if(responseData.status === 409){
          setAlertModalData({
            title: '¡Error! ¡Faltan recursos!',
            text: 'No tienes bastantes recursos para este edifcio.',
            icon: 'warning',
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
        }
      }else{
        onReload();
        await loadData();
      }
      return responseData;
    } catch (error) {
      console.error("Error fetching building data:", error);
    }
  };

  const finishConstruction = async () => {
    const endpoint = 'parcels/endconstruction';
    const method = 'POST';
    const requestData = {
      "parcelId": inProgressBuilding.parcelId
    };
    
    try {
      const responseData = await apiRequest(endpoint, method, JSON.stringify(requestData), userSessionId);
      onReload();
      await loadData();
      return responseData;
    } catch (error) {
      console.error("Error fetching building data:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={building.icon} color={building.color} type="font-awesome" />
          <Text>{building.name}</Text>
        </View>
        {expanded && buildingData && (
          <View>
            <Text>Número de ampliaciones: {buildingData.count}</Text>
            {fields && fields.map(field => (
              <Text key={field.fieldname}>{field.label}: {buildingData.planet.resources[field.fieldname]?buildingData.planet.resources[field.fieldname]:buildingData.planet[field.fieldname]}</Text>
            ))}
            <View>
              <Text>Coste construccion: </Text>
              <Text>Mineral normal: {buildingData.parcel.basic_normal_cost}</Text>
              <Text>Mineral raro: {buildingData.parcel.basic_rare_cost}</Text>
              <Text>Tiempo: {buildingData.parcel.basic_time_cost}</Text>
            </View>
            {buildingData.state === "ready" && (
              <Button style={commonStyles.button}
                title="Ampliar edificio"
                onPress={() => {
                  startConstruction()
                }}
              />
            )}
            {buildingData.state === "inConstruction" && (
              <Progress.Bar progress={buildingProgress.value} width={200} animated={true} />
            )}
            {buildingData.state === "toFinish" && (
              <Button style={commonStyles.button}
              title="Terminar construccion"
              onPress={() => {
                finishConstruction()
              }}
            />
            )}
          </View>
        )}
      </View>
      <View>
          <AlertModal
            inputVisible = {alertModalVisible}
            data = {alertModalData}
            onCloseModal={() => handleCloseAlertModal()}
          />
        </View>
    </TouchableOpacity>
  );
};

export default BuildingCard;