import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 32,
      marginBottom: 20,
      textAlign: 'center',
      color: '#fff',
    },
    input: {
      backgroundColor: '#fff',
      marginBottom: 10,
    },
    button: {
      marginTop: 20,
      paddingVertical: 10,
    },
    logout: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    listItem: {
      marginTop: 20,
      backgroundColor: '#fff',
      backgroundColorselected: '#ccc',
    },
  });