import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';

const FleetRow = ({ fleet, onOpenActionsModal, onOpenResourcesModal, imperium }) => {
    return (
        <Card>
            <View style={[styles.container, {backgroundColor: fleet.imperium.imperiumId == imperium.imperiumId ? "#4DF5C9" : "#F58D4D"}]}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Nombre</Text>
                    <Text style={styles.text}>{fleet.name}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Coordenadas</Text>
                    <Text style={styles.text}>{fleet.coordinates}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Tipo</Text>
                    <Text style={styles.text}>{fleet.fleetType.ftype}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Destino</Text>
                    <Text style={styles.text}>{fleet.destination}</Text>
                </View>
                <View style={[styles.textContainer, {flexWrap: 'wrap'}]}>
                    <Button
                        buttonStyle={styles.actionbutton}
                        title='Ordenes'
                        onPress={() => onOpenActionsModal(fleet)}
                    />
                    <Button
                        buttonStyle={styles.actionbutton}
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
    textContainer: {
        flex: 1,
        padding: 5,
    },
    actionbutton: {
        margin: 5,
        flex: 1,
        flexWrap: 'wrap',
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
});
export default FleetRow;