import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '../services/API';

const HangarScreen = () => {
    const navigation = useNavigation(); // Hook para la navegación

  return (
    <View>
      <Button title="Investigación" onPress={() => navigation.navigate('ResearchScreen')} />
      <Button title="Planeta" onPress={() => navigation.navigate('PlanetScreen')} />
    </View>
  );
}

export default HangarScreen;