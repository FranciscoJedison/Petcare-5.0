import * as React from 'react';
import { Provider as PaperProvider, TextInput, Modal, Portal, IconButton, Button, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View, Image, ScrollView, Alert, Pressable } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import API_URL from '../conf/api';
import { BlurView } from 'expo-blur';

const GerenciamentoUser = () => {
  const [visible, setVisible] = React.useState({
    addUser: false,
    editUser: false,
    deleteUser: false,
  });

  const [currentUser, setCurrentUser] = React.useState<{ id?: string; nome: string; senha: string; tipoUsuario: number; email: string } | null>(null);
  const [users, setUsers] = React.useState<{ id?: string; nome: string; senha: string; tipoUsuario: number; email: string }[]>([]);
  const [newUser, setNewUser] = React.useState<{ nome: string; senha: string; tipoUsuario: number; email: string }>({ nome: '', senha: '', tipoUsuario: 0, email: '' });
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.nome.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.senha.toLowerCase().includes(query) ||
      user.tipoUsuario.toString().includes(query)
    );
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', (error as Error).message);
    }
  };

  const addUser = async () => {
    if (!newUser.nome || !newUser.senha || !newUser.email) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    try {
      await axios.post(`${API_URL}/usuario/inserir`, newUser);
      setNewUser({ nome: '', senha: '', tipoUsuario: 0, email: '' });
      hideModal('addUser');
      fetchUsers();
      Alert.alert("Usuário adicionado com sucesso!");
    } catch (error) {
      console.error('Erro ao adicionar usuário:', (error as Error).message);
    }
  };

  const updateUser = async () => {
    if (currentUser?.id) {
      try {
        await axios.put(`${API_URL}/usuarios/atualizar/${currentUser.id}`, currentUser);
        setCurrentUser(null);
        hideModal('editUser');
        fetchUsers();
        Alert.alert("Usuário atualizado com sucesso!");
      } catch (error) {
        console.error('Erro ao atualizar usuário:', (error as Error).message);
      }
    }
  };

  const deleteUser = async () => {
    if (currentUser?.id) {
      try {
        await axios.delete(`${API_URL}/usuario/deletar/${currentUser.id}`);
        setCurrentUser(null);
        hideModal('deleteUser');
        fetchUsers();
        Alert.alert("Usuário excluído com sucesso!");
      } catch (error) {
        console.error('Erro ao deletar usuário:', (error as Error).message);
      }
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const showModal = (type: 'addUser' | 'editUser' | 'deleteUser') => {
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addUser' | 'editUser' | 'deleteUser') => {
    setVisible({ ...visible, [type]: false });
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/images/petcare.png')} style={styles.image} />

        <Button
          icon="plus"
          mode="contained"
          onPress={() => showModal('addUser')}
          textColor="white"
          buttonColor="#00635D"
          style={{ marginBottom: 10 }}
        >
          Adicionar Usuário
        </Button>

        <TextInput
          label="Pesquisar"
          mode="outlined"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchInput}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.tableTitle}>Lista de Usuários</Text>
        </View>

        {/* Cards de Usuários */}
        <ScrollView style={{ flex: 1 }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Pressable
                key={user.id}
                style={({ pressed }) => [
                  styles.cardWrapper,
                  pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
                ]}
              >
                <BlurView intensity={70} tint="dark" style={styles.cardBlur}>
                  <View style={styles.cardContent}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>
                        {user.nome?.charAt(0).toUpperCase() || '?'}
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cardTitle}>{user.nome}</Text>
                      <Text style={styles.cardText}>📧 {user.email}</Text>
                      <Text style={styles.cardText}>🔑 {user.senha}</Text>
                      <Text style={styles.cardText}>
                        👤 {user.tipoUsuario === 0 ? 'Administrador' : 'Cliente'}
                      </Text>
                    </View>

                    <View style={styles.cardActions}>
                      <IconButton
                        icon="pencil"
                        size={22}
                        onPress={() => {
                          setCurrentUser(user);
                          showModal('editUser');
                        }}
                        iconColor="#fff"
                        style={[styles.actionButton, { backgroundColor: '#1976D2' }]}
                      />
                      <IconButton
                        icon="delete"
                        size={22}
                        onPress={() => {
                          setCurrentUser(user);
                          showModal('deleteUser');
                        }}
                        iconColor="#fff"
                        style={[styles.actionButton, { backgroundColor: '#E53935' }]}
                      />
                    </View>
                  </View>
                </BlurView>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
              Nenhum usuário encontrado.
            </Text>
          )}
        </ScrollView>

        <Text style={styles.counterText}>Total de usuários: {filteredUsers.length}</Text>

        {/* === MODAIS === */}

        {/* Adicionar */}
        <Portal>
          <Modal visible={visible.addUser} onDismiss={() => hideModal('addUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Usuário</Text>
              <TextInput label="Nome" mode="outlined" value={newUser.nome} onChangeText={text => setNewUser(prev => ({ ...prev, nome: text }))} style={styles.gridItem} />
              <TextInput label="Email" mode="outlined" value={newUser.email} onChangeText={text => setNewUser(prev => ({ ...prev, email: text }))} style={styles.gridItem} />
              <TextInput label="Senha" mode="outlined" secureTextEntry value={newUser.senha} onChangeText={text => setNewUser(prev => ({ ...prev, senha: text }))} style={styles.gridItem} />

              <Text>Tipo Usuário</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={newUser.tipoUsuario} onValueChange={(itemValue) => setNewUser(prev => ({ ...prev, tipoUsuario: itemValue }))}>
                  <Picker.Item label="Administrador" value={0} />
                  <Picker.Item label="Cliente" value={1} />
                </Picker>
              </View>

              <Button mode="contained" onPress={addUser} style={styles.agendamentoButton}>
                Adicionar
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* Editar */}
        <Portal>
          <Modal visible={visible.editUser} onDismiss={() => hideModal('editUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Usuário</Text>
              <TextInput label="Nome" mode="outlined" value={currentUser?.nome || ''} onChangeText={text => setCurrentUser(prev => prev ? { ...prev, nome: text } : null)} style={styles.gridItem} />
              <TextInput label="Email" mode="outlined" value={currentUser?.email || ''} onChangeText={text => setCurrentUser(prev => prev ? { ...prev, email: text } : null)} style={styles.gridItem} />
              <TextInput label="Senha" mode="outlined" secureTextEntry value={currentUser?.senha || ''} onChangeText={text => setCurrentUser(prev => prev ? { ...prev, senha: text } : null)} style={styles.gridItem} />

              <View style={styles.pickerWrapper}>
                <Picker selectedValue={currentUser?.tipoUsuario} onValueChange={(itemValue) => setCurrentUser(prev => prev ? { ...prev, tipoUsuario: itemValue } : null)}>
                  <Picker.Item label="Administrador" value={0} />
                  <Picker.Item label="Cliente" value={1} />
                </Picker>
              </View>

              <Button mode="contained" onPress={updateUser} style={styles.agendamentoButton}>
                Salvar
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* Excluir */}
        <Portal>
          <Modal visible={visible.deleteUser} onDismiss={() => hideModal('deleteUser')} contentContainerStyle={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Excluir Usuário</Text>
              <Text style={{ marginVertical: 10 }}>
                Deseja realmente excluir o usuário <Text style={{ fontWeight: 'bold' }}>{currentUser?.nome}</Text>?
              </Text>
              <Button mode="contained" onPress={deleteUser} style={styles.deleteButton}>
                Deletar
              </Button>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  image: { width: 150, height: 150, marginBottom: 20, borderRadius: 50, alignSelf: 'center' },
  searchInput: { marginVertical: 10, backgroundColor: '#fff' },
  titleContainer: { backgroundColor: '#00635D', borderRadius: 5, padding: 8, marginBottom: 10 },
  tableTitle: { fontSize: 15, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  cardBlur: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6, letterSpacing: 0.5 },
  cardText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 3 },
  cardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionButton: { marginHorizontal: 3, borderRadius: 30, width: 42, height: 42, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  modal: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignSelf: 'center' },
  modalContent: { marginBottom: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  gridItem: { marginBottom: 12 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  agendamentoButton: { backgroundColor: '#14bdb1ff', marginTop: 10 },
  deleteButton: { backgroundColor: '#e74c3c', marginTop: 10 },
  counterText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white' },
});

export default GerenciamentoUser;
