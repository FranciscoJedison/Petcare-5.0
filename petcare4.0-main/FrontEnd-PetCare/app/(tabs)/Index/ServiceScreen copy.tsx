import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones

// Definindo o tipo do componente ServiceItem para aceitar apenas os ícones disponíveis na biblioteca FontAwesome do Expo
interface ServiceItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name']; // Usando os ícones disponíveis na biblioteca FontAwesome
  title: string;
  description: string;
}

const ServicesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.heading}>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Agendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceContainer}>
        <ServiceItem
          icon="pencil"
          title="Consultas e Check-ups Veterinários"
          description="Realizamos consultas preventivas e check-ups completos para garantir a saúde e bem-estar do seu pet. Diagnóstico preciso com profissionais qualificados."
        />
        <ServiceItem
          icon="bath"
          title="Banho e Tosa Especializados"
          description="Oferecemos banho com produtos dermatologicamente testados, tosa higiênica, tosa na tesoura e hidratação para manter seu pet sempre limpo e saudável."
        />
        <ServiceItem
          icon="eyedropper"
          title="Vacinação do seu Pet"
          description="Mantenha seu pet protegido com nosso calendário de vacinas essenciais e protocolo de vermifugação personalizado."
        />
        <ServiceItem
          icon="cut"
          title="Cuidados Estéticos e Bem-estar"
          description="Corte de unhas, limpeza de ouvidos, escovação dos dentes e hidratação para pelos macios e saudáveis."
        />
        <ServiceItem
          icon="user-md"
          title="Odontologia Veterinária"
          description="Cuidamos da saúde bucal do seu pet com limpeza de tártaro, extração dentária e orientações para uma higiene oral adequada, prevenindo doenças periodontais."
        />
        <ServiceItem
          icon="hospital-o"
          title="Cirurgias e Castração"
          description="Realizamos procedimentos cirúrgicos com segurança e acompanhamento especializado, incluindo castração, remoção de tumores e outros tratamentos cirúrgicos essenciais."
        />
      </View>
    </ScrollView>
  );
};

// Componente para representar cada item de serviço
const ServiceItem = ({ icon, title, description }: ServiceItemProps) => {
  return (
    <View style={styles.serviceItem}>
      <FontAwesome name={icon} size={40} color="#0A6963" style={styles.icon} />
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32312F', // Cor de fundo
    padding: 20,
  },
  heading: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#8B4513', // Cor marrom para o título
  },
  highlight: {
    color: '#8B4513', // Cor marrom para destacar a palavra 'serviços'
  },
  button: {
    backgroundColor: '#0A6963', // Cor do botão marrom
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  serviceContainer: {
    marginTop: 20,
  },
  serviceItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A6963', // Cor marrom para os títulos dos serviços
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default ServicesScreen;
