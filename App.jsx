import React, { useState ,useEffect} from "react";
import { LogBox, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './components/Home';
import axios from "axios";

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore specific logs

const Stack = createNativeStackNavigator();

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userinfo, setUserInfo] = useState();
  const [profileImage,setProfileimage]=useState('https://picsum.photos/200');

  useEffect(() => {
    const getchats = async () => {
      try {
        const response = await axios.get('https://qa.corider.in/assignment/chat?page=0');
        setMessages(response.data.chats);
        setUserInfo(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getchats();
  }, []);

  useEffect(() => {
    if (messages && Array.isArray(messages)) {
        const selfMessage = messages.find((item) => item.sender.self);
        if (selfMessage) {
            setProfileimage(selfMessage.sender.image);
        }
    }
  }, [messages]); 

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            // Custom Back Button
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    Alert.alert("No previous screen!");
                  }
                }}
                style={styles.headerButton}
              >
                <Icon name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
            ),

            // Custom Right Icon
            headerRight: () => (
              <TouchableOpacity
                onPress={() => Alert.alert('Icon pressed')}
                style={styles.headerButton}
              >
                <Icon name="square-edit-outline" size={24} color="black" />
              </TouchableOpacity>
            ),

            title: `Trip ${(userinfo?.name?.slice(-2) || 'Loading')}`,

          
              headerStyle: {
                backgroundColor: "#f5f5f5",
                shadowOpacity: 0,       // Removes shadow for iOS
                borderBottomWidth: 0,   // Removes default bottom border
              },
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerShadowVisible: false,
            
          })}
        >
          {props => <Home {...props} profileImage={profileImage} messages={messages} userinfo={userinfo} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0, // Removes shadow on Android
    shadowOpacity: 0, // Removes shadow on iOS
  },
  headerButton: {
    paddingHorizontal: 10,
  },
});

export default App;
