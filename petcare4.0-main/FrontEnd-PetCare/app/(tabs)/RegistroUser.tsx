import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import API_URL from '../../conf/api';

type RootStackParamList = {
  Login: undefined;
};

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/usuario/inserir`, {
        nome: name,
        email,
        senha: password,
        tipoUsuario: 1,
      });

      if (response.status === 201) {
        setVisibleSnackbar(true);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }, 1000);
      } else {
        Alert.alert('Erro', response.data.error || 'Não foi possível criar a conta.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro', 'Falha ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#009A78', '#F9F9F9' , '#FFFFFF']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/petcare.png')} style={styles.image} />
          <Text style={styles.brand}>Pet Care</Text>
        </View>

        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          label="Nome"
          value={name}
          onChangeText={setName}
          style={styles.input}
          underlineColor="#00635D"
          activeUnderlineColor="#009A78"
          textColor="black"
        />

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          underlineColor="#00635D"
          activeUnderlineColor="#009A78"
          textColor="black"
        />

        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          underlineColor="#00635D"
          activeUnderlineColor="#009A78"
          textColor="black"
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          loading={loading}
          disabled={loading}
          labelStyle={{ color: 'white', fontWeight: 'bold' }}
        >
          Cadastrar
        </Button>

        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Já tem uma conta? Faça login
        </Text>
      </View>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Conta criada com sucesso!
      </Snackbar>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 30,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  brand: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00635D',
    marginTop: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#000',
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#009A78',
    borderRadius: 10,
    paddingVertical: 6,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#00635D',
    fontWeight: 'bold',
  },
});
