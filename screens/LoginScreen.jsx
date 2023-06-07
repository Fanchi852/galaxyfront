import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/CommonStyles';
import { apiRequest } from '../services/API';
import AlertModal from '../components/AlertModal';

const LoginScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  var [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertModalData, setAlertModalData] = useState({});

  async function handleCloseAlertModal() {
    setAlertModalVisible(false);
  }

  const handleLogin = async () => {
    // Aquí puedes agregar la lógica para validar las credenciales e iniciar sesión
    try {
      const user = { name: name, password: password }
      const jsonUser = JSON.stringify(user);
      const responseData = await apiRequest('user/login', 'POST', jsonUser);
      if (responseData.userSession_id) {
        navigation.navigate('ImperiumMenu', { userSessionId: responseData.userSession_id });
      } else {
        setAlertModalData({
          title: 'Error!',
          text: 'No se pudo iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.',
          icon: 'error',
          buttons: [
            {
              name: 'CLOSE',
              text: 'Aceptar',
              syle: commonStyles.buttonOk,
              textStyle: commonStyles.textStyle
            }
          ]
        })
        setAlertModalVisible(true);
      }

      // Navegar a otra pantalla o hacer algo más después de un inicio de sesión exitoso
    } catch (error) {
      setAlertModalData({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        buttons: [
          {
            name: 'CLOSE',
            text: 'Aceptar',
            syle: commonStyles.buttonOk,
            textStyle: commonStyles.textStyle
          }
        ]
      })
      setAlertModalVisible(true);
    }
  };

  return (
    <View style={commonStyles.container}>
      <LinearGradient
        //colors={['#00f260', '#0575e6']}
        colors={['#CFD8DC', '#455A64']}
        style={commonStyles.container}
      >
        <View>
          <View>
            <Title style={commonStyles.texTitle}>Iniciar sesión</Title>
          </View>
          <View>
            <TextInput
              label="Nick"
              value={name}
              onChangeText={(text) => setName(text)}
              style={commonStyles.inputLogin}
              keyboardType="Nick-name"
              autoCapitalize="none"
            />
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={commonStyles.inputLogin}
              secureTextEntry
            />
          </View>
          <View style={commonStyles.horizontalAlign}>
            <Button mode="contained" onPress={handleLogin} style={commonStyles.brandButton}>
              Ingresar
            </Button>
            <Button mode="contained" onPress={() => navigation.navigate('Signup')} style={commonStyles.brandButton}>
              registrar
            </Button>
          </View>
        </View>
        <View
        >
          <AlertModal
            inputVisible = {alertModalVisible}
            data = {alertModalData}
            onCloseModal={() => handleCloseAlertModal()}
          />
        </View>
      </LinearGradient>
    </View>
  );
};
export default LoginScreen;