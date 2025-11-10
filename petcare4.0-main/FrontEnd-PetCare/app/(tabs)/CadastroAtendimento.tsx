import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet, Image, View, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import API_URL from '../../conf/api';

const horarios = ['08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00'];

type RootStackParamList = {
  Home: undefined;
  GerenciamentoAgendamentoUser: undefined;
};

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

const CadastroAtendimento = () => {
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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

  useEffect(() => {
    const now = new Date();
    const options = { timeZone: 'America/Sao_Paulo' };
    const localDate = now.toLocaleString('sv-SE', options);
    const utcDate = new Date(localDate + 'Z');
    setNewAgendamento(prev => ({ ...prev, dthoraAgendamento: utcDate.toISOString() }));
  }, []);

  const fetchAgendamentos = async () => {
    try {
      const userEmailStored = await AsyncStorage.getItem('userEmail');
      if (!userEmailStored) return;

      const response = await axios.get(`${API_URL}/agendamentosUser`, {
        params: { email: userEmailStored },
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
        valor: item.valor,
      }));

      setAgendamentos(agendamentosData);
    } catch (error: any) {
      console.error('Erro ao buscar agendamentos:', error.message || error);
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicos`);
      setServicos(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar serviços:', error.message || error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsuarios(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error.message || error);
    }
  };

  const addAgendamento = async () => {
    if (!newAgendamento.dataAtendimento || !newAgendamento.horario || newAgendamento.fk_servico_id <= 0) {
      Alert.alert("Campos Obrigatórios", "Preencha todos os campos obrigatórios.", [{ text: "OK" }]);
      return;
    }

    await fetchAgendamentos();
    const [day1, month1, year1] = newAgendamento.dataAtendimento.split('/');
    const formattedDataAtendimento1 = `${year1}-${month1}-${day1}`;

    const horarioIndisponivel = agendamentos.some(agendamento =>
      agendamento.dataAtendimento === formattedDataAtendimento1 &&
      agendamento.horario === newAgendamento.horario
    );

    if (horarioIndisponivel) {
      const horariosIndisponiveis = agendamentos
        .filter(agendamento => agendamento.dataAtendimento === formattedDataAtendimento1)
        .map(agendamento => agendamento.horario);

      const horariosDisponiveis = horarios.filter(horario => !horariosIndisponiveis.includes(horario));

      Alert.alert(
        "Horário Indisponível",
        horariosDisponiveis.length > 0
          ? `Horários disponíveis para a data ${newAgendamento.dataAtendimento}: ${horariosDisponiveis.join(', ')}`
          : `Não há horários disponíveis para a data ${newAgendamento.dataAtendimento}.`,
        [{ text: "OK" }]
      );
      return;
    }

    const [day, month, year] = newAgendamento.dataAtendimento.split('/');
    const formattedDataAtendimento = `${year}-${month}-${day}`;
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    const novoAgendamento: AgendamentoInsercao = {
      dataAtendimento: formattedDataAtendimento,
      dthoraAgendamento: new Date().toISOString(),
      horario: newAgendamento.horario,
      fk_usuario_id: Number(userId),
      fk_servico_id: newAgendamento.fk_servico_id,
    };

    try {
      await axios.post(`${API_URL}/agendamento/inserir`, novoAgendamento);
      setNewAgendamento({ dataAtendimento: '', dthoraAgendamento: '', horario: '', fk_usuario_id: 0, fk_servico_id: 0 });
      setSelectedServico('');
      setSelectedUsuario('');
      fetchAgendamentos();
      Alert.alert("Sucesso", "Agendamento adicionado com sucesso!", [{ text: "OK" }]);
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
    }
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
      await fetchAgendamentos();
      await fetchServicos();
      await fetchUsuarios();
    };
    fetchData();
  }, []);

  return (
    <PaperProvider>
      <LinearGradient colors={['#0f0f0f', '#424242']} style={styles.gradientBackground}>
        <SafeAreaView style={styles.safeArea}>

          <Image source={require('../../assets/images/petcare.png')} style={styles.image} />

          <View style={styles.container}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Agendamento</Text>
            </View>

            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.datePickerButton,
                  newAgendamento.dataAtendimento ? { borderColor: '#00635D', borderWidth: 2 } : {}
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.datePickerText}>
                  {newAgendamento.dataAtendimento || 'Selecionar Data de Atendimento'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => onChangeDate(event, date, false)}
                />
              )}


              <View style={[
                styles.pickerContainer,
                newAgendamento.horario ? { borderColor: '#00635D', borderWidth: 2 } : {}
              ]}>
                <Picker
                  selectedValue={newAgendamento.horario}
                  onValueChange={(itemValue) =>
                    setNewAgendamento(prev => ({ ...prev, horario: itemValue }))
                  }
                  style={styles.picker}
                  dropdownIconColor="#00635D"
                >
                  <Picker.Item label="Selecione um horário" value="" />
                  {horarios.map((horario, index) => (
                    <Picker.Item key={index} label={horario} value={horario} />
                  ))}
                </Picker>
              </View>

              <View style={[
                styles.pickerContainer,
                selectedServico ? { borderColor: '#00635D', borderWidth: 2 } : {}
              ]}>
                <Picker
                  selectedValue={selectedServico}
                  onValueChange={(itemValue) => {
                    setSelectedServico(itemValue);
                    setNewAgendamento(prev => ({ ...prev, fk_servico_id: Number(itemValue) }));
                  }}
                  style={styles.picker}
                  dropdownIconColor="#00635D"
                >
                  <Picker.Item label="Selecione um Serviço" value="" />
                  {servicos.map(servico => (
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
                buttonColor="#00635D"
                contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
                labelStyle={{ marginLeft: 12 }}
              >
                <Text>Adicionar Agendamento</Text>
              </Button>
            </View>

            <Text style={styles.link} onPress={() => navigation.navigate('Home')}>Página Inicial</Text>
            <Text style={styles.link} onPress={() => navigation.navigate('GerenciamentoAgendamentoUser')}>Gerenciamento de Agendamentos</Text>
          </View>

        </SafeAreaView>
      </LinearGradient>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 10,
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
  agendamentoInput: {
    marginBottom: 10,
  },
  pickerContainer: {
    height: 53,
    borderWidth: 1.5,
    borderColor: '#00635D',
    borderRadius: 8,
    backgroundColor: '#fff6f0',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },

  picker: {
    height: '100%',
    width: '100%',
    color: '#5a3e2b', // cor do texto dentro do picker
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 50,
    alignSelf: 'center',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#00635D',
    fontWeight: 'bold',
  },
  datePickerButton: {
    height: 53,
    borderWidth: 1.5,
    borderColor: '#A67B5B',
    borderRadius: 8,
    backgroundColor: '#fff6f0',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // para Android
  },
  
  datePickerText: {
    color: '#5a3e2b',
    fontSize: 16,
  },
});

export default CadastroAtendimento;
