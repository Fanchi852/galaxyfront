import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, Image} from 'react-native';

// este modal servira para mostrar ventans con informacion al usuario ya sea errores o mensajes de confirmacion
const AlertModal = ( {inputVisible, onCloseModal, data} ) => {
    var [modalVisible, setModalVisible] = useState(false);
    var [modalData, setModalData] = useState(data);

    /*{
    title: 'Transferencia correcta',
    text: 'Se ha realizado la transferencia de recursos',
    icon: 'ok',
    buttons: [
            {
                name: 'CONFIRM',
                text: 'Aceptar',
                syle: styles.buttonOk,
                textStyle: styles.textStyle
            },
            {
                name: 'CANCEL',
                text: 'Cancelar',
                syle: styles.buttonCancel,
                textStyle: styles.textStyle
            }
        ]
    }*/

    useEffect(()=>{
        setModalVisible(inputVisible);
    }
    ,[inputVisible]);

    useEffect(()=>{
        setModalData(data);
    }
    ,[data]);

    function closeModal(buttonNamePressed){
        setModalVisible(false);
        onCloseModal(buttonNamePressed);
    }

    const icondImages = {
        'error': require('../assets/cancelar.png'),
        'ok': require('../assets/comprobar.png'),
        'warning': require('../assets/warning.png'),
      };

return (
    <View style={styles.centeredView}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            presentationStyle="fullScreen"
            >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Image
                      style={{width: 50, height: 50}}
                      source={{uri : icondImages[data.icon]}} />
                    <Text style={styles.title}>{data.title}</Text>
                    <Text style={styles.text}>{data.text}</Text>
                    {modalData && modalData.buttons ? modalData.buttons.map(button => (
                         <Pressable
                            key={button.name}
                            style={button.syle}
                            onPress={() => closeModal(button.name)}>
                            <Text style={button.textStyle}>{button.text}</Text>
                        </Pressable>
                    )) : null}
                </View>
            </View>
        </Modal>
    </View>
);
};

const styles = StyleSheet.create({ 
    title: {
        fontSize:18,
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    text: {
        fontSize:14,
        flex: 1,
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
});

export default AlertModal;