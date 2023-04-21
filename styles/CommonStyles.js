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
  });