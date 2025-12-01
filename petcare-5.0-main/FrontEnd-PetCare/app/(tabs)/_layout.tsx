import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
import { useFonts } from 'expo-font';

const DrawerNavigator = createDrawerNavigator();
const TabNavigator = createBottomTabNavigator();


function Tabs() {
  const colorScheme = useColorScheme();

  return (
    <TabNavigator.Navigator
      initialRouteName="Home"
      screenOptions={({ route }: { route: RouteProp<any, any> }) => ({
        tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => {
          let iconName: string;
          const iconSize = focused ? 26 : 22;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Sobre nos':
              iconName = 'information-circle';
              break;
            case 'Nossos serviços':
              iconName = 'paw';
              break;
            case 'Portfolio':
              iconName = 'images';
              break;
            case 'Depoimentos':
              iconName = 'chatbubble-ellipses';
              break;
            case 'Noticias sobre nossos serviços':
              iconName = 'newspaper';
              break;
            case 'Contate -me':
              iconName = 'mail';
              break;
            default:
              iconName = 'home';
          }

          return <Ionicons name={iconName as any} size={iconSize} color={color} />;
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerBackground: () => (
          <LinearGradient
            colors={['#009A78', '#00635D']}
            style={styles.headerGradient}
            start={[0, 0]}
            end={[1, 0]}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 25,
          marginHorizontal: 15,
          marginBottom: 10,
          height: 65,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(0, 154, 120, 0.2)',
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 15,
          shadowColor: '#009A78',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarActiveTintColor: '#009A78',
        tabBarInactiveTintColor: '#666',
        sceneContainerStyle: {
          backgroundColor: '#F9F9F9',
        },
      })}
    >
      <TabNavigator.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Página Inicial',
          headerTitleAlign: 'center',
          tabBarLabel: 'Início'
        }} 
      />
      <TabNavigator.Screen 
        name="Sobre nos" 
        component={AboutScreen} 
        options={{ 
          title: 'Sobre Nós',
          headerTitleAlign: 'center',
          tabBarLabel: 'Sobre'
        }} 
      />
      <TabNavigator.Screen 
        name="Nossos serviços" 
        component={ServiceScreen} 
        options={{ 
          title: 'Nossos Serviços',
          headerTitleAlign: 'center',
          tabBarLabel: 'Serviços'
        }} 
      />
      <TabNavigator.Screen 
        name="Depoimentos" 
        component={TestimonialScreen} 
        options={{ 
          title: 'Depoimentos',
          headerTitleAlign: 'center',
          tabBarLabel: 'Depoimentos'
        }} 
      />
      <TabNavigator.Screen 
        name="Contate -me" 
        component={ContactScreen} 
        options={{ 
          title: 'Contato',
          headerTitleAlign: 'center',
          tabBarLabel: 'Contato'
        }} 
      />
    </TabNavigator.Navigator>
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
    await AsyncStorage.removeItem('userEmail');
    setUserType(null);
  };

  return (
    <DrawerNavigator.Navigator
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          width: 480,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          borderRightWidth: 1,
          borderRightColor: 'rgba(0, 154, 120, 0.1)',
        },
        drawerActiveTintColor: '#009A78',
        drawerInactiveTintColor: '#333',
        drawerActiveBackgroundColor: 'rgba(0, 154, 120, 0.1)',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -15,
        },
        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: 10,
          marginVertical: 4,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerBackground: () => (
          <LinearGradient
            colors={['#009A78', '#00635D']}
            style={styles.headerGradient}
            start={[0, 0]}
            end={[1, 0]}
          />
        ),
        headerLeft: () => (
          <Pressable
            onPress={() => {
              AsyncStorage.getItem('userType')
                .then((userTypeStored) => {
                  setUserType(userTypeStored);
                  setLoading(false);
                  navigation.toggleDrawer();
                })
                .catch((error) => {
                  console.error('Erro ao obter userType:', error);
                  setLoading(false);
                });
            }}
            style={{ marginLeft: 15, padding: 8 }}
          >
            <Ionicons name="menu" size={28} color="#fff" />
          </Pressable>
        ),
      })}
    >
      <DrawerNavigator.Screen
        name="Home"
        component={Tabs}
        options={{
          title: 'Menu Principal',
          headerTitle: 'PetCare',
          headerTitleAlign: 'center',
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
  
      {userType !== '0' && userType !== '1' && (
        <>
          <DrawerNavigator.Screen
            name="Login"
            options={{
              title: 'Entrar',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="login" size={24} color={color} />
              ),
            }}
            component={LoginScreen}
          />
          <DrawerNavigator.Screen
            name="RegistroUser"
            options={{
              title: 'Cadastrar',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="account-plus" size={24} color={color} />
              ),
            }}
            component={RegistroUser}
          />
        </>
      )}
  
      {userType === '0' && (
        <>
          <DrawerNavigator.Screen
            name="GerenciamentoUser"
            options={{
              title: 'Gerenciar Usuários',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontSize: 20,
                fontFamily: 'Cakecafe',
                textAlign: 'center',  
              },
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="account-group" size={24} color={color} />
              ),
            }}
            component={GerenciamentoUser}
          />
          <DrawerNavigator.Screen
            name="GerenciamentoAgendamento"
            options={{
              title: 'Gerenciar Agendamentos',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="calendar-multiple" size={24} color={color} />
              ),
            }}
            component={GerenciamentoAgendamento}
          />
          <DrawerNavigator.Screen
            name="GerenciamentoServico"
            options={{
              title: 'Gerenciar Serviços',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="dog-service" size={24} color={color} />
              ),
            }}
            component={GerenciamentoServico}
          />
          <DrawerNavigator.Screen
            name="AlterarSenha"
            options={{
              title: 'Alterar Senha',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="key-change" size={24} color={color} />
              ),
            }}
            component={AlterarSenhaScreen}
          />
          <DrawerNavigator.Screen
            name="Sair"
            options={{
              title: 'Sair',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="logout" size={24} color={color} />
              ),
            }}
            listeners={{
              focus: () => {
                handleLogout();
              },
            }}
            component={() => null}
          />
        </>
      )}
  
      {userType === '1' && (
        <>
          <DrawerNavigator.Screen
            name="GerenciamentoAgendamento"
            options={{
              title: 'Meus Agendamentos',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="calendar-check" size={24} color={color} />
              ),
            }}
            component={GerenciamentoAgendamentoUser}
          />
          <DrawerNavigator.Screen
            name="CadastroAtendimento"
            options={{
              title: 'Novo Agendamento',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="calendar-plus" size={24} color={color} />
              ),
            }}
            component={CadastroAtendimento}
          />
          <DrawerNavigator.Screen
            name="AlterarSenha"
            options={{
              title: 'Alterar Senha',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="key-change" size={24} color={color} />
              ),
            }}
            component={AlterarSenhaScreen}
          />
          <DrawerNavigator.Screen
            name="Sair"
            options={{
              title: 'Sair',
              headerTitleAlign: 'center',
              drawerIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons name="logout" size={24} color={color} />
              ),
            }}
            listeners={{
              focus: () => {
                handleLogout();
              },
            }}
            component={() => null}
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
