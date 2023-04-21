import React, { useState } from 'react';
import { View, Alert, StyleSheet, Touchable } from 'react-native';
import { Text, TextInput, Button, Title } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/CommonStyles';
import {Swal} from 'sweetalert2';



const LoginScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const showAlert = (title, message) => {
    setTimeout(() => {
      Alert.alert(title, message);
    }, 100);
  };

  const handleLogin = async () => {
    console.log('dentro del handleloging');
    // Aquí puedes agregar la lógica para validar las credenciales e iniciar sesión
    try {
      const user = { name: name, password: password}
      const jsonUser = JSON.stringify(user);
      console.log("este es el json: ", jsonUser);
      var url = "http://192.168.0.21:8080/APIGalaxy/resources/user/login";
      console.log('dentro del try');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: jsonUser,
      });
      
      const responseData = await response.json();
     
      console.log("esto debe de ser una sesion de usuario", responseData);
      if (responseData.userSession_id) {
        console.log('usuario correcto');
        navigation.navigate('ImperiumMenu');
      } else {
        console.log('usuario incorrecto');
        showAlert('Error', 'No se pudo iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.');
     }

      // Aquí puedes manejar la respuesta de la API (por ejemplo, guardar el token de acceso)
      console.log('API response:', responseData);
      showAlert('API response:', JSON.stringify(responseData));
      

      // Navegar a otra pantalla o hacer algo más después de un inicio de sesión exitoso
    } catch (error) {
      console.log('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      showAlert('Error', 'No se pudo iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.');
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