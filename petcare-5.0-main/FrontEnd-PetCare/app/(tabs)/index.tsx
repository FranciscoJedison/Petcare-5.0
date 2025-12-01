import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [typingText, setTypingText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [imageAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log('AsyncStorage limpo com sucesso!');
      } catch (error) {
        console.error('Erro ao limpar o AsyncStorage:', error);
      }
    };

    // Comentado para evitar limpar dados de login toda vez:
    // clearStorage();

    const typeStrings = [
      'Cuidados completos para o seu pet',
      'Atendimento veterinário com carinho e qualidade',
      'Serviços especializados para saúde e bem-estar animal',
      'A melhor experiência para você e seu pet',
      'Tudo o que seu pet precisa em um só lugar',
      'Amor e cuidado para seu pet',
    ];

    let index = 0;
    const typeInterval = setInterval(() => {
      setTypingText(typeStrings[index]);
      index = (index + 1) % typeStrings.length;
    }, 3000);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#00BFA6', '#F9F9F9' ,'#F9F9F9', '#F9F9F9']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Imagem com animação de fade e zoom */}
        <Animated.View
          style={[
            styles.imageWrapper,
            { opacity: imageAnim, transform: [{ scale: imageAnim }] },
          ]}
        >
          <Image
            source={require('../../assets/images/petcareicon.png')}
            style={styles.image}
          />
        </Animated.View>

        {/* Texto com animação de fade */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Bem-vindo à Pet Care!</Text>
          <Text style={styles.subtitle}>
            Nós somos especialistas em
          </Text>
          <Text style={styles.typingText}>{typingText}</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100, // evita que o conteúdo fique escondido atrás do menu
  },
  imageWrapper: {
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0A6963',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
  },
  typingText: {
    color: '#00BFA6',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 8,
  },
});
