import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

const CustomNavigationButtons = ({ navigation, buttonList }) => {

    return (
        <View style={styles.menuButtons}>
            {buttonList.map(button => (
                <Button 
                key={button.key} 
                title={button.label}
                icon={{ name: 'flask', type: 'font-awesome' }}
                onPress={() => navigation.navigate(button.navigationScreen, button.params)} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    menuButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    }
});

export default CustomNavigationButtons;