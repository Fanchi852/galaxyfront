import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { commonStyles } from '../styles/CommonStyles';

const CustomNavigationButtons = ({ navigation, buttonList }) => {

    return (
        <View style={[commonStyles.horizontalAlign]}>
            {buttonList.map(button => (
                <View key={button.key} style={[{margin:"1%", width: "170px"}]} >
                    <Button 
                    mode="contained"
                    title={button.label}
                    icon={{ name: 'flask', type: 'font-awesome' }}
                    onPress={() => navigation.navigate(button.navigationScreen, button.params)}
                    buttonStyle={[commonStyles.brandButton, {margin:"5%"}]}/>
                </View>
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