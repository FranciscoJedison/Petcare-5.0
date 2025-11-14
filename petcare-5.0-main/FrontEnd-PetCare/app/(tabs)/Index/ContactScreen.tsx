import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const ContactScreen = () => {
  return (
    <LinearGradient
      colors={["#00BFA6", "#E0F7F5", "#F9F9F9"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🐾 Pet Care</Text>
        <Text style={styles.subtitle}>Fale conosco</Text>
        <Text style={styles.description}>
          Entre em contato para mais informações sobre nossos serviços de cuidados aos animais.
        </Text>

        {/* Contato */}
        <View style={styles.contactBlock}>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={22} color="#00BFA6" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Telefone</Text>
              <Text style={styles.contactValue}>+123-456-789</Text>
              <Text style={styles.contactValue}>+111-222-333</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={22} color="#00BFA6" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>info@PetCareVeterinario.com</Text>
              <Text style={styles.contactValue}>appointments@PetCareVeterinario.com</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <FontAwesome name="instagram" size={22} color="#00BFA6" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Instagram</Text>
              <Text
                style={styles.link}
                onPress={() => Linking.openURL("https://www.instagram.com/PetCare")}
              >
                @PetCare
              </Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <FontAwesome name="facebook-square" size={22} color="#00BFA6" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Facebook</Text>
              <Text
                style={styles.link}
                onPress={() => Linking.openURL("https://www.facebook.com/PetCare")}
              >
                /PetCare
              </Text>
            </View>
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Assunto"
            placeholderTextColor="#888"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Mensagem"
            placeholderTextColor="#888"
            multiline
          />

          <TouchableOpacity style={styles.button}>
            <LinearGradient
              colors={["#00BFA6", "#0A6963"]}
              style={styles.buttonGradient}
            >
              <Ionicons name="send" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Enviar mensagem</Text>
            </LinearGradient>
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
  contactBlock: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  contactText: {
    marginLeft: 10,
  },
  contactLabel: {
    fontWeight: "bold",
    color: "#222",
    fontSize: 16,
  },
  contactValue: {
    color: "#555",
    fontSize: 15,
  },
  link: {
    color: "#00BFA6",
    textDecorationLine: "underline",
  },
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
});

export default ContactScreen;
