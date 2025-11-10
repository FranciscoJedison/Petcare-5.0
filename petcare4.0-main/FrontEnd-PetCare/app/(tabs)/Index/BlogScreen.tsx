import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ListRenderItem, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const images = {
  b1: require('../../../assets/images/img1.png'),
  b2: require('../../../assets/images/img2.png'),
  b3: require('../../../assets/images/img3.png'),
  b4: require('../../../assets/images/img4.png'),
  b5: require('../../../assets/images/img5.png'),
};

interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  image: any;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Cuidados essenciais para manter seu pet saudável',
    date: '15 de abril de 2024',
    author: 'Brasil Agora',
    image: images.b1,
    link: 'https://www.casadobicho.com/blog/cuidados-essenciais-para-a-saude-do-seu-pet-dicas-para-garantir-uma-vida-longa-e-saudavel/',
  },
  {
    id: '2',
    title: 'Alimentação natural: uma opção saudável para cães e gatos',
    date: '24 de maio de 2022',
    author: 'Marie Claire',
    image: images.b2,
    link: 'https://g1.globo.com/pop-arte/pets/noticia/2023/05/16/racao-x-comida-natural-entenda-o-que-dizem-veterinarios-sobre-alimentacao-de-pets.ghtml',
  },
  {
    id: '3',
    title: 'A importância da vacinação para cães e gatos',
    date: '29 de fevereiro de 2024',
    author: 'iapcosmeticos',
    image: images.b3,
    link: 'https://g1.globo.com/ms/mato-grosso-do-sul/noticia/2024/01/14/saiba-a-importancia-de-manter-a-vacinacao-dos-pets-em-dia.ghtml',
  },
  {
    id: '4',
    title: 'Como identificar sinais de estresse em cães e gatos?',
    date: '30 de abril de 2024',
    author: 'Dermaclub',
    image: images.b4,
    link: 'https://www.terra.com.br/vida-e-estilo/pets/9-sinais-de-estresse-em-caes-e-gatos,884b5ec465d1b9cfed4cfb8ebbc5a7ee1iy657ep.html',
  },
  {
    id: '5',
    title: 'Os benefícios do banho e tosa para a saúde do seu pet',
    date: '04 de janeiro de 2024',
    author: 'Vogue',
    image: images.b5,
    link: 'https://sispet.com.br/importancia-dos-servicos-de-banho-tosa-saude-do-pet/',
  },
];

const BlogScreen: React.FC = () => {
  const renderItem: ListRenderItem<BlogPost> = ({ item }) => (
    <View style={styles.blogItem}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.author}>{item.author}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.link)} style={styles.button}>
          <Text style={styles.buttonText}>Leia mais →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
          colors={['#0f0f0f', '#424242']}>
    <View style={styles.container}>
      <FlatList
        data={blogPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32312F', // Marrom claro
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 80,
    paddingTop: 5,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  highlight: {
    color: '#27ae60',
  },
  flatList: {
    flexGrow: 0,
  },
  blogItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: 370,
    height: 500,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 10,
  },
  intro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  author: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BlogScreen;
