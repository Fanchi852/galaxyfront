import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const BuildingCard = ({ building, color  }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={building.icon} color={building.color} type="font-awesome" />
          <Text>{building.name}</Text>
        </View>
        {expanded && (
          <View>
            {/* Mostrar información detallada del edificio cuando esté expandido */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BuildingCard;