import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ServiceItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  description: string;
}

const ServicesScreen = () => {
  return (
    <LinearGradient
      colors={['#00BFA6', '#F9F9F9', '#F9F9F9']}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headingTitle}>Nossos Serviços</Text>
        <Text style={styles.subtitle}>
          Cuidado completo e especializado para o bem-estar do seu pet 🐾
        </Text>

        <TouchableOpacity style={styles.button}>
          <LinearGradient
            colors={['#00BFA6', '#009E8A']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Agendar Consulta</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.serviceContainer}>
          <ServiceItem
            icon="stethoscope"
            title="Consultas e Check-ups Veterinários"
            description="Cuidamos da saúde do seu pet com exames detalhados e diagnóstico profissional."
          />
          <ServiceItem
            icon="bath"
            title="Banho e Tosa Especializados"
            description="Cuidados estéticos com produtos hipoalergênicos e muito carinho."
          />
          <ServiceItem
            icon="medkit"
            title="Vacinação do seu Pet"
            description="Vacinas atualizadas e seguras para manter seu pet sempre protegido."
          />
          <ServiceItem
            icon="heart"
            title="Cuidados Estéticos e Bem-estar"
            description="Hidratação, corte de unhas, limpeza de ouvidos e escovação dos dentes."
          />
          <ServiceItem
            icon="user-md"
            title="Odontologia Veterinária"
            description="Limpeza de tártaro e tratamento odontológico completo."
          />
          <ServiceItem
            icon="hospital-o"
            title="Cirurgias e Castração"
            description="Procedimentos seguros com equipe especializada e equipamentos modernos."
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const ServiceItem = ({ icon, title, description }: ServiceItemProps) => {
  return (
    <View style={styles.serviceItem}>
      <View style={styles.iconContainer}>
        <FontAwesome name={icon} size={28} color="#00BFA6" />
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100, // 👈 Adicionado para evitar sobreposição com o menu inferior
  },
  headingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004C45',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    borderRadius: 12,
    marginBottom: 30,
    elevation: 4,
  },
  buttonGradient: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceContainer: {
    width: '100%',
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#E6FFFB',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BFA6',
    textAlign: 'center',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ServicesScreen;
