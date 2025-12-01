import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Image } from "react-native";


const ContactScreen = () => {
  return (
    <LinearGradient
      colors={["#00BFA6", "#E0F7F5", "#F9F9F9"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../../assets/images/petcareicon.png')} 
            style={styles.imageContain} 
          />
        </View>
        <Text style={styles.title}>Pet Care</Text>
        <Text style={styles.subtitle}>Fale conosco</Text>
        <Text style={styles.description}>
          Entre em contato para mais informações sobre nossos serviços de cuidados aos animais.
        </Text>

        {/* BLOCO DE REDES SOCIAIS */}
        <View style={styles.socialBlock}>
          {/* WHATSAPP */}
          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => Linking.openURL("https://wa.me/5561982499435")}
          >
            <FontAwesome name="whatsapp" size={40} color="#25D366" />
            <Text style={styles.socialLabel}>WhatsApp</Text>
            <Text style={styles.socialLink}>(61) 98249-9435</Text>
          </TouchableOpacity>

          {/* INSTAGRAM */}
          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => Linking.openURL("https://instagram.com/PetCare")}
          >
            <FontAwesome name="instagram" size={40} color="#E1306C" />
            <Text style={styles.socialLabel}>Instagram</Text>
            <Text style={styles.socialLink}>@PetCare</Text>
          </TouchableOpacity>

          {/* FACEBOOK */}
          <TouchableOpacity
            style={styles.socialItem}
            onPress={() => Linking.openURL("https://facebook.com/PetCare")}
          >
            <FontAwesome name="facebook-square" size={40} color="#1877F2" />
            <Text style={styles.socialLabel}>Facebook</Text>
            <Text style={styles.socialLink}>/PetCare</Text>
          </TouchableOpacity>

          {/* EMAIL */}
          <TouchableOpacity
            style={styles.socialItem}
            onPress={() =>
              Linking.openURL("mailto:info@PetCareVeterinario.com")
            }
          >
            <FontAwesome name="envelope" size={38} color="#555" />
            <Text style={styles.socialLabel}>Email</Text>
            <Text style={styles.socialLink}>
              info@PetCareVeterinario.com
            </Text>
          </TouchableOpacity>
        </View>

      
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },

  /** Títulos */
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f6fcfbff",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 15,
  },

  /** Redes Sociais */
  socialBlock: {
    marginVertical: 22,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
  },
  socialItem: {
    alignItems: "center",
    marginBottom: 28,
  },
  socialLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
    color: "#222",
  },
  socialLink: {
    marginTop: 3,
    color: "#00BFA6",
    textDecorationLine: "underline",
    fontSize: 15,
  },

  /** Formulário */
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    marginBottom: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 10,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },    
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContain: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
});

export default ContactScreen;
