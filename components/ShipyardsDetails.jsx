import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { apiRequest } from '../services/API';
import {Picker} from '@react-native-picker/picker';
import AlertModal from '../components/AlertModal';
import { commonStyles } from '../styles/CommonStyles';

// este compoente administra el astillero de un planeta, para ello se le introduce una lista de las flotas que hay en el planeta y permite seleccionar una de ellas, por debajo muestra una lista de las naves (clase de cada nave) que se pueden construir y permite crearlas y añadirlas a la flota seleccionada siempre y cuando en el planeta existan los recursos necesarios para ello, ya que el planeta tiene dentro los recursos
const ShipyardsDetails = ({ planet, onReload }) => {
    const [fleets, setFleets] = useState([]); // lista de flotas que hay en el planeta
    const [selectedFleet, setSelectedFleet] = useState();   // flota seleccionada
    const [shipsClass, setShipsClass] = useState([]); // lista de naves que se pueden construir
    const [selectedShip, setSelectedShip] = useState(); // nave seleccionada
    //los recursos son minerales normales, minerales raros, y personal
    var [alertModalVisible, setAlertModalVisible] = useState(false);
    const [alertModalData, setAlertModalData] = useState({});

    async function handleCloseAlertModal(){
        setAlertModalVisible(false);
        closeModal();
    }

    //trae una lista de las flotas que hay en el planeta
    async function fetchFleetsList(planet) {
        const endpoint = 'fleet/listfleetinplanet';
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

    // se ejecuta cuando se selecciona un planeta y trae la lista de flotas que hay en el
    useEffect(() => {
        async function getFleets() {
            let fleetsList = await fetchFleetsList(planet);
            setFleets(fleetsList);
            let shipsClassList = await fetchShipsClassList();
            setShipsClass(shipsClassList);
        }
        getFleets();
    }, [planet]);

    //trae una lista con todos las naves que se pueden construir en el planeta
    async function fetchShipsClassList() {
        const endpoint = 'ship/lishipclass';
        const method = 'GET';
        const requestData = {};
        
        try {
            const shipsClassList = await apiRequest(endpoint, method, JSON.stringify(requestData));
            return shipsClassList;
        } catch (error) {
            console.error("Error fetching ships list: ", error);
        }
    }

    // función que se ejecuta cuando se pulsa el botón de construir nave
    async function buildShip(){
        // se comprueba si existen los recursos necesarios para construir la nave
        if(planet.resources.normal_quantity >= selectedShip.basic_normal_cost && planet.resources.rare_quantity >= selectedShip.basic_rare_cost && planet.resources.population_quantity >= selectedShip.basic_people_cost){
            // se llama a la api para construir la nave
            const endpoint = 'fleet/addshiptofleet';
            const method = 'POST';
            const requestData = {
                "fleet" : {"fleetId" : selectedFleet.fleetId},
                "shipClass" : {"shipClassId" : selectedShip.shipClass.shipClassId}
            };
            
            try {
                const response = await apiRequest(endpoint, method, JSON.stringify(requestData));
                if(response){
                    onReload();
                }
            } catch (error) {
                console.error("Error fetching ships list: ", error);
            }

        }else{
            // si no hay recursos suficientes se muestra un mensaje de error
            setAlertModalData({
                title: 'Error!',
                text: 'no tienes los recursos necesarios.',
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
        }
    }

    // componente para mostrar la informacion de las clases de naves que se pueden construir, mostrando la nombre, imagen y descripcion de la nave, ademas de los costes de construcion, junto un boton para construir la nave y añadirla a la flota seleccionada    
    const ShipClasscard = React.memo(({ shipClass }) => {
        
        return (
            <Card>
                <Card.Title>{shipClass.name}</Card.Title>
                <Card.Divider/>
                <Card.Image source={{uri: shipClass.image}}/>
                <Card.Divider/>
                <Card.Title>Descripción</Card.Title>
                <Card.Divider/>
                <Card.Text>{shipClass.description}</Card.Text>
                <Card.Divider/>
                <Card.Title>Costes</Card.Title>
                <Card.Divider/>
                <Card.Text>Minerales normales: {shipClass.costNormalMinerals}</Card.Text>
                <Card.Text>Minerales raros: {shipClass.costRareMinerals}</Card.Text>
                <Card.Text>Personal: {shipClass.costPersonnel}</Card.Text>
                <Card.Divider/>
                <Button
                    title="Construir"
                    onPress={() => buildShip()}
                />
            </Card>
        );
    });


    return (
        <View>
            <View>
                <AlertModal
                    inputVisible = {alertModalVisible}
                    data = {alertModalData}
                    onCloseModal={() => handleCloseAlertModal()}
                />
            </View>
            <Card>
                <Card.Title>Astillero</Card.Title>
                <Card.Divider/>
                <View>
                    <View>
                        <View>
                            <Card.Title>selector de flotas</Card.Title>
                            <Card.Divider/>
                            <Picker
                                selectedValue={selectedFleet}
                                onValueChange={(itemValue) =>
                                    setSelectedFleet(itemValue)
                                }>
                                {fleets?.map(fleet => (
                                    <Picker.Item key={fleet.fleetId} label={fleet.name} value={fleet}/>
                                ))}
                            </Picker>
                        </View>
                        <View>
                            <Button
                                title="Construir"
                                onPress={() => buildShip()}
                            />
                        </View>
                        <View>
                            <Card.Title>lista de naves para construir</Card.Title>
                            <Card.Divider/>
                            <FlatList
                                data={shipsClass}
                                renderItem={({ shipsClass }) => (
                                    <ShipClasscard
                                            key={shipsClass.shipClassId}
                                            shipClass={shipsClass}
                                        />
                                )}
                            />
                        </View>
                    </View>
                </View>
            </Card>
        </View>                 
    );
}

export default ShipyardsDetails;