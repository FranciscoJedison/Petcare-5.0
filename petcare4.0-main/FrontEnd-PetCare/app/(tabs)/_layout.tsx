import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import LoginScreen from './Login';
import RegistroUser from './RegistroUser';
import GerenciamentoServico from '../GerenciamentoServico';
import HomeScreen from './index';
import AboutScreen from './Index/AboutScreen';
import ServiceScreen from './Index/ServiceScreen';
import PortfolioScreen from './Index/PortfolioScreen';
import TestimonialScreen from './Index/TestimonialScreen';
import BlogScreen from './Index/BlogScreen';
import ContactScreen from './Index/ContactScreen';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; 
import CadastroAtendimento from './CadastroAtendimento';
import GerenciamentoUser from '../GerenciamentoUser';
import GerenciamentoAgendamento from '../GerenciamentoAgendamento';
import GerenciamentoAgendamentoUser from '../GerenciamentoAgendamentoUser';
import Relatorio from '../Relatorio';
import AlterarSenhaScreen from './AlterarSenha';
import RedefinirSenhaScreen from './RedefinirSenha';
type ColorScheme = 'light' | 'dark';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const DrawerNavigator = createDrawerNavigator();
const TabNavigator = createBottomTabNavigator();

type IconName =
  | 'home-sharp'
  | 'information'
  | 'construct'
  | 'briefcase'
  | 'people'
  | 'file-tray'
  | 'call';

function Tabs() {
  const colorScheme = useColorScheme();

  return (
    <TabNavigator.Navigator
      initialRouteName="Home"
      screenOptions={({ route }: { route: RouteProp<any, any> }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: IconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-sharp';
              break;
            case 'Sobre nos':
              iconName = 'information';
              break;
            case 'Nossos serviços':
              iconName = 'construct';
              break;
            case 'Portfolio':
              iconName = 'briefcase';
              break;
            case 'Depoimentos':
              iconName = 'people';
              break;
            case 'Noticias sobre nossos serviços':
              iconName = 'file-tray';
              break;
            case 'Contate -me':
              iconName = 'call';
              break;
            default:
              iconName = 'home-sharp';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          headerTitleAlign: 'center',
        },
        headerBackground: () => (
        <LinearGradient
          colors={['#222222', '#222222']}
          style={styles.headerGradient}
          start={[0, 0]}
          end={[1, 0]}
        />
        ),
        tabBarStyle: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 5,
        height: 60,
        borderTopWidth: 0,
        borderTopColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        paddingBottom: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
          sceneContainerStyle: {
            backgroundColor: '#00BFA6',
          },
      })}
    >
      <TabNavigator.Screen name="Sobre nos" component={AboutScreen} options={{ title: 'Sobre Nós' }} />
      <TabNavigator.Screen name="Nossos serviços" component={ServiceScreen} options={{ title: 'Nossos Serviços' }} />
      <TabNavigator.Screen name="Home" component={HomeScreen} options={{ title: 'Página Inicial' }} />
      {/*<TabNavigator.Screen name="Portfolio" component={PortfolioScreen} options={{ title: 'Portfólio' }} />*/}
      <TabNavigator.Screen name="Depoimentos" component={TestimonialScreen} options={{ title: 'Depoimentos' }} />
      <TabNavigator.Screen name="Contate -me" component={ContactScreen} options={{ title: 'Contato' }} />
    </TabNavigator.Navigator>
    //<TabNavigator.Screen name="Noticias sobre nossos serviços" component={BlogScreen} options={{ title: 'Notícias' }} />
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme() as ColorScheme;
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const userTypeStored = await AsyncStorage.getItem('userType');
        if (userTypeStored) {
          setUserType(userTypeStored);
        }
      } catch (error) {
        console.error('Erro ao obter userType:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserType();
  }, []);

  if (loading) {
    return null;
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userType');
    setUserType(null);
  };

  return (
    <DrawerNavigator.Navigator
    screenOptions={({ navigation }) => ({
    drawerStyle: {
    backgroundColor: 'rgba(123, 175, 164, 0.5)', // preto com 60% de opacidade
    width: 240,
    borderRadius: 20,
    marginVertical: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    },
      drawerActiveTintColor: '#00BFA6',
      drawerInactiveTintColor: '#fff',
      headerTintColor: '#fff',
    headerBackground: () => (
      <LinearGradient
        colors={['#222222', '#222222']}
        style={styles.headerGradient}
        start={[0, 0]}
        end={[1, 0]}
      />
    ),
      headerLeft: () => (
        <Pressable
        onPress={() => {
          // Verifica o userType no AsyncStorage quando o botão do menu é pressionado
          AsyncStorage.getItem('userType')
            .then((userTypeStored) => {
              //console.log('userTypeStored:', userTypeStored); // Verifique o valor de userType
              setUserType(userTypeStored); // Atualiza o estado com o valor do userType
              setLoading(false); // Define o estado de loading como false
              navigation.toggleDrawer(); // Abre ou fecha o drawer
            })
            .catch((error) => {
              console.error('Erro ao obter userType:', error);
              setLoading(false); // Em caso de erro, ainda define o loading como false
            });
        }}
        style={{ marginLeft: 15 }}
      >
        <Ionicons name="menu" size={28} color={Colors[colorScheme ?? 'dark'].tint} />
        </Pressable>
      ),
    })}
  >
    <DrawerNavigator.Screen
      name="Home"
      component={Tabs}
      options={{
        title: 'Menu',
        headerTintColor: '#fff',
        headerBackground: () => (
          <LinearGradient
            colors={['#222222', '#222222']}
            style={styles.headerGradient}
            start={[0, 0]}
            end={[1, 0]}
          />
        ),
        drawerIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
      }}
    />
  
    {userType !== '0' && userType !== '1' && (
      <>
        <DrawerNavigator.Screen
          name="Login"
          options={{
            title: 'Login',
            drawerIcon: ({ color }) => <Ionicons name="log-in-outline" size={28} color={color} />,
          }}
          component={LoginScreen}
        />
        <DrawerNavigator.Screen
          name="RegistroUser"
          options={{
            title: 'Cadastro de Usuário',
            drawerIcon: ({ color }) => <Ionicons name="person-add-outline" size={28} color={color} />,
          }}
          component={RegistroUser}
        />
      </>
    )}
  
    {userType === '0' && (
      <>
        <DrawerNavigator.Screen
          name="GerenciamentoUser "
          options={{
            title: 'Gerenciamento de Usuários',
            drawerIcon: ({ color }) => <Ionicons name="people" size={28} color={color} />,
          }}
          component={GerenciamentoUser }
        />
        <DrawerNavigator.Screen
          name="GerenciamentoAgendamento"
          options={{
            title: 'Gerenciamento de Agendamento',
            drawerIcon: ({ color }) => <Ionicons name="calendar-outline" size={28} color={color} />,
          }}
          component={GerenciamentoAgendamento }
        />
        <DrawerNavigator.Screen
          name="GerenciamentoServico"
          options={{
            title: 'Gerenciamento de Serviço',
            drawerIcon: ({ color }) => <Ionicons name="construct-outline" size={28} color={color} />,
          }}
          component={GerenciamentoServico}
        />
        {/*<DrawerNavigator.Screen
          name="Relatorio"
          options={{
            title: 'Relatório',
            drawerIcon: ({ color }) => <Ionicons name="document" size={28} color={color} />,
          }}
          component={Relatorio}
        />*/}
        <DrawerNavigator.Screen
          name="AlterarSenha"
          options={{
            title: 'Alterar Senha',
            drawerIcon: ({ color }) => <Ionicons name="key-outline" size={28} color={color} />,
          }}
          component={AlterarSenhaScreen}
        />
        {/*<DrawerNavigator.Screen
          name="RedefinirSenha"
          options={{
            title: 'Redefinir Senha',
            drawerIcon: ({ color }) => <Ionicons name="lock-open-outline" size={28} color={color} />,
          }}
          component={RedefinirSenhaScreen}
        />*/}
        <DrawerNavigator.Screen
          name="Sair"
          options={{
            title: 'Sair',
            drawerIcon: ({ color }) => <Ionicons name="log-out-outline" size={28} color={color} />,
          }}
          listeners={{
            focus: () => {
              console.log('userType:', userType);
              handleLogout();
            },
          }}
          component={() => null} // Componente vazio, já que você não quer mudar de tela
        />
      </>
    )}
  
    {userType === '1' && (
      <>
        <DrawerNavigator.Screen
          name="GerenciamentoAgendamento"
          options={{
            title: 'Gerenciamento de Agendamento',
            drawerIcon: ({ color }) => <Ionicons name="calendar-outline" size={28} color={color} />,
          }}
          component={GerenciamentoAgendamentoUser }
        />
        <DrawerNavigator.Screen
          name="CadastroAtendimento"
          options={{
            title: 'Cadastro do Atendimento',
            drawerIcon: ({ color }) => <Ionicons name="person-add-outline" size={28} color={color} />,
          }}
          component={CadastroAtendimento} // Substitua pelo componente correto, caso tenha outro
        />
        <DrawerNavigator.Screen
          name="AlterarSenha"
          options={{
            title: 'Alterar Senha',
            drawerIcon: ({ color }) => <Ionicons name="key-outline" size={28} color={color} />,
          }}
          component={AlterarSenhaScreen}
        />
        {/*<DrawerNavigator.Screen
          name="RedefinirSenha"
          options={{
            title: 'Redefinir Senha',
            drawerIcon: ({ color }) => <Ionicons name="lock-open-outline" size={28} color={color} />,
          }}
          component={RedefinirSenhaScreen}
        />*/}
        <DrawerNavigator.Screen
          name="Sair"
          options={{
            title: 'Sair',
            drawerIcon: ({ color }) => <Ionicons name="log-out-outline" size={28} color={color} />,
          }}
          listeners={{
            focus: () => {
              console.log('userType:', userType);
              handleLogout();
            },
          }}
          component={() => null} // Componente vazio, já que você não quer mudar de tela
        />
      </>
    )}
  </DrawerNavigator.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    flex: 1,
  },
  headerBorder: {
    flex: 1,
  }
});