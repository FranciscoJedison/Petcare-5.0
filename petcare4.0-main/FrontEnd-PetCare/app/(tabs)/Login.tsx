import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import API_URL from '../../conf/api';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userType = await AsyncStorage.getItem('userType');
        if (userType) navigation.replace('Home');
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, { email, senha });

      if (response.status === 200) {
        const { id, email: userEmail, tipoUsuario } = response.data.usuario;
        await AsyncStorage.setItem('userId', id.toString());
        await AsyncStorage.setItem('userEmail', userEmail);
        await AsyncStorage.setItem('userType', tipoUsuario.toString());
        setVisibleSnackbar(true);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }, 1000);
      } else {
        Alert.alert('Erro', response.data.error || 'E-mail ou senha inválidos!');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Falha ao conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#009A78','#F9F9F9' ,'#F9F9F9']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/petcare.png')} style={styles.image} />
          <Text style={styles.brand}>Pet Care</Text>
        </View>

        <Text style={styles.title}>Login</Text>

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          underlineColor="#00635D"
          activeUnderlineColor="#009A78"
          textColor="black"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
          underlineColor="#00635D"
          activeUnderlineColor="#009A78"
          textColor="black"
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading}
          labelStyle={{ color: 'white', fontWeight: 'bold' }}
        >
          Entrar
        </Button>

        <Text style={styles.link} onPress={() => router.push('../../RegistroUser')}>
          Criar uma conta
        </Text>
      </View>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Login bem-sucedido!
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
