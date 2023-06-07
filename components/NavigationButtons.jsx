import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';

const NavigationButtons = ({ navigation, buttonList }) => {

    return (
        <View>
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

export default NavigationButtons;