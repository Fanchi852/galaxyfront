import React, { useState } from 'react';
import { View, Alert, StyleSheet, Touchable } from 'react-native';
import { Text, TextInput, Button, Title } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/CommonStyles';
import Swal from 'sweetalert2';
import { apiRequest } from '../services/API';



const LoginScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    console.log('dentro del handleloging');
    // Aquí puedes agregar la lógica para validar las credenciales e iniciar sesión
    try {
      const user = { name: name, password: password}
      const jsonUser = JSON.stringify(user);
      console.log("este es el json: ", jsonUser);

      const responseData = await apiRequest('user/login', 'POST', jsonUser);
      
      console.log("esto debe de ser una sesion de usuario", responseData);
      if (responseData.userSession_id) {
        console.log('usuario correcto');
        navigation.navigate('ImperiumMenu', {userSession_id: responseData.userSession_id});
      } else {
        console.log('usuario incorrecto');
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        
     }

      // Aquí puedes manejar la respuesta de la API (por ejemplo, guardar el token de acceso)
      console.log('API response:', responseData);
      
      

      // Navegar a otra pantalla o hacer algo más después de un inicio de sesión exitoso
    } catch (error) {
      console.log('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      
    }
    console.log('Name:', name, 'Password:', password);
  };

  return (
    <View style={commonStyles.container}>
    <LinearGradient
      colors={['#00f260', '#0575e6']}
      style={commonStyles.container}
    >
      <Title style={commonStyles.title}>Iniciar sesión</Title>
      <TextInput
        label="Nick"
        value={name}
        onChangeText={(text) => setName(text)}
        style={commonStyles.input}
        keyboardType="Nick-name"
        autoCapitalize="none"
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={commonStyles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} style={commonStyles.button}>
        Ingresar
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Signup')} style={commonStyles.button}>
        registrar
      </Button>
    </LinearGradient>
    </View>
  );
};



export default LoginScreen;