import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { commonStyles } from '../styles/CommonStyles';

const PlanetResources = ({planet}) => {

    var [planetResources, setPlanetResources] = useState({
        normal_quantity: planet.resources.normal_quantity,
        rare_quantity: planet.resources?.rare_quantity,
        population_quantity: planet.resources?.population_quantity,
      });
    
    useEffect(() => {
    const interval = setInterval(() => {
        setPlanetResources(prevResources => ({
        ...prevResources,
        normal_quantity: prevResources.normal_quantity + planet.normalOreProduction / 3600,
        rare_quantity: prevResources.rare_quantity + planet.rareOreProduction / 3600,
        population_quantity: prevResources.population_quantity + planet.population_changes / 3600
        }));
    }, 1000);

    return () => clearInterval(interval);
    }, []);

    useEffect(()=>{
        setPlanetResources({
          normal_quantity: planet.resources.normal_quantity,
          rare_quantity: planet.resources?.rare_quantity,
          population_quantity: planet.resources?.population_quantity,
        });
      },[planet]);
    
      if(!planetResources){
        setPlanetResources(() => ({
          normal_quantity: planet.resources.normal_quantity,
          rare_quantity: planet.resources.normal_quantity,
          population_quantity: planet.resources.normal_quantity
        }));
      }

    return (
        <View style={commonStyles.subContainer}>
            <Card containerStyle= {commonStyles.subContainer}>
                <Card.Title>Recursos</Card.Title>
                <View style={styles.resourcesContainer}>
                    <View style={styles.resourceColumn}>
                        <Icon name="diamond" type="font-awesome" />
                        <Text>Minerales normales: {planetResources.normal_quantity.toFixed(2)}</Text>
                    </View>
                    <View style={styles.resourceColumn}>
                        <Icon name="diamond" type="font-awesome" color="blue" />
                        <Text>Minerales raros: {planetResources.rare_quantity.toFixed(2)}</Text>
                    </View>
                    <View style={styles.resourceColumn}>
                        <Icon name="users" type="font-awesome" />
                        <Text>Población: {planetResources.population_quantity.toFixed(0)}</Text>
                    </View>
                </View>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 10,
    },
    resourcesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    resourceColumn: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

export default PlanetResources;