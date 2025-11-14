import * as React from 'react';
import { Provider as PaperProvider, Modal, TextInput, Portal, IconButton, Button, Text, Menu } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import API_URL from '../conf/api';

const GerenciamentoServico = () => {
  const [visible, setVisible] = React.useState({
    addService: false,
    editService: false,
    deleteService: false,
  });

  const [currentService, setCurrentService] = React.useState<{ id?: string; tiposervico: string; valor: string } | null>(null);
  const [services, setServices] = React.useState<{ id?: string; tiposervico: string; valor: string }[]>([]);
  const [newService, setNewService] = React.useState<{ tiposervico: string; valor: string }>({ tiposervico: '', valor: '' });
  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [campo1, setCampo1] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const options = ['Banho', 'Tosa', 'Castração', 'Exames de Saúde', 'Vacinação', 'Limpeza Bucal'];

  // Filtra serviços pela pesquisa
  const filteredServices = services.filter(service => {
    const query = searchQuery.toLowerCase();
    return (
      service.tiposervico.toLowerCase().includes(query) ||
      service.valor.toString().includes(query)
    );
  });

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicos`);
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', (error as Error).message);
    }
  };

  const addService = async () => {
    if (!newService.tiposervico || !newService.valor) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      await axios.post(`${API_URL}/servico/inserir`, newService);
      setNewService({ tiposervico: '', valor: '' });
      hideModal('addService');
      fetchServices();
      Alert.alert('Serviço Adicionado', 'O serviço foi adicionado com sucesso.');
    } catch (error) {
      console.error('Erro ao adicionar serviço:', (error as Error).message);
    }
  };

  const updateService = async () => {
    if (currentService?.id) {
      if (!currentService.tiposervico || !currentService.valor) {
        Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      try {
        await axios.put(`${API_URL}/servico/atualizar/${currentService.id}`, currentService);
        setCurrentService(null);
        hideModal('editService');
        fetchServices();
        Alert.alert('Serviço Atualizado', 'O serviço foi atualizado com sucesso.');
      } catch (error) {
        console.error('Erro ao atualizar serviço:', (error as Error).message);
      }
    }
  };

  const deleteService = async () => {
    if (currentService?.id) {
      try {
        await axios.delete(`${API_URL}/servico/deletar/${currentService.id}`);
        setCurrentService(null);
        hideModal('deleteService');
        fetchServices();
        Alert.alert('Serviço Excluído', 'O serviço foi excluído com sucesso.');
      } catch (error) {
        console.error('Erro ao deletar serviço:', (error as Error).message);
      }
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, []);

  const showModal = (type: 'addService' | 'editService' | 'deleteService') =>
    setVisible({ ...visible, [type]: true });

  const hideModal = (type: 'addService' | 'editService' | 'deleteService') =>
    setVisible({ ...visible, [type]: false });

  return (
    <LinearGradient colors={['#00BFA6', '#f9f9f9' ,'#f9f9f9']} style={styles.gradientBackground}>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <Image source={require('../assets/images/petcare.png')} style={styles.image} />

          <Button
            icon="plus"
            mode="contained"
            onPress={() => showModal('addService')}
            textColor="white"
            buttonColor="#00BFA6"
            contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
            labelStyle={{ marginLeft: 12 }}
          >
            Adicionar Serviço
          </Button>

          <TextInput
            label="Pesquisar"
            mode="outlined"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
            style={styles.searchInput}
          />

          <View style={styles.titleContainer}>
            <Text style={styles.tableTitle}>Lista de Serviços</Text>
          </View>

          <ScrollView style={{ marginTop: 10 }}>
            {filteredServices.length > 0 ? (
              filteredServices.map(service => (
                <View key={service.id} style={styles.cardWrapper}>
                  <BlurView intensity={50} tint="light" style={styles.cardBlur}>
                    <View style={styles.cardContent}>
                      <View style={styles.cardTextGroup}>
                        <Text style={styles.cardTitle}>{service.tiposervico}</Text>
                        <Text style={styles.cardSubtitle}>Valor: R$ {service.valor}</Text>
                      </View>
                      <View style={styles.cardActions}>
                        <IconButton
                          icon="pencil"
                          size={22}
                          onPress={() => {
                            setCurrentService(service);
                            showModal('editService');
                          }}
                          iconColor="#007bff"
                        />
                        <IconButton
                          icon="delete"
                          size={22}
                          onPress={() => {
                            setCurrentService(service);
                            showModal('deleteService');
                          }}
                          iconColor="#ff4444"
                        />
                      </View>
                    </View>
                  </BlurView>
                </View>
              ))
            ) : (
              <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
                Nenhum serviço encontrado
              </Text>
            )}
          </ScrollView>

          <Text style={styles.counterText}>Total de serviços: {filteredServices.length}</Text>

          {/* MODAIS */}
          <Portal>
            {/* Adicionar Serviço */}
            <Modal visible={visible.addService} onDismiss={() => hideModal('addService')} contentContainerStyle={styles.modal}>
              <Text style={styles.modalTitle}>Adicionar Serviço</Text>

              <Menu
                visible={visibleMenu}
                onDismiss={() => setVisibleMenu(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setVisibleMenu(true)}
                    style={styles.menuButton}
                    textColor="black"
                  >
                    {campo1 || 'Escolha o Tipo de Serviço'}
                  </Button>
                }
              >
                {options.map((option, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => {
                      setCampo1(option);
                      setNewService(prev => ({ ...prev, tiposervico: option }));
                      setVisibleMenu(false);
                    }}
                    title={option}
                  />
                ))}
              </Menu>

              <TextInput
                label="Valor"
                mode="outlined"
                value={newService.valor}
                onChangeText={text => setNewService(prev => ({ ...prev, valor: text }))}
                style={styles.inputField}
              />

              <Button mode="contained" onPress={addService} style={styles.agendamentoButton}>
                Adicionar
              </Button>
            </Modal>

            {/* Editar Serviço */}
            <Modal visible={visible.editService} onDismiss={() => hideModal('editService')} contentContainerStyle={styles.modal}>
              <Text style={styles.modalTitle}>Editar Serviço</Text>

              <Menu
                visible={visibleMenu}
                onDismiss={() => setVisibleMenu(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setVisibleMenu(true)}
                    style={styles.menuButton}
                    textColor="black"
                  >
                    {currentService?.tiposervico || 'Escolha o Tipo de Serviço'}
                  </Button>
                }
              >
                {options.map((option, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => {
                      setCurrentService(prev => prev ? { ...prev, tiposervico: option } : null);
                      setVisibleMenu(false);
                    }}
                    title={option}
                  />
                ))}
              </Menu>

              <TextInput
                label="Valor"
                mode="outlined"
                value={currentService?.valor || ''}
                onChangeText={text => setCurrentService(prev => prev ? { ...prev, valor: text } : null)}
                style={styles.inputField}
              />

              <Button mode="contained" onPress={updateService} style={styles.agendamentoButton}>
                Atualizar
              </Button>
            </Modal>

            {/* Deletar Serviço */}
            <Modal visible={visible.deleteService} onDismiss={() => hideModal('deleteService')} contentContainerStyle={styles.modal}>
              <Text style={styles.modalTitle}>Deletar Serviço</Text>
              <Text style={{ marginVertical: 15, textAlign: 'center' }}>
                Você tem certeza que deseja deletar o serviço <Text style={{ fontWeight: 'bold' }}>{currentService?.tiposervico}</Text>?
              </Text>
              <Button mode="contained" onPress={deleteService} style={[styles.agendamentoButton, { backgroundColor: 'red' }]}>
                Deletar
              </Button>
            </Modal>
          </Portal>
        </SafeAreaView>
      </PaperProvider>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  container: { flex: 1, padding: 16 },
  image: { width: 150, height: 150, marginBottom: 20, borderRadius: 50, alignSelf: 'center' },
  titleContainer: { backgroundColor: '#00BFA6', borderRadius: 5, padding: 8, marginBottom: 10 },
  tableTitle: { fontSize: 15, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  cardBlur: { borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTextGroup: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  searchInput: { marginVertical: 10, backgroundColor: '#fff' },
  counterText: { color: 'white', textAlign: 'center', marginTop: 10, fontWeight: 'bold' },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  inputField: { marginBottom: 15, backgroundColor: '#fff' },
  agendamentoButton: { backgroundColor: '#00BFA6' },
  menuButton: { marginBottom: 12, borderRadius: 8, backgroundColor: '#fff' },
});

export default GerenciamentoServico;
