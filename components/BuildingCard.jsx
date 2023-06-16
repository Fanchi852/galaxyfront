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
      <View style={[commonStyles.subContainer, {backgroundColor: "#BDBDBD"}]}>
        <View style={[commonStyles.horizontalAlign, {justifyContent: 'left'}]}>
          <Icon name={building.icon} color={building.color} type="font-awesome" />
          <Text style={[commonStyles.texSubTitle, {textAlign:'left', marginLeft: 5}]}>{building.name}</Text>
        </View>
        {expanded && buildingData && (
          <View>
            <View style={[commonStyles.horizontalAlign, {justifyContent: 'left', alignItems: 'left'}]}>
              <Text style={[commonStyles.textStyleLeft, {fontWeight: 'bold'}]}>Número de ampliaciones:</Text>
              <Text style={[commonStyles.textStyleLeft]}>{buildingData.count}</Text>
            </View>
            {fields && fields.map(field => (
              <View key={field.fieldname} style={[commonStyles.horizontalAlign, {justifyContent: 'left', alignItems: 'left'}]}>
                <Text style={[commonStyles.textStyleLeft, {fontWeight: 'bold'}]}>{field.label}: </Text>
                <Text style={[commonStyles.textStyleLeft]}>{buildingData.planet.resources[field.fieldname]?buildingData.planet.resources[field.fieldname]:buildingData.planet[field.fieldname]}</Text>
              </View>
            ))}
            <View style={[commonStyles.horizontalAlign, {justifyContent: 'left', alignItems: 'left'}]}>
              <Text style={[commonStyles.textStyleLeft, {fontWeight: 'bold'}]}>Número de ampliaciones:</Text>
              <Text style={[commonStyles.textStyleLeft]}>{buildingData.count}</Text>
            </View>
            <View style={[commonStyles.horizontalAlign, {justifyContent: 'left', alignItems: 'left'}]}>
              <Text style={[commonStyles.texSubTitle, {textAlign:'left', marginLeft: 5}]}>Coste construccion:</Text>
            </View>
            <View style={[commonStyles.horizontalAlign, {justifyContent: 'left', alignItems: 'left'}]}>
              <Text style={[commonStyles.textStyleLeft, {fontWeight: 'bold'}]}>Mineral raro:</Text>
              <Text style={[commonStyles.textStyleLeft]}>{buildingData.parcel.basic_rare_cost}</Text>
            </View>
            <View style={[commonStyles.horizontalAlign, {justifyContent: 'left', alignItems: 'left'}]}>
              <Text style={[commonStyles.textStyleLeft, {fontWeight: 'bold'}]}>Tiempo:</Text>
              <Text style={[commonStyles.textStyleLeft]}>{buildingData.parcel.basic_time_cost}</Text>
            </View>
            {buildingData.state === "ready" && (
              <Button buttonStyle={commonStyles.brandButton}
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
              <Button buttonStyle={commonStyles.brandButton}
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