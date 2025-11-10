import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, DataTable, Modal, TextInput, Portal, IconButton, Button, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet, ScrollView, Image, View, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState, useLayoutEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import API_URL from '../conf/api';

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
  const [showDatePickerEditar, setShowDatePickerEditar] = useState(false); // Para o modal de edição
  const [selectedHorarioEditar, setSelectedHorarioEditar] = useState('');
  const [searchQuery, setSearchQuery] = React.useState(''); // Estado para armazenar a pesquisa

  // Filtra os usuários com base na pesquisa
  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const query = searchQuery.toLowerCase();
    return (
      agendamento.dataAtendimento.toLowerCase().includes(query) ||
      agendamento.usuarioNome?.toLowerCase().includes(query) || // Verifica se usuarioNome existe e faz a comparação
      agendamento.tipoServico?.toLowerCase().includes(query) || // Adiciona pesquisa pelo tipoServico
      agendamento.usuarioEmail?.toLowerCase().includes(query) || // Adiciona pesquisa pelo usuarioEmail
      agendamento.valor?.toString().includes(query) // Converte valor para string para comparação
    );
  });
  const [userType, setUserType] = useState<string | null>(null); // Estado do tipo de usuário
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento

  useEffect(() => {
    navigation.setOptions({ title: 'Lista de Agendamentos' });
  }, []);
  useEffect(() => {
    const now = new Date();
    const options = { timeZone: 'America/Sao_Paulo' };
    const localDate = now.toLocaleString('sv-SE', options);
    const utcDate = new Date(localDate + 'Z');
    setNewAgendamento(prev => ({ ...prev, dthoraAgendamento: utcDate.toISOString() }));
  }, []);

  const fetchAgendamentos = async () => {
    try {
      // Recupera o e-mail armazenado no AsyncStorage
      const userEmailStored = await AsyncStorage.getItem('userEmail');

      // Verifica se o e-mail foi recuperado corretamente
      if (!userEmailStored) {
        console.error('E-mail não encontrado no AsyncStorage.');
        return;
      }

      // Faz a requisição para o novo endpoint com o e-mail na query string
      const response = await axios.get(`${API_URL}/agendamentosUser`, {
        params: {
          email: userEmailStored  // Passando o e-mail como parâmetro na URL
        }
      });

      // Mapeia os dados da resposta
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
        valor: item.valor,
      }));

      // Atualiza o estado com os dados dos agendamentos
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
        "Por favor, preencha todos os campos obrigatórios: data de atendimento, horário, usuário e serviço.",
        [{ text: "OK" }]
      );
      return; // Interrompe a execução da função se a validação falhar
    }

    await fetchAgendamentos();

    const [day1, month1, year1] = newAgendamento.dataAtendimento.split('/');
    const formattedDataAtendimento1 = `${year1}-${month1}-${day1}`;

    const horarioIndisponivel = agendamentos.some(agendamento => {
      if (!agendamento.dataAtendimento) {
        console.warn('dataAtendimento está indefinido para um dos agendamentos:', agendamento);
        return false; // Ignora este agendamento
      }
      return agendamento.dataAtendimento === formattedDataAtendimento1 &&
        agendamento.horario === newAgendamento.horario;
    });

    if (horarioIndisponivel) {
      const horariosIndisponiveis = agendamentos
        .filter(agendamento => agendamento.dataAtendimento === formattedDataAtendimento1)
        .map(agendamento => agendamento.horario);

      const horariosDisponiveis = horarios.filter(horario => !horariosIndisponiveis.includes(horario));

      if (horariosDisponiveis.length > 0) {
        Alert.alert(
          "Horário Indisponível",
          `Este horário e data de atendimento já estão ocupados. Horários disponíveis para a data ${newAgendamento.dataAtendimento}: ${horariosDisponiveis.join(', ')}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Horário Indisponível",
          `Este horário e data de atendimento já estão ocupados. Não há horários disponíveis para a data ${newAgendamento.dataAtendimento}.`,
          [{ text: "OK" }]
        );
      }
      return;
    }

    const [day, month, year] = newAgendamento.dataAtendimento.split('/');
    const formattedDataAtendimento = `${year}-${month}-${day}`;

    const userId = await AsyncStorage.getItem('userId');

    // Verifique se o userId não é null e converta para número
    if (userId === null) {
      console.error('userId não encontrado no AsyncStorage');
      return;  // Ou trate o erro de forma adequada
    }

    // Converta o userId para número
    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      console.error('userId não é um número válido');
      return;  // Ou trate o erro de forma adequada
    }

    // Agora, crie o objeto novoAgendamento com o userId convertido
    const novoAgendamento: AgendamentoInsercao = {
      dataAtendimento: formattedDataAtendimento,
      dthoraAgendamento: new Date().toISOString(),
      horario: newAgendamento.horario,
      fk_usuario_id: userIdNumber,  // Agora passa o userId convertido para número
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
      setSelectedServico(''); // Resetando o estado selectedServico
      setSelectedUsuario(''); // Resetando o estado selectedUsuario
      hideModal('addAgendamento');
      fetchAgendamentos();

      Alert.alert(
        "Agendamento Adicionado",
        "O agendamento foi adicionado com sucesso!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
    }
  };

  const validateAndUpdateAgendamento = () => {
    // Verifica se currentAgendamento não é nulo
    if (!currentAgendamento) {
      Alert.alert("Erro", "Agendamento não encontrado.");
      return;
    }

    // Verifica se os campos obrigatórios estão preenchidos
    if (!selectedDataAtendimento || !selectedHorarioEditar || !selectedServico) {
      Alert.alert(
        "Campos Obrigatórios",
        "Por favor, preencha todos os campos obrigatórios: data de atendimento, horário, usuário e serviço.",
        [{ text: "OK" }]
      );
      return; // Interrompe a execução da função se a validação falhar
    }

    // Verifica se já existe um agendamento com a mesma data e horário
    const agendamentoExistente = agendamentos.find(agendamento =>
      agendamento.dataAtendimento === selectedDataAtendimento &&
      agendamento.horario === selectedHorarioEditar
    );

    if (agendamentoExistente) {
      // Se o horário já estiver ocupado, verifica os horários disponíveis
      const horariosIndisponiveis = agendamentos
        .filter(agendamento => agendamento.dataAtendimento === selectedDataAtendimento)
        .map(agendamento => agendamento.horario);

      const horariosDisponiveis = horarios.filter(horario => !horariosIndisponiveis.includes(horario));

      if (horariosDisponiveis.length > 0) {
        Alert.alert(
          "Horário Indisponível",
          `Este horário e data de atendimento já estão ocupados. Horários disponíveis para a data ${selectedDataAtendimento}: ${horariosDisponiveis.join(', ')}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Horário Indisponível",
          `Este horário e data de atendimento já estão ocupados. Não há horários disponíveis para a data ${selectedDataAtendimento}.`,
          [{ text: "OK" }]
        );
      }
      return; // Interrompe a execução da função se já existir um agendamento
    }

    // Se todas as validações passarem, chama a função de atualização
    updateAgendamento();
  };

  const updateAgendamento = async () => {
    if (currentAgendamento?.id) {
      console.log('Dados a serem enviados:', currentAgendamento); // Adiciona o log para verificar os dados

      // Recupera o userId do AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      // Verifica se o userId foi encontrado e converte para número
      if (!userId) {
        console.error('userId não encontrado no AsyncStorage');
        Alert.alert('Erro', 'userId não encontrado. Faça login novamente.');
        return; // Impede a atualização se o userId não for encontrado
      }

      const userIdNumber = Number(userId);

      if (isNaN(userIdNumber)) {
        console.error('userId não é um número válido');
        Alert.alert('Erro', 'O userId é inválido. Tente novamente.');
        return; // Impede a atualização se o userId for inválido
      }

      // Agora, cria o objeto com os dados do agendamento atualizado
      const agendamentoAtualizado = {
        dataatendimento: currentAgendamento.dataAtendimento, // Certifique-se de que isso está no formato correto
        dthoraAgendamento: currentAgendamento.dthoraAgendamento,
        horario: currentAgendamento.horario,
        fk_usuario_id: userIdNumber, // Aqui inserimos o userId recuperado
        fk_servico_id: currentAgendamento.fk_servico_id,
      };

      try {
        // Envia a requisição de atualização para o backend
        const response = await axios.put(`${API_URL}/agendamento/atualizar/${currentAgendamento.id}`, agendamentoAtualizado);
        console.log('Resposta do servidor:', response.data); // Verifica a resposta do servidor

        // Limpa o estado e fecha o modal após a atualização
        setCurrentAgendamento(null);
        hideModal('editAgendamento');
        fetchAgendamentos(); // Atualiza a lista de agendamentos

        // Exibe um alerta de sucesso
        Alert.alert(
          "Agendamento Atualizado",
          "O agendamento foi atualizado com sucesso!",
          [{ text: "OK" }]
        );
      } catch (error) {
        // Trata o erro
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
        } else {
          console.error('Erro desconhecido ao deletar agendamento:', error);
        }
      }
    }
  };

  const showModal = (type: 'addAgendamento' | 'editAgendamento' | 'deleteAgendamento') => {
    if (type === 'editAgendamento' && currentAgendamento) {
      const dateParts = currentAgendamento.dataAtendimento.split('/');
      const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      // Limpar os valores de data e horário para garantir que o modal comece vazio
      setSelectedDataAtendimento('');
      setSelectedHorarioEditar('');
      setSelectedUsuario('');
      setSelectedServico('');
    }
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addAgendamento' | 'editAgendamento' | 'deleteAgendamento') => {
    setVisible({ ...visible, [type]: false });
  };

  const onChangeDate = (event: any, date?: Date, isEditMode: boolean = false) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
      if (isEditMode) {
        setSelectedDataAtendimento(formattedDate); // Atualiza o estado da data selecionada para o modal de edição
        setCurrentAgendamento(prev => prev ? { ...prev, dataAtendimento: formattedDate } : null); // Atualiza o campo dataAtendimento no modo de edição
      } else {
        setNewAgendamento(prev => ({ ...prev, dataAtendimento: formattedDate })); // Atualiza o campo dataAtendimento no modo de inserção
      }
    }
    setShowDatePicker(false); // Fecha o DateTimePicker
  };

  useEffect(() => {
    const fetchData = async () => {
      // Certifique-se de que o userType está disponível antes de chamar fetchAgendamentos
      const storedUserType = await AsyncStorage.getItem('userType');
      const userTypeNumber = storedUserType ? Number(storedUserType) : null; // Converte para number ou null

      fetchAgendamentos(); // Passa o userType como argumento
      fetchServicos();
      fetchUsuarios(); // Chama a função para buscar usuários
    };

    fetchData();
  }, []);

  return (

    <LinearGradient colors={['#0f0f0f', '#424242']} style={styles.gradientBackground}>
      <PaperProvider>
        <SafeAreaView style={styles.container}>

          <Image source={require('../assets/images/petcare.png')} style={styles.image} />

          {/* Campo de pesquisa
          <Button
            icon="plus"
            mode="contained"
            onPress={() => showModal('addAgendamento')}
            textColor="white"
            buttonColor="#00635D"
            contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
            labelStyle={{ marginLeft: 13 }}
          >
            Adicionar Agendamento
          </Button>*/}

          <TextInput
            label="Pesquisar"
            mode="outlined"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
            style={styles.searchInput}
          />

          {/* Título da Tabela com fundo e borda */}
          <View style={styles.titleContainer}>
            <Text style={styles.tableTitle}>Lista de Agendamentos</Text>
          </View>

          <ScrollView horizontal style={styles.scrollContainer}>
            <ScrollView style={styles.verticalScroll}>
              <DataTable style={styles.dataTable}>
                {/* Cabeçalho */}
                <DataTable.Header style={styles.tableHeader}>
                  <DataTable.Title style={styles.columnHeader}><Text style={styles.columnHeaderText}>Data de Agendamento</Text></DataTable.Title>
                  {/*<DataTable.Title style={styles.columnHeader}><Text style={styles.columnHeaderText}>Data de Atendimento</Text></DataTable.Title>*/}
                  <DataTable.Title style={styles.columnHeader}><Text style={styles.columnHeaderText}>Horário</Text></DataTable.Title>
                  <DataTable.Title style={styles.columnHeader}><Text style={styles.columnHeaderText}>Serviço</Text></DataTable.Title>
                  {/*<DataTable.Title style={styles.columnHeader}><Text style={styles.columnHeaderText}>Usuário</Text></DataTable.Title>
                  <DataTable.Title style={styles.columnHeader}><Text style={styles.columnHeaderText}>ID do Usuário</Text></DataTable.Title>
                  <DataTable.Title style={styles.columnHeader}><Text style={styles.columnHeaderText}>ID do Serviço</Text></DataTable.Title>*/}
                  <DataTable.Title style={styles.columnHeader}><Text style={styles.columnHeaderText}>Ações</Text></DataTable.Title>
                </DataTable.Header>

                {/* Linhas da Tabela */}
                {filteredAgendamentos.length > 0 ? (
                  filteredAgendamentos.map((agendamento, index) => (
                    <DataTable.Row
                      key={agendamento.id}
                      style={[
                        index % 2 === 0
                          ? styles.zebraRowEven
                          : styles.zebraRowOdd
                      ]}
                    >
                      <DataTable.Cell style={styles.columnCell}><Text style={styles.columnHeaderText}>{agendamento.dataAtendimento}</Text></DataTable.Cell>
                      {/*<DataTable.Cell style={styles.columnCell}><Text style={styles.columnHeaderText}>{agendamento.dthoraAgendamento}</Text></DataTable.Cell>*/}
                      <DataTable.Cell style={styles.columnCell}><Text style={styles.columnHeaderText}>{agendamento.horario}</Text></DataTable.Cell>
                      <DataTable.Cell style={styles.columnCell}><Text style={styles.columnHeaderText}>{agendamento.tipoServico}</Text></DataTable.Cell>
                      {/*<DataTable.Cell style={styles.columnCell}><Text style={styles.columnHeaderText}>{agendamento.usuarioNome}</Text></DataTable.Cell>
                      <DataTable.Cell style={styles.columnCell}><Text style={styles.columnHeaderText}>{agendamento.usuario_id}</Text></DataTable.Cell>
                      <DataTable.Cell style={styles.columnCell}><Text style={styles.columnHeaderText}>{agendamento.servico_id}</Text></DataTable.Cell>*/}
                      <DataTable.Cell style={styles.columnCell}>
                        <IconButton
                          icon="pencil"
                          size={20}
                          onPress={() => {
                            setCurrentAgendamento(agendamento);
                            showModal('editAgendamento');
                          }}
                          iconColor="blue"
                        />
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => {
                            setCurrentAgendamento(agendamento);
                            showModal('deleteAgendamento');
                          }}
                          iconColor="red"
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))
                ) : (
                  <DataTable.Row>
                    <DataTable.Cell><Text style={styles.columnHeaderText}>Nenhum agendamento encontrado</Text></DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable>
            </ScrollView>
          </ScrollView>

          {/* Contador abaixo da tabela */}
          <Text style={styles.counterText}>
            Total de Agendamentos: {Array.isArray(filteredAgendamentos) ? filteredAgendamentos.length : 0}
          </Text>

          {/* Modal Adicionar */}
          <Portal>
            <Modal
              visible={visible.addAgendamento}
              onDismiss={() => hideModal('addAgendamento')}
              contentContainerStyle={styles.modal}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Agendamento</Text>
              </View>

              <View style={styles.modalContent}>
                {/* Campo de Data estilizado */}
                <View style={styles.agendamentoDateButtonWrapper}>
                  <Button
                    mode="text"
                    onPress={() => setShowDatePicker(true)}
                    contentStyle={{ justifyContent: 'flex-start' }}
                    labelStyle={{ color: 'black', fontSize: 16 }}
                    style={{ paddingHorizontal: 10 }}
                  >
                    {newAgendamento.dataAtendimento || 'Selecionar Data de Atendimento'}
                  </Button>
                </View>

                {/* Date Picker */}
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => onChangeDate(event, date, false)}
                  />
                )}

                {/* Picker de Horário */}
                <View style={styles.agendamentoPickerWrapper}>
                  <Picker
                    selectedValue={newAgendamento.horario}
                    onValueChange={(itemValue) =>
                      setNewAgendamento((prev) => ({ ...prev, horario: itemValue }))
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um horário" value="" />
                    {horarios.map((horario, index) => (
                      <Picker.Item key={index} label={horario} value={horario} />
                    ))}
                  </Picker>
                </View>

                {/* Picker de Serviço */}
                <View style={styles.agendamentoPickerWrapper}>
                  <Picker
                    selectedValue={selectedServico}
                    onValueChange={(itemValue) => {
                      setSelectedServico(itemValue);
                      setNewAgendamento((prev) => ({
                        ...prev,
                        fk_servico_id: Number(itemValue),
                      }));
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um Serviço" value="" />
                    {servicos.map((servico) => (
                      <Picker.Item
                        key={servico.id}
                        label={servico.tiposervico}
                        value={servico.id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <Button
                  mode="contained"
                  onPress={addAgendamento}
                  textColor="white"
                  buttonColor="#00635D"
                  contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
                  labelStyle={{ marginLeft: 12 }}
                >
                  Adicionar Agendamento
                </Button>
              </View>
            </Modal>
          </Portal>
          
          {/* Modal Editar */}
          <Portal>
            <Modal
              visible={visible.editAgendamento}
              onDismiss={() => hideModal('editAgendamento')}
              contentContainerStyle={styles.modal}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Agendamento</Text>
              </View>

              <View style={styles.modalContent}>
                {/* Exibir dados correntes do agendamento */}
                {currentAgendamento && (
                  <View style={styles.currentDataContainer}>
                    <Text>Data de Atendimento: {currentAgendamento.dataAtendimento}</Text>
                    <Text>Horário: {currentAgendamento.horario}</Text>
                    <Text>Usuário: {currentAgendamento.usuarioNome}</Text>
                    <Text>Serviço: {currentAgendamento.tipoServico}</Text>
                  </View>
                )}

                {/* Campo de Data estilizado */}
                <View style={styles.agendamentoDateButtonWrapper}>
                  <Button
                    mode="text"
                    onPress={() => setShowDatePickerEditar(true)}
                    contentStyle={{ justifyContent: 'flex-start' }}
                    labelStyle={{ color: 'black', fontSize: 16 }}
                    style={{ paddingHorizontal: 10 }}
                  >
                    {selectedDataAtendimento || 'Selecionar Data de Atendimento'}
                  </Button>
                </View>

                {showDatePickerEditar && (
                  <DateTimePicker
                    value={selectedDateEditar}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      console.log('Data selecionada:', date);
                      if (date) {
                        const formattedDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                        setSelectedDataAtendimento(formattedDate);
                        setCurrentAgendamento(prev =>
                          prev ? { ...prev, dataAtendimento: formattedDate } : prev
                        );
                        setSelectedDateEditar(date);
                      }
                      setShowDatePickerEditar(false);
                    }}
                  />
                )}

                {/* Picker de Horário */}
                <View style={styles.agendamentoPickerWrapper}>
                  <Picker
                    selectedValue={selectedHorarioEditar}
                    onValueChange={(itemValue) => {
                      setSelectedHorarioEditar(itemValue);
                      setCurrentAgendamento(prev =>
                        prev ? { ...prev, horario: itemValue } : null
                      );
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um horário" value="" />
                    {horarios.map((horario, index) => (
                      <Picker.Item key={index} label={horario} value={horario} />
                    ))}
                  </Picker>
                </View>

                {/* Picker de Serviço */}
                <View style={styles.agendamentoPickerWrapper}>
                  <Picker
                    selectedValue={selectedServico}
                    onValueChange={(itemValue) => {
                      setSelectedServico(itemValue);
                      setCurrentAgendamento(prev =>
                        prev ? { ...prev, fk_servico_id: Number(itemValue) } : null
                      );
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione um Serviço" value="" />
                    {servicos.map((servico) => (
                      <Picker.Item
                        key={servico.id}
                        label={servico.tiposervico}
                        value={String(servico.id)}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <Button
                  mode="contained"
                  onPress={validateAndUpdateAgendamento}
                  style={styles.agendamentoButton}
                  textColor="white"
                  buttonColor="#00635D"
                >
                  Salvar
                </Button>
              </View>
            </Modal>
          </Portal>

          {/* Modal Deletar */}
          <Portal>
            <Modal visible={visible.deleteAgendamento} onDismiss={() => hideModal('deleteAgendamento')} contentContainerStyle={styles.modal}>
              <View style={styles.modalHeader}><Text style={styles.modalTitle}>Deletar Agendamento</Text></View>
              <View style={styles.modalContent}><Text>Deseja realmente excluir este agendamento?</Text></View>
              <View style={styles.modalFooter}>
                <Button mode="contained" onPress={deleteAgendamento} style={styles.deleteButton}>Deletar</Button>
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
  tableHeader: {
    backgroundColor: '#00635D', // cor de fundo verde
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  zebraRowEven: {
    backgroundColor: '#0bb0a6',
  },
  zebraRowOdd: {
    backgroundColor: '#00635D',
  },
  dataTable: {
    minWidth: 600,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 2, // Sombra leve
  },
  columnHeader: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  columnCell: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
  },
  columnHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },

  agendamentoDateButtonWrapper: {
    height: 53,
    borderWidth: 1,
    borderColor: '#dc8051',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  agendamentoPickerWrapper: {
    height: 53,
    borderWidth: 1,
    borderColor: '#dc8051',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  currentDataContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f2f2f2', // Cor de fundo leve
    borderRadius: 5,
  },

  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 50,
    alignSelf: 'center',
  },

  scrollContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
  verticalScroll: {
    maxHeight: 400,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
    alignSelf: 'center',
  },
  modalHeader: {
    backgroundColor: '#444',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    marginBottom: 20,
  },
  modalFooter: {
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },

  input: {
    marginBottom: 10,
  },
  addTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white'
  },
  addButton: {
    marginTop: 20,
  },
  containerpicker: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc', // Cor da borda
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff', // Cor de fundo do Picker
    paddingHorizontal: 10, // Espaçamento interno
  },
  inputpicker: {
    marginBottom: 15, // Adiciona espaço abaixo de cada campo
  },
  agendamentoContainer: {
    padding: 8, // Diminui o padding do contêiner principal
  },
  agendamentoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#A67B5B'
  },
  agendamentoFormContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10, // Diminui o padding do quadro
    backgroundColor: '#f2dfb1', // Cor de fundo marrom claro
  },
  agendamentoInput: {
    marginBottom: 10, // Diminui o espaço entre os campos
  },
  agendamentoPicker: {
    marginBottom: 10, // Diminui o espaço entre os campos
  },
  agendamentoButton: {
    backgroundColor: '#A67B5B', // Cor marrom (ou o tom que preferir)
  },
  deleteButton: {
    backgroundColor: '#e74c3c',  // Cor vermelha para o botão de deletar
    width: '100%',
  },
  titleContainer: {
    backgroundColor: '#00635D', // Cor de fundo do título
    borderWidth: 1, // Largura da borda
    borderColor: '#fff', // Cor da borda
    borderRadius: 5, // Bordas arredondadas
    padding: 8, // Espaçamento interno
    marginBottom: 10, // Espaçamento abaixo do título
  },
  tableTitle: {
    fontSize: 15, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
    color: 'white', // Cor do texto
    textAlign: 'center', // Centraliza o texto
  },
  searchInput: {
    marginVertical: 10, // Espaçamento vertical para o campo de pesquisa
    //borderWidth: 1, // Largura da borda
    //borderColor: '#ccc', // Cor da borda padrão
    //borderRadius: 50, // Bordas arredondadas
    padding: 10, // Espaçamento interno
    backgroundColor: '#fff', // Cor de fundo
    elevation: 2, // Sombra para dar um efeito de elevação
    height: 20, // Defina a altura desejada
  },
  counterText: {
    marginTop: 10, // Espaçamento acima do contador
    fontSize: 16, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
    textAlign: 'left', // Centraliza o texto
    color: 'white',
  },
});

export default GerenciamentoAgendamentoUser;