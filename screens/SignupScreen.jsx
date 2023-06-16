import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button, Title } from 'react-native-paper';
import { View  } from 'react-native';
import { commonStyles } from '../styles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../services/API';
import AlertModal from '../components/AlertModal';

const SignupScreen = () => {
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  var [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertModalData, setAlertModalData] = useState({});

  async function handleCloseAlertModal(){
    setAlertModalVisible(false);
    closeModal();
  }

  const handleSignup = async () => {
    try {
      if (nick == '' || email == '' || password == '') {
        setAlertModalData({
          title: 'Error!',
          text: 'Debes introducir todos los datos.',
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
        return;
      }
      
      const user = { name: nick, password: password, email: email}
      const jsonUser = JSON.stringify(user);
      const responseData = await apiRequest('user/register', 'POST', jsonUser);
     
      // comparativa en el if de si la respuesta vuelve vacia o no, si vuelve vacia mensaje de error en el registro y si no vuelve vacia mensaje de registro correcto y navega a la pantalla de login
      if (responseData == -1) {
        setAlertModalData({
          title: 'Error!',
          text: 'credenciales incorrectas',
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
        
      } else {
        setAlertModalData({
          title: 'Correcto!',
          text: 'Registro correcto. Ahora puedes iniciar sesión.',
          icon: 'success',
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
        
        navigation.navigate('Login');
      }

      // Navegar a otra pantalla o hacer algo más después de un inicio de sesión exitoso
    } catch (error) {
      setAlertModalData({
        title: 'Error!',
        text: 'Error inesperado. Inténtalo de nuevo más tarde.',
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
        colors={['#CFD8DC', '#455A64']}
        style={commonStyles.container}
      >
        <View>
            <Title style={commonStyles.texTitle}>REGISTRO</Title>
            <TextInput
                placeholder="Nick"
                value={nick}
                onChangeText={setNick}
                style={commonStyles.inputLogin}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={commonStyles.inputLogin}
            />
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={commonStyles.inputLogin}
            />
            <View style={commonStyles.horizontalAlign}>
              <Button title="Registrarse" mode="contained" onPress={handleSignup} style={commonStyles.brandButton}>
                Registrarse
              </Button>
              <Button title="Volver atras" mode="contained" onPress={() =>navigation.navigate('Login')} style={commonStyles.brandButton}>
                Volver atras
              </Button>
            </View>
          </View>
          <View>
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

export default SignupScreen;