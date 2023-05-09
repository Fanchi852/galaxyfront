import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#2c3e50',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 32,
      marginBottom: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#fff',
    },
    input: {
      backgroundColor: '#fff',
      marginBottom: 10,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
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
    image: {
      width: 50,
      height: 50,
      resizeMode: 'cover',
      borderRadius: 25,
    },
    imagePlaceholder: {
      width: 50,
      height: 50,
      backgroundColor: '#ccc',
      marginRight: 8,
      borderRadius: 25,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      backgroundColor: '#CEE3E5',
      borderRadius: 5,
      padding: 8,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardInfo: {
      flexShrink: 1,
    },
    buttonGroup: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    enterButton: {
      backgroundColor: '#589431',
      padding: 8,
      borderRadius: 5,
      marginRight: 8,
    },
    enterButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    deleteButton: {
      backgroundColor: '#933927',
      padding: 8,
      borderRadius: 5,
    },
    logoutButton: {
      marginTop: 16,
      backgroundColor: '#d33',
    },
    trashIcon: {
      width: 25,
      height: 25,
    },
    resourcesContainer: {
      marginBottom: 20,
    },
    planetInfoContainer: {
      marginBottom: 20,
    },
    spacePortContainer: {
      marginBottom: 20,
    },
    buildingsContainer: {
      marginBottom: 20,
    },
  });