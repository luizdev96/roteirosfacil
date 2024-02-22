import { useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView, 
 ActivityIndicator, Alert, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons'

const statusBarHeight = StatusBar.currentHeight;

export default function App() {

  const [city, setCity] = useState("")
  const [days, setDays] = useState(1)
  const [loading, setLoading] = useState(false)
  const [travel, setTravel] = useState("")

  const APIKEY = "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"
  const prompt = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias na cidade de ${city}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`

  async function generate(){
    // 
    
    if(city == ""){
      Alert.alert("Atenção:", "Prencha campo cidade destino")
      return
    }

    setLoading(true);
    Keyboard.dismiss();
    setCity("");

    fetch("https://api.openai.com/v1/chat/completions",{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${APIKEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        messages:[
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    }).then( response => response.json())
    .then( (data) => {
        console.log(data)
        setTravel(data.choices[0].message.content)
    })
    .catch( (e) => {
      console.log(e)
    })
    .finally( () =>{
      setLoading(false)
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar 
      barDtyle="dark-content" 
      translucent={true}
      backgroundColor="#F1F1F1" 
      />

    <Text style={styles.header}> Roteiros fácil</Text>

    <View style={styles.form}>
        <Text style={styles.label}>Cidade destino:</Text>
        <TextInput
        placeholder="Ex: Juiz de Fora, MG"
        style={styles.input}
        value={city}
        onChangeText={ (text) => setCity(text)}
        />

        <Text style={styles.label}>Tempo de estadia: <Text style={styles.days}>{days.toFixed(0)} dias</Text></Text>
        <Slider
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#94a3b8"
          value={days}
          onValueChange={ (number) => setDays(number)}
        />
    </View>

    <Pressable style={styles.button} onPress={generate}>
        <MaterialIcons name="travel-explore" size={24} color="#ffffff"/>
        <Text style={styles.buttonText}>Gerar roteiro</Text>
    </Pressable>

    <ScrollView 
    style={styles.contentScroll}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 20, marginTop: 4}}
    >
      {loading && (
        <View style={styles.content}>
          <Text style={styles.title}>Carregando roteiro</Text>
          <ActivityIndicator color="#ff5656" size="large"/>
        </View>
      )}

      {travel &&(
        <View style={styles.content}>
          <Text style={styles.title}>Roteiro da sua viagem 👇</Text>
          <Text style={styles.title2}>{travel}</Text>
        </View>
      )}
    </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },

  header:{
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54,
  },

  form:{
    backgroundColor: "#ffffff",
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16
  },

  label:{
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8
  },

  input:{
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#94a3b8",
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },

  button:{
    backgroundColor: "#ff5656",
    width: "90%",
    borderRadius: 8,
    flexDirection: "row",
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },

  buttonText:{
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold"
  },

  content:{
    backgroundColor: "#ffffff",
    padding: 16,
    marginTop: 20,
    width: "100%",
    borderRadius: 10
  },

  title:{
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16
  },

  contentScroll:{
    width: "90%"
  },

  title2:{
    fontSize: 16
  },

  days:{
    color: "#ff5656"
  }
});
