import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  texTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  texSubTitle: {
    fontSize: 18,
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#757575',
  },
  textContainer: {
    flex: 1,
    padding: 5,
  },
  brandButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 15,
    margin: '1%'
  },
  horizontalAlign: {
    margin: '1%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputLogin: {
    marginTop: '3%',
    marginBottom: '0%',
    marginRight: '20%',
    marginLeft: '20%'
  },
  inputImperiumSearch: {
    marginTop: '1%',
    marginBottom: '1%',
    marginRight: '10%',
    marginLeft: '10%'
  },
  textStyle: {
    fontSize:14,
    flex: 1,
    textAlign: 'center',
    color: "#212121"
  },
  textStyleLeft: {
    fontSize:14,
    flex: 1,
    textAlign: 'left',
    marginLeft: 5,
    color: "#212121"
  },
  buttonOk: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#DB654C',
  },
  buttonCancel: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: '#2c3e50',
    backgroundColor: '#455A64',
    paddingHorizontal: 20,
  },
  subContainer: {
    //flex: 1,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    //backgroundColor: '#2c3e50',
    backgroundColor: '#CFD8DC',
    paddingHorizontal: 20
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
    backgroundColor: '#CFD8DC',
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
    backgroundColor: '#7C4DFF',
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
    padding: 6,
    borderRadius: 5,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#d33',
  },
  trashIcon: {
    width: 18,
    height: 18,
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