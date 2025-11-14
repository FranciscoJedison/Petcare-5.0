import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, Modal, TextInput, Portal, IconButton, Button, Text, Card } from 'react-native-paper';
import { SafeAreaView, StyleSheet, ScrollView, Image, View, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState, useLayoutEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import API_URL from '../conf/api';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  GerenciamentoAgendamentoUser: undefined;
};

const horarios = [
  '08:00:00',
  '09:00:00',
  '10:00:00',
  '11:00:00',
  '12:00:00',
];

type Agendamento = {
  id?: number;
  dataAtendimento: string;
  dthoraAgendamento: string;
  horario: string;
  usuario_id: number;
  servico_id: number;
  usuarioNome?: string;
  tipoServico?: string;
  usuarioEmail?: string;
  valor?: number;
  fk_usuario_id: number;
  fk_servico_id: number;
};

type AgendamentoInsercao = {
  dataAtendimento: string;
  dthoraAgendamento: string;
  horario: string;
  fk_usuario_id: number;
  fk_servico_id: number;
};

type Servico = {
  id: number;
  tiposervico: string;
  valor: number;
};

type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: number;
};

const GerenciamentoAgendamentoUser = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [visible, setVisible] = React.useState({
    addAgendamento: false,
    editAgendamento: false,
    deleteAgendamento: false,
  });

  const [currentAgendamento, setCurrentAgendamento] = React.useState<Agendamento | null>(null);
  const [agendamentos, setAgendamentos] = React.useState<Agendamento[]>([]);
  const [newAgendamento, setNewAgendamento] = React.useState<AgendamentoInsercao>({
    dataAtendimento: '',
    dthoraAgendamento: '',
    horario: '',
    fk_usuario_id: 0,
    fk_servico_id: 0,
  });

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedServico, setSelectedServico] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedHorario, setSelectedHorario] = useState('');
  const [selectedDataAtendimento, setSelectedDataAtendimento] = useState('');
  const [selectedDateEditar, setSelectedDateEditar] = useState(new Date());
  const [showDatePickerEditar, setShowDatePickerEditar] = useState(false);
  const [selectedHorarioEditar, setSelectedHorarioEditar] = useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filtra os agendamentos com base na pesquisa
  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const query = searchQuery.toLowerCase();
    return (
      agendamento.dataAtendimento.toLowerCase().includes(query) ||
      agendamento.usuarioNome?.toLowerCase().includes(query) ||
      agendamento.tipoServico?.toLowerCase().includes(query) ||
      agendamento.usuarioEmail?.toLowerCase().includes(query) ||
      (agendamento.valor && agendamento.valor.toString().includes(query))
    );
  });

  // Função para formatar data sem as coordenadas de timezone
  const formatDate = (isoDate: string | null | undefined): string => {
    if (!isoDate) return '';
    
    try {
      const date = new Date(isoDate);
      
      // Formata apenas a data no formato DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  // Função para formatar o valor de forma segura
  const formatValor = (valor: number | undefined): string => {
    if (valor === undefined || valor === null) {
      return 'Não informado';
    }
    return `R$ ${valor.toFixed(2)}`;
  };

  // Função para verificar se já existe agendamento no mesmo dia e horário
  const verificarAgendamentoExistente = (dataAtendimento: string, horario: string, agendamentoId?: number): boolean => {
    const [day, month, year] = dataAtendimento.split('/');
    const dataFormatada = `${year}-${month}-${day}`;
    
    const agendamentoExistente = agendamentos.find(agendamento => {
      if (agendamentoId && agendamento.id === agendamentoId) {
        return false;
      }
      
      return agendamento.dataAtendimento === dataFormatada && 
             agendamento.horario === horario;
    });
    
    return !!agendamentoExistente;
  };

  useEffect(() => {
    navigation.setOptions({ title: 'Lista de Agendamentos' });
  }, []);

  useEffect(() => {
    const now = new Date();
    const options = { timeZone: 'America/Sao_Paulo', hour12: false };
    const localDate = now.toLocaleString('sv-SE', options);
    const utcDate = new Date(localDate + 'Z');
    setNewAgendamento(prev => ({ ...prev, dthoraAgendamento: utcDate.toISOString() }));
  }, []);

  const fetchAgendamentos = async () => {
    try {
      const userEmailStored = await AsyncStorage.getItem('userEmail');

      if (!userEmailStored) {
        console.error('E-mail não encontrado no AsyncStorage.');
        return;
      }

      const response = await axios.get(`${API_URL}/agendamentosUser`, {
        params: {
          email: userEmailStored
        }
      });

      const agendamentosData = response.data.map((item: any) => ({
        id: item.agendamento_id,
        dataAtendimento: item.dataatendimento,
        dthoraAgendamento: item.dthoraagendamento,
        horario: item.horario,
        usuarioNome: item.usuario_nome,
        usuario_id: item.usuario_id,
        servico_id: item.servico_id,
        tipoServico: item.tiposervico,
        usuarioEmail: item.usuario_email,
        valor: item.valor !== null && item.valor !== undefined ? Number(item.valor) : undefined,
      }));

      setAgendamentos(agendamentosData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar agendamentos:', error.message);
      } else {
        console.error('Erro desconhecido ao buscar agendamentos:', error);
      }
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicos`);
      const servicosData: Servico[] = response.data.map((item: any) => ({
        id: item.id,
        tiposervico: item.tiposervico,
        valor: item.valor,
      }));
      setServicos(servicosData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar serviços:', error.message);
      } else {
        console.error('Erro desconhecido ao buscar serviços:', error);
      }
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      const usuariosData: Usuario[] = response.data.map((item: any) => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        tipoUsuario: item.tipoUsuario,
      }));
      setUsuarios(usuariosData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar usuários:', error.message);
      } else {
        console.error('Erro desconhecido ao buscar usuários:', error);
      }
    }
  };

  const addAgendamento = async () => {
    console.log('Novo Agendamento:', newAgendamento);

    if (!newAgendamento.dataAtendimento || !newAgendamento.horario || newAgendamento.fk_servico_id <= 0) {
      Alert.alert(
        "Campos Obrigatórios",
        "Por favor, preencha todos os campos obrigatórios: data de atendimento, horário e serviço.",
        [{ text: "OK" }]
      );
      return;
    }

    const agendamentoExistente = verificarAgendamentoExistente(
      newAgendamento.dataAtendimento, 
      newAgendamento.horario
    );

    if (agendamentoExistente) {
      Alert.alert(
        "Horário Indisponível",
        "Já existe um atendimento agendado neste horário e dia. Por favor, escolha outra data ou horário.",
        [{ text: "OK" }]
      );
      return;
    }

    const [day, month, year] = newAgendamento.dataAtendimento.split('/');
    const formattedDataAtendimento = `${year}-${month}-${day}`;

    const userId = await AsyncStorage.getItem('userId');

    if (userId === null) {
      console.error('userId não encontrado no AsyncStorage');
      return;
    }

    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      console.error('userId não é um número válido');
      return;
    }

    const novoAgendamento: AgendamentoInsercao = {
      dataAtendimento: formattedDataAtendimento,
      dthoraAgendamento: new Date().toISOString(),
      horario: newAgendamento.horario,
      fk_usuario_id: userIdNumber,
      fk_servico_id: newAgendamento.fk_servico_id,
    };

    try {
      await axios.post(`${API_URL}/agendamento/inserir`, novoAgendamento);
      setNewAgendamento({
        dataAtendimento: '',
        dthoraAgendamento: '',
        horario: '',
        fk_usuario_id: 0,
        fk_servico_id: 0,
      });
      setSelectedServico('');
      hideModal('addAgendamento');
      fetchAgendamentos();

      Alert.alert(
        "Agendamento Adicionado",
        "O agendamento foi adicionado com sucesso!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      Alert.alert(
        "Erro",
        "Não foi possível adicionar o agendamento. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const validateAndUpdateAgendamento = () => {
    if (!currentAgendamento) {
      Alert.alert("Erro", "Agendamento não encontrado.");
      return;
    }

    if (!selectedDataAtendimento || !selectedHorarioEditar || !selectedServico) {
      Alert.alert(
        "Campos Obrigatórios",
        "Por favor, preencha todos os campos obrigatórios: data de atendimento, horário e serviço.",
        [{ text: "OK" }]
      );
      return;
    }

    const agendamentoExistente = verificarAgendamentoExistente(
      selectedDataAtendimento, 
      selectedHorarioEditar, 
      currentAgendamento.id
    );

    if (agendamentoExistente) {
      Alert.alert(
        "Horário Indisponível",
        "Já existe um atendimento agendado neste horário e dia. Por favor, escolha outra data ou horário.",
        [{ text: "OK" }]
      );
      return;
    }

    updateAgendamento();
  };

  const updateAgendamento = async () => {
    if (currentAgendamento?.id) {
      console.log('Dados a serem enviados:', currentAgendamento);

      const [day, month, year] = currentAgendamento.dataAtendimento.split('/');
      const formattedDataAtendimento = `${year}-${month}-${day}`;

      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        console.error('userId não encontrado no AsyncStorage');
        Alert.alert('Erro', 'userId não encontrado. Faça login novamente.');
        return;
      }

      const userIdNumber = Number(userId);

      if (isNaN(userIdNumber)) {
        console.error('userId não é um número válido');
        Alert.alert('Erro', 'O userId é inválido. Tente novamente.');
        return;
      }

      const agendamentoAtualizado = {
        dataatendimento: formattedDataAtendimento,
        dthoraAgendamento: currentAgendamento.dthoraAgendamento,
        horario: currentAgendamento.horario,
        fk_usuario_id: userIdNumber,
        fk_servico_id: currentAgendamento.fk_servico_id,
      };

      try {
        const response = await axios.put(`${API_URL}/agendamento/atualizar/${currentAgendamento.id}`, agendamentoAtualizado);
        console.log('Resposta do servidor:', response.data);
        setCurrentAgendamento(null);
        hideModal('editAgendamento');
        fetchAgendamentos();
        Alert.alert(
          "Agendamento Atualizado",
          "O agendamento foi atualizado com sucesso!",
          [{ text: "OK" }]
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro ao atualizar agendamento:', error.message);
          Alert.alert("Erro", "Não foi possível atualizar o agendamento. Tente novamente.");
        } else {
          console.error('Erro desconhecido ao atualizar agendamento:', error);
        }
      }
    } else {
      Alert.alert("Erro", "Agendamento não encontrado.");
    }
  };

  const deleteAgendamento = async () => {
    if (currentAgendamento?.id) {
      try {
        await axios.delete(`${API_URL}/agendamento/deletar/${currentAgendamento.id}`);
        setCurrentAgendamento(null);
        hideModal('deleteAgendamento');
        fetchAgendamentos();
        Alert.alert(
          "Agendamento Excluido",
          "O agendamento foi excluido com sucesso!",
          [{ text: "OK" }]
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Erro ao deletar agendamento:', error.message);
          Alert.alert("Erro", "Não foi possível excluir o agendamento. Tente novamente.");
        } else {
          console.error('Erro desconhecido ao deletar agendamento:', error);
        }
      }
    }
  };

  const showModal = (type: 'addAgendamento' | 'editAgendamento' | 'deleteAgendamento') => {
    if (type === 'editAgendamento' && currentAgendamento) {
      setSelectedDataAtendimento(currentAgendamento.dataAtendimento);
      setSelectedHorarioEditar(currentAgendamento.horario);
      setSelectedServico(currentAgendamento.fk_servico_id.toString());
    } else if (type === 'addAgendamento') {
      setNewAgendamento({
        dataAtendimento: '',
        dthoraAgendamento: '',
        horario: '',
        fk_usuario_id: 0,
        fk_servico_id: 0,
      });
      setSelectedServico('');
    }
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addAgendamento' | 'editAgendamento' | 'deleteAgendamento') => {
    setVisible({ ...visible, [type]: false });
  };

  const onChangeDate = (event: any, date?: Date, isEditMode: boolean = false) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('pt-BR');
      if (isEditMode) {
        setSelectedDataAtendimento(formattedDate);
        setCurrentAgendamento(prev => prev ? { ...prev, dataAtendimento: formattedDate } : null);
      } else {
        setNewAgendamento(prev => ({ ...prev, dataAtendimento: formattedDate }));
      }
    }
    setShowDatePicker(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedUserType = await AsyncStorage.getItem('userType');
      const userTypeNumber = storedUserType ? Number(storedUserType) : null;
      fetchAgendamentos();
      fetchServicos();
      fetchUsuarios();
    };

    fetchData();
  }, []);

  // Função para renderizar os cards de agendamento
  const renderAgendamentoCard = (agendamento: Agendamento, index: number) => (
    <Card 
      key={agendamento.id} 
      style={styles.card}
      elevation={3}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.serviceBadge}>
            <Text style={styles.serviceText}>{agendamento.tipoServico || 'Serviço'}</Text>
          </View>
          <Text style={styles.cardId}>#{agendamento.id}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{agendamento.usuarioNome || 'Cliente'}</Text>
          <Text style={styles.userEmail}>{agendamento.usuarioEmail || ''}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Data</Text>
              <Text style={styles.detailValue}>{formatDate(agendamento.dataAtendimento)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Horário</Text>
              <Text style={styles.detailValue}>{agendamento.horario}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Agendado em</Text>
              <Text style={styles.detailValue}>{formatDate(agendamento.dthoraAgendamento)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Valor</Text>
              <Text style={[styles.detailValue, styles.valorText]}>{formatValor(agendamento.valor)}</Text>
            </View>
          </View>
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
        <IconButton 
          icon="pencil" 
          size={20} 
          onPress={() => {
            setCurrentAgendamento(agendamento);
            showModal('editAgendamento');
          }} 
          iconColor="#2196F3" 
          style={styles.actionButton}
        />
        <IconButton 
          icon="delete" 
          size={20} 
          onPress={() => {
            setCurrentAgendamento(agendamento);
            showModal('deleteAgendamento');
          }} 
          iconColor="#f44336" 
          style={styles.actionButton}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <LinearGradient colors={['#00BFA6', '#80DFD0', '#f9f9f9']} style={styles.gradientBackground}>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Image source={require('../assets/images/petcare.png')} style={styles.image} />
            <Text style={styles.headerTitle}>Meus Agendamentos</Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <Button
              icon="plus"
              mode="contained"
              onPress={() => showModal('addAgendamento')}
              textColor="white"
              buttonColor="#00BFA6"
              contentStyle={styles.addButtonContent}
              labelStyle={styles.addButtonLabel}
              style={styles.addButton}
            >
              Novo Agendamento
            </Button>

            <TextInput
              label="Pesquisar"
              mode="outlined"
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
              style={styles.searchInput}
              left={<TextInput.Icon icon="magnify" />}
              outlineColor="#E0E0E0"
              activeOutlineColor="#00BFA6"
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus Agendamentos</Text>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {Array.isArray(filteredAgendamentos) ? filteredAgendamentos.length : 0}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
            {filteredAgendamentos.length > 0 ? (
              filteredAgendamentos.map((agendamento, index) => 
                renderAgendamentoCard(agendamento, index)
              )
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Text style={styles.emptyIcon}>📅</Text>
                  <Text style={styles.emptyTitle}>Nenhum agendamento encontrado</Text>
                  <Text style={styles.emptySubtitle}>
                    {searchQuery ? 'Tente ajustar os termos da pesquisa' : 'Clique no botão acima para adicionar um novo agendamento'}
                  </Text>
                </Card.Content>
              </Card>
            )}
          </ScrollView>

          {/* Modal Adicionar */}
          <Portal>
            <Modal visible={visible.addAgendamento} onDismiss={() => hideModal('addAgendamento')} contentContainerStyle={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Novo Agendamento</Text>
              </View>
              <View style={styles.modalContent}>
                <Button
                  mode="outlined"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.agendamentoInput}
                  labelStyle={{ color: '#666' }}
                >
                  {newAgendamento.dataAtendimento || 'Selecionar Data de Atendimento'}
                </Button>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => onChangeDate(event, date, false)}
                  />
                )}

                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newAgendamento.horario}
                    onValueChange={(itemValue) => setNewAgendamento(prev => ({ ...prev, horario: itemValue }))}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um horário" value="" />
                    {horarios.map((horario, index) => (
                      <Picker.Item key={index} label={horario} value={horario} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedServico}
                    onValueChange={(itemValue) => {
                      setSelectedServico(itemValue);
                      setNewAgendamento(prev => ({ ...prev, fk_servico_id: Number(itemValue) }));
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um Serviço" value="" />
                    {servicos.map((servico) => (
                      <Picker.Item key={servico.id} label={servico.tiposervico} value={servico.id} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.modalFooter}>
                <Button
                  mode="contained"
                  onPress={addAgendamento}
                  textColor="white"
                  buttonColor="#00BFA6"
                  contentStyle={styles.modalButtonContent}
                  labelStyle={styles.modalButtonLabel}
                >
                  Adicionar Agendamento
                </Button>
              </View>
            </Modal>
          </Portal>

          {/* Modal Editar */}
          <Portal>
            <Modal visible={visible.editAgendamento} onDismiss={() => hideModal('editAgendamento')} contentContainerStyle={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Agendamento</Text>
              </View>
              <View style={styles.modalContent}>
                {currentAgendamento && (
                  <View style={styles.currentDataContainer}>
                    <Text style={styles.currentDataText}>Dados atuais:</Text>
                    <Text style={styles.currentDataItem}>Data: {currentAgendamento.dataAtendimento}</Text>
                    <Text style={styles.currentDataItem}>Horário: {currentAgendamento.horario}</Text>
                    <Text style={styles.currentDataItem}>Serviço: {currentAgendamento.tipoServico}</Text>
                  </View>
                )}

                <Button mode="outlined" onPress={() => setShowDatePickerEditar(true)}
                  style={styles.agendamentoInput}
                  labelStyle={{ color: '#666' }}
                >
                  {selectedDataAtendimento || 'Selecionar Data de Atendimento'}
                </Button>
                {showDatePickerEditar && (
                  <DateTimePicker
                    value={selectedDateEditar}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      console.log('Data selecionada:', date);
                      if (date) {
                        const formattedDate = date.toLocaleDateString('pt-BR');
                        setSelectedDataAtendimento(formattedDate);
                        setCurrentAgendamento(prev => prev ? { ...prev, dataAtendimento: formattedDate } : prev);
                        setSelectedDateEditar(date);
                      }
                      setShowDatePickerEditar(false);
                    }}
                  />
                )}

                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedHorarioEditar}
                    onValueChange={(itemValue) => {
                      setSelectedHorarioEditar(itemValue);
                      setCurrentAgendamento(prev => prev ? { ...prev, horario: itemValue } : null);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um horário" value="" />
                    {horarios.map((horario, index) => (
                      <Picker.Item key={index} label={horario} value={horario} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedServico}
                    onValueChange={(itemValue) => {
                      setSelectedServico(itemValue);
                      setCurrentAgendamento(prev => prev ? { ...prev, fk_servico_id: Number(itemValue) } : null);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um Serviço" value="" />
                    {servicos.map((servico) => (
                      <Picker.Item key={servico.id} label={servico.tiposervico} value={String(servico.id)} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.modalFooter}>
                <Button mode="contained"
                  onPress={validateAndUpdateAgendamento}
                  style={styles.agendamentoButton}
                  contentStyle={styles.modalButtonContent}
                  labelStyle={styles.modalButtonLabel}
                >
                  Salvar Alterações
                </Button>
              </View>
            </Modal>
          </Portal>

          {/* Modal Deletar */}
          <Portal>
            <Modal visible={visible.deleteAgendamento} onDismiss={() => hideModal('deleteAgendamento')} contentContainerStyle={styles.modal}>
              <View style={styles.modalHeader}><Text style={styles.modalTitle}>Deletar Agendamento</Text></View>
              <View style={styles.modalContent}>
                <Text style={styles.deleteText}>Deseja realmente excluir este agendamento?</Text>
                {currentAgendamento && (
                  <Card style={styles.confirmationCard}>
                    <Card.Content>
                      <Text style={styles.confirmationText}>
                        {currentAgendamento.tipoServico} - {currentAgendamento.usuarioNome}
                      </Text>
                      <Text style={styles.confirmationText}>
                        {currentAgendamento.dataAtendimento} às {currentAgendamento.horario}
                      </Text>
                    </Card.Content>
                  </Card>
                )}
              </View>
              <View style={styles.modalFooter}>
                <Button mode="contained" onPress={deleteAgendamento} style={styles.deleteButton}>Confirmar Exclusão</Button>
              </View>
            </Modal>
          </Portal>
        </SafeAreaView>
      </PaperProvider>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  addButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#00BFA6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonContent: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  counterBadge: {
    backgroundColor: '#00BFA6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00BFA6',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceBadge: {
    backgroundColor: '#E8F5F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  serviceText: {
    color: '#00BFA6',
    fontSize: 12,
    fontWeight: '600',
  },
  cardId: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  userInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  valorText: {
    color: '#00BFA6',
    fontWeight: 'bold',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  actionButton: {
    margin: 0,
    marginLeft: 8,
  },
  emptyCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalHeader: {
    backgroundColor: '#00BFA6',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    padding: 24,
    maxHeight: '70%',
  },
  modalFooter: {
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  pickerContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  picker: {
    height: '100%',
    width: '100%',
  },
  agendamentoInput: {
    marginBottom: 16,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  agendamentoButton: {
    backgroundColor: '#00BFA6',
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    width: '100%',
    borderRadius: 12,
  },
  currentDataContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00BFA6',
  },
  currentDataText: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#00BFA6',
    fontSize: 16,
  },
  currentDataItem: {
    color: '#666',
    marginBottom: 4,
  },
  confirmationCard: {
    marginTop: 16,
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderRadius: 12,
  },
  confirmationText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#856404',
  },
  deleteText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  modalButtonContent: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default GerenciamentoAgendamentoUser;