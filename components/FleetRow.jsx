import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { commonStyles } from '../styles/CommonStyles';

const FleetRow = ({ fleet, onOpenActionsModal, onOpenResourcesModal, imperium }) => {

    if(fleet.imperium.imperiumId == imperium.imperiumId){
        fleet.textColor = "green";
    }else{
        fleet.textColor = "red";
    }

    return (
        <Card>
            <View style={styles.container}>
                <View style={commonStyles.textContainer}>
                    <Text style={commonStyles.texSubTitle}>Nombre</Text>
                    <Text style={[commonStyles.textStyle, {color: fleet.textColor}]}>{fleet.name}</Text>
                </View>
                <View style={commonStyles.textContainer}>
                    <Text style={commonStyles.texSubTitle}>Coordenadas</Text>
                    <Text style={[commonStyles.textStyle, {color: fleet.textColor}]}>{fleet.coordinates}</Text>
                </View>
                <View style={commonStyles.textContainer}>
                    <Text style={commonStyles.texSubTitle}>Tipo</Text>
                    <Text style={[commonStyles.textStyle, {color: fleet.textColor}]}>{fleet.fleetType.ftype}</Text>
                </View>
                <View style={commonStyles.textContainer}>
                    <Text style={commonStyles.texSubTitle}>Destino</Text>
                    <Text style={[commonStyles.textStyle, {color: fleet.textColor}]}>{fleet.destination}</Text>
                </View>
                <View style={[commonStyles.textContainer, {flexWrap: 'wrap'}]}>
                    <Button
                        buttonStyle={commonStyles.brandButton}
                        title='Ordenes'
                        onPress={() => onOpenActionsModal(fleet)}
                    />
                    <Button
                        buttonStyle={commonStyles.brandButton}
                        title='Recursos'
                        onPress={() => onOpenResourcesModal(fleet)}
                    />
                </View>
            </View>
        </Card>
    );
    }
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
    },
});
export default FleetRow;