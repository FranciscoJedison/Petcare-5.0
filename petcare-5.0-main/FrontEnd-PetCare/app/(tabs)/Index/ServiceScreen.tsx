import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Importa telas filhas
import Login from '../Login';
import CadastroAtendimento from '../CadastroAtendimento';
import GerenciamentoAgendamento from '../../GerenciamentoAgendamento';

interface ServiceItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  description: string;
}

type ViewKey = 'services' | 'login' | 'cadastro' | 'gerenciamento' | null;

export default function ServicesScreen() {
  const [modalView, setModalView] = useState<ViewKey>(null);

  const handleAgendar = async () => {
    const userType = await AsyncStorage.getItem('userType');
    setModalView(null);
    setTimeout(() => {
      if (userType === '1') setModalView('cadastro');
      else if (userType === '0') setModalView('gerenciamento');
      else setModalView('login');
    }, 300);
  };

  const renderModalContent = () => {
    switch (modalView) {
      case 'login':
        return <Login />;
      case 'cadastro':
        return <CadastroAtendimento />;
      case 'gerenciamento':
        return <GerenciamentoAgendamento />;
      default:
        return null;
    }
  };

  return (
    <>
      <LinearGradient colors={['#00BFA6', '#FFFFFF']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.serviceContainer}>
          <Text style={styles.pageTitle}>Nossos Serviços</Text>

          <ServiceItem
            icon="search"
            title="Tratamentos Faciais Avançados"
            description="Limpeza de pele profunda, peelings químicos, microagulhamento, laser facial, radiofrequência e hidratação intensiva."
          />
          <ServiceItem
            icon="heart"
            title="Tratamentos Corporais"
            description="Massagens terapêuticas, lipocavitação, criolipólise, radiofrequência, endermologia e envoltórios corporais."
          />
          <ServiceItem
            icon="cut"
            title="Tratamentos Capilares"
            description="Mesoterapia, terapia com LED, PRP capilar, detox capilar e hidratação profunda dos fios."
          />
          <ServiceItem
            icon="stethoscope"
            title="Podologia"
            description="Tratamento de calos, unhas encravadas, micoses, reflexologia e cuidados para pés diabéticos."
          />
          <ServiceItem
            icon="leaf"
            title="Bem-Estar e Terapias Alternativas"
            description="Aromaterapia, acupuntura estética, reiki, reflexologia e meditação guiada."
          />
          <ServiceItem
            icon="star"
            title="Estética e Remodelação"
            description="Depilação a laser, bronzeamento, clareamento, esfoliação corporal e hidratação profunda."
          />
        </ScrollView>

        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleAgendar}>
            <Text style={styles.buttonText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* MODAL */}
      <Modal
        visible={modalView !== null}
        animationType="slide"
        onRequestClose={() => setModalView(null)}
      >
        <LinearGradient colors={['#00BFA6', '#FFFFFF']} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.backButton} onPress={() => setModalView(null)}>
            <FontAwesome name="arrow-left" size={20} color="white" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>{renderModalContent()}</View>
        </LinearGradient>
      </Modal>
    </>
  );
}

// Componente individual de serviço
function ServiceItem({ icon, title, description }: ServiceItemProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={({ pressed }) => [
        styles.serviceCard,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <BlurView intensity={90} tint="light" style={styles.blurLayer}>
        <LinearGradient colors={['#FFFFFF', '#E6FFFB']} style={styles.cardContent}>
          <LinearGradient
            colors={['#00BFA6', '#00E5C4']}
            style={styles.iconCircle}
          >
            <FontAwesome name={icon} size={26} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.serviceTitle}>{title}</Text>
          <Text style={styles.serviceDescription}>{description}</Text>
        </LinearGradient>
      </BlurView>
    </Pressable>
  );
}

// === ESTILOS ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00635D',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  serviceContainer: {
    padding: 20,
    paddingBottom: 160,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00BFA6',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#00635D',
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  serviceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#00BFA6',
    shadowOpacity: 0.25,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  blurLayer: {
    borderRadius: 24,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#00BFA6',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00635D',
    marginBottom: 8,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BFA6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  backText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});
