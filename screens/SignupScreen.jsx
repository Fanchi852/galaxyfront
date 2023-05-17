import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TextInput, Button, Title } from 'react-native-paper';
import { View, StyleSheet,  } from 'react-native';
import Swal from 'sweetalert2';
import { commonStyles } from '../styles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../services/API';

const SignupScreen = () => {
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    console.log('dentro del handleSignup');
    try {
      const user = { name: nick, password: password, email: email}
      const jsonUser = JSON.stringify(user);
      console.log("este es el json: ", jsonUser);
      const responseData = await apiRequest('user/register', 'POST', jsonUser);
     
      // comparativa en el if de si la respuesta vuelve vacia o no, si vuelve vacia mensaje de error en el registro y si no vuelve vacia mensaje de registro correcto y navega a la pantalla de login
      console.log('responseData: ', responseData);
      if (responseData == -1) {
        Swal.fire({
          title: 'Error!',
          text: 'credenciales incorrectas',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        
      } else {
        console.log('API response:', responseData);
        Swal.fire({
          title: 'Correcto!',
          text: 'Registro correcto. Ahora puedes iniciar sesión.',
          icon: 'success',
          confirmButtonText: 'Cool',
          timer: 1500
        })
        
        navigation.navigate('Login');
      }

      // Aquí puedes manejar la respuesta de la API (por ejemplo, guardar el token de acceso)
      
      

      // Navegar a otra pantalla o hacer algo más después de un inicio de sesión exitoso
    } catch (error) {
      console.log('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      //showAlert('Error', 'No se pudo iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.');
    }
  };

  return (
    <View style={commonStyles.container}>
    <LinearGradient
      colors={['#00f260', '#0575e6']}
      style={commonStyles.container}
    >
        <Title style={commonStyles.title}>REGISTRO</Title>
        <TextInput
            placeholder="Nick"
            value={nick}
            onChangeText={setNick}
            style={commonStyles.input}
        />
        <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={commonStyles.input}
        />
        <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={commonStyles.input}
        />
        <Button title="Registrarse" mode="contained" onPress={handleSignup} style={commonStyles.button}>
        Registrarse
        </Button>
        
        <Button title="Volver atras" mode="contained" onPress={() =>navigation.navigate('Login')} style={commonStyles.button}>
        Volver atras
        </Button>
    </LinearGradient>
    </View>
  );
};

export default SignupScreen;