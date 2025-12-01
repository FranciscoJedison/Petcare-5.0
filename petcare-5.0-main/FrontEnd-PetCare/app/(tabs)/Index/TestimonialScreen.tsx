import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Testimonial {
  image: any;
  comment: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    image: require('../../../assets/images/profile1.png'),
    comment:
      'O atendimento veterinário é excelente! O Thor teve um probleminha de pele, e os veterinários explicaram tudo direitinho. O tratamento foi um sucesso, e ele está ótimo agora!',
    name: 'Carlos Lima',
    role: 'Cliente Satisfeito',
  },
  {
    image: require('../../../assets/images/profile2.png'),
    comment:
      'A equipe da clínica sempre trata a Mel com muito carinho e profissionalismo! O banho e tosa são impecáveis, e ela sai sempre cheirosa e feliz. Confio 100% no atendimento!',
    name: 'Ana Souza',
    role: 'Cliente Fiel',
  },
  {
    image: require('../../../assets/images/profile3.png'),
    comment:
      'Adoro trazer a Luna aqui! A limpeza bucal foi feita com muito cuidado, e agora sei como manter os dentes dela saudáveis. Equipe super atenciosa!',
    name: 'Juliana Mendes',
    role: 'Cliente Satisfeita',
  },
  {
    image: require('../../../assets/images/profile4.png'),
    comment:
      'A clínica é super organizada e o atendimento é rápido! Sempre trago o Max para as vacinas e check-ups, e ele é tratado com todo o carinho que merece.',
    name: 'Fernando Mendes',
    role: 'Cliente Satisfeito',
  },
  {
    image: require('../../../assets/images/profile5.png'),
    comment:
      'O spa pet é maravilhoso! A Nina fez hidratação nos pelos e tosa estilizada, ficou simplesmente linda! Super recomendo.',
    name: 'Mariana Silva',
    role: 'Cliente Satisfeita',
  },
];

const TestimonialScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [testimonialsData, setTestimonialsData] = useState(testimonials);

  const addTestimonial = () => {
    if (newName && newComment) {
      const newTestimonial: Testimonial = {
        image: require('../../../assets/images/profile1.png'),
        comment: newComment,
        name: newName,
        role: 'Novo Cliente',
      };
      setTestimonialsData([...testimonialsData, newTestimonial]);
      setModalVisible(false);
      setNewName('');
      setNewComment('');
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <LinearGradient
      colors={['#00BFA6', '#E0F7F5', '#F9F9F9']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../../assets/images/petcareicon.png')} 
            style={styles.imageContain} 
          />
        </View>
        <Text style={styles.title}>Depoimentos</Text>
        <Text style={styles.subtitle}>
          O que nossos clientes dizem sobre o Pet Care
        </Text>

        {testimonialsData.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={26}
              color="#00BFA6"
              style={styles.icon}
            />
            <Text style={styles.comment}>{item.comment}</Text>
            <View style={styles.personInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          </View>
        ))}

        {/* Botão de adicionar depoimento */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={['#00BFA6', '#0A6963']}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar Comentário</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal estilizado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar Comentário</Text>

            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#888"
              value={newName}
              onChangeText={setNewName}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Seu comentário"
              placeholderTextColor="#888"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />

            <TouchableOpacity style={styles.modalButton} onPress={addTestimonial}>
              <LinearGradient
                colors={['#00BFA6', '#0A6963']}
                style={styles.modalButtonGradient}
              >
                <Ionicons name="send" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.modalButtonText}>Enviar</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#00BFA6',
  },
  icon: {
    marginBottom: 5,
  },
  comment: {
    fontSize: 15,
    color: '#444',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  personInfo: {
    alignItems: 'center',
    marginTop: 5,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#00BFA6',
  },
  role: {
    fontSize: 13,
    color: '#777',
  },
  addButton: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00BFA6',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 12,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButton: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  modalButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
    imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContain: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  cancelText: {
    color: '#999',
    marginTop: 10,
    fontSize: 15,
  },
});

export default TestimonialScreen;
