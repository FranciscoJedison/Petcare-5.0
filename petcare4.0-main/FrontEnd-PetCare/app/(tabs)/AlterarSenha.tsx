import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRouter } from 'expo-router';
import API_URL from '../../conf/api'; // ajuste o caminho conforme a pasta


// Tipagem correta para evitar erro do TypeScript
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AlterarSenha: undefined; // Adicionei a rota para alteração de senha
};

export default function AlterarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleChangePassword = async () => {
    if (!email || !senhaAtual || !novaSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_URL}/usuarios/alterar-senha`, {
        email,
        senhaAtual,
        novaSenha,
      });

      if (response.status === 200) {
        setVisibleSnackbar(true);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); // Redireciona para a tela inicial
        }, 1000);
      } else {
        Alert.alert('Erro', response.data.error || 'Falha ao alterar senha.');
      }
    } catch (error) {
      console.error('Erro ao alterar a senha:', error);
      Alert.alert('Erro', 'Falha ao conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.transparentBox}>
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <Image source={require('../../assets/images/petcare.png')} style={styles.image} />
        </View>
        <Text style={styles.brand}>Pet Care</Text>
      </View>

      <Text style={styles.title}>Alterar Senha</Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Senha Atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleChangePassword}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Alterar Senha
      </Button>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Senha alterada com sucesso!
      </Snackbar>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#32312F',
  },
  transparentBox: {
  width: '100%',
  backgroundColor: 'rgba(10, 10, 10, 0.4)', // fundo branco transparente
  padding: 20,
  borderRadius: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 0.1,
  borderColor: '#fff',
  borderWidth: 3,
  marginBottom: 20,
  paddingBottom: 30,
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  brand: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EBFFF8',
    fontFamily: 'serif',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#00635D',
  },
});
