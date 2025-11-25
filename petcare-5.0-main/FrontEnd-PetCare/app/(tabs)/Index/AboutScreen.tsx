import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  

const AboutScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={['#00BFA6', '#F9F9F9' , '#F9F9F9', '#F9F9F9']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../../assets/images/petcare.png')} 
            style={styles.image} 
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Pet Care</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.info}>Fundação: <Text style={styles.highlight}>2020</Text></Text>
            <Text style={styles.info}>Especialidade: <Text style={styles.highlight}>Pet Shop / Clínica Veterinária</Text></Text>
            <Text style={styles.info}>Localização: <Text style={styles.highlight}>Samambaia Norte - Brasília, Brasil</Text></Text>
            <Text style={styles.info}>Disponibilidade: <Text style={styles.highlight}>Segunda a Sexta</Text></Text>
            <Text style={styles.info}>Horário de funcionamento: <Text style={styles.highlight}>08:00 às 17:00</Text></Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Saiba Mais</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {[
            { number: '10.000+', text: 'Pets cuidados com carinho' },
            { number: '500+', text: 'Consultas e procedimentos mensais' },
            { number: '99.5%+', text: 'Eficiência nos diagnósticos' },
            { number: '15+', text: 'Serviços de bem-estar animal' },
          ].map((stat, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Animated.View style={[styles.statBox, { transform: [{ scale: scaleAnim }] }]}>
                <LinearGradient
                  colors={['#ffffff', '#e8fffa']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientCard}
                >
                  <Text style={styles.statNumber}>{stat.number}</Text>
                  <Text style={styles.statText}>{stat.text}</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sobre a Pet Care</Text>
              <Text style={styles.modalDescription}>
                Na Pet Care, acreditamos que todo pet merece cuidados de qualidade, carinho e atenção especial. 
                Fundada em 2018, nossa clínica veterinária e pet shop foi criada com o compromisso de oferecer 
                serviços completos para a saúde e bem-estar do seu melhor amigo.
                {"\n\n"}
                Contamos com uma equipe de profissionais apaixonados por animais, prontos para oferecer atendimento 
                personalizado e tratamentos de excelência. Nossa missão é garantir que cada pet receba o melhor 
                cuidado possível, com conforto e segurança.
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 120,
    paddingTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 100,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0A6963',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#00BFA6',
  },
  button: {
    backgroundColor: '#00BFA6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  statBox: {
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00BFA6',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  gradientCard: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: 165,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00BFA6',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00BFA6',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#00BFA6',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AboutScreen;
