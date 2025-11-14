import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import API_URL from '../../conf/api';

// Tipagem correta para evitar erro do TypeScript
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  RedefinirSenha: undefined;
};

export default function RedefinirSenhaScreen() {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const router = useRouter();

  const handleChangePassword = async () => {
    if (!email || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_URL}/usuarios/redefinir-senha`, {
        email,
        novaSenha,
        confirmarSenha,
      });

      if (response.status === 200) {
        setVisibleSnackbar(true);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }, 1000);
      } else {
        Alert.alert('Erro', response.data.error || 'Falha ao redefinir senha.');
      }
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
      Alert.alert('Erro', 'Falha ao conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#009A78', '#F9F9F9', '#FFFFFF']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/petcare.png')} style={styles.image} />
          <Text style={styles.brand}>Pet Care</Text>
        </View>

        <Text style={styles.title}>Redefinir Senha</Text>

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          underlineColor="#00635D"
          activeUnderlineColor="#009A78"
          textColor="black"
        />

        <TextInput
          label="Nova Senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
          style={styles.input}
          underlineColor="#00635D"
          activeUnderlineColor="#009A78"
          textColor="black"
        />

        <TextInput
          label="Confirmar Nova Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          style={styles.input}
          underlineColor="#00635D"
          activeUnderlineColor="#009A78"
          textColor="black"
        />

        <Button
          mode="contained"
          onPress={handleChangePassword}
          style={styles.button}
          loading={loading}
          disabled={loading}
          labelStyle={{ color: 'white', fontWeight: 'bold' }}
        >
          Redefinir Senha
        </Button>

        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Lembrou sua senha? Faça login
        </Text>
      </View>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Senha redefinida com sucesso!
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