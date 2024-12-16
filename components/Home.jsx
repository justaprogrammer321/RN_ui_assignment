import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({profileImage,messages,userinfo}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fileattachments,setFileattachments]=useState(false);

      // Function to group messages by date
      const groupMessagesByDate = (messages) => {
        const grouped = messages.reduce((acc, message) => {
          const date = new Date(message.time).toDateString(); 
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(message);
          return acc;
        }, {});
  
        return Object.keys(grouped).map((date) => ({
          title: date,
          data: grouped[date],
        }));
      };
    
    const sections = groupMessagesByDate(messages);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  
  const togglefileattachment = () => {
    setFileattachments(!fileattachments);
  };

  const hidePopups = () => {
    setDropdownVisible(false);
    setFileattachments(false);
    Keyboard.dismiss(); // Close the keyboard if open
  };
  

  return (
    <TouchableWithoutFeedback onPress={hidePopups}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headertext}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <View>
              <Text style={styles.tripText}>
                From <Text style={styles.bold}>{userinfo?.from || 'Loading...'}</Text>
              </Text>
              <Text style={styles.tripText}>
                To <Text style={styles.bold}>{userinfo?.to || 'Loading...'}</Text>
              </Text>
            </View>
        </View>

        {/* Menu Dropdown */}
        <View>
        <TouchableOpacity onPress={toggleDropdown}>
          <Icon name="dots-vertical" size={24} color="black" />
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownOption}>
              <Icon name="account-outline" size={24} color="#000" style={styles.optionIcon}/>
              <Text style={styles.optionText}>Members</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownOption}>
              <Icon name="phone" size={24} color="#000" style={styles.optionIcon} />
              <Text style={styles.optionText}>Share Number</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownOption}>
              <View style={styles.iconWrapper}>
                <Icon name="message-outline" size={24} color="#000" style={styles.optionIcon} />
              </View>
              <Text style={styles.optionText}>Report</Text>
            </TouchableOpacity>
          </View>
          )}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
          <View style={styles.line} />
          <Text style={styles.sectionHeaderText}>{title}</Text>
          <View style={styles.line} />
          </View>
        )}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBox,
              item.sender.self && styles.outgoingBox,
            ]}
          >
            {/* Show image for incoming messages */}
            {!item.sender.self && (
              <Image
                source={{ uri: item.sender.image }}
                style={styles.userImage}
              />
            )}
            <View
              style={[
                styles.message,
                item.sender.self
                  ? styles.outgoingMessage
                  : styles.incomingMessage,
              ]}
            >
              <Text
                style={
                  item.sender.self
                    ? styles.outgoingText
                    : styles.incomingText
                }
              >
                {item.message}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.chatArea}
      />
  


      {/* Text Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
        />
        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={togglefileattachment}>
              {fileattachments &&
                <View style={styles.bubbleContainer}>
                {/* Icons */}
                <TouchableOpacity style={styles.icon}>
                  <Icon name="camera-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon}>
                  <Icon name="video-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon}>
                  <Icon name="file-outline" size={24} color="#fff" />
                </TouchableOpacity>
    
                {/* Tail of the bubble */}
                <View style={styles.bubbleTail}></View>
              </View>
            }
            <Icon name="paperclip" size={24} color="black" style={styles.button} />
          </TouchableOpacity>
          <TouchableOpacity >
            <Icon name="send-outline" size={24} color="black" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },  
  userImage:{
    width:30,
    height:30,
    borderRadius:15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    zIndex: 100, 
  },
  
  headertext:{
    flexDirection:"row",
  },
  tripText: {
    fontSize: 14,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: 30,
    right: 10, 
    minWidth: 150, 
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 9999,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  optionIcon: {
    marginRight: 10,
  },
  
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  outgoingBox: {
    alignSelf: "flex-end",
  },
  dropdownItem: {
    padding: 10,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatArea: {
    padding: 10,
  },
  messageBox:{
    flexDirection:"row",
    alignItems:"flex-start",
    marginVertical:5,
  },
  message: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  outgoingMessage: {
    borderBottomRightRadius:0,
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  outgoingText: {
    color: "white",
  },
  incomingMessage: {
    backgroundColor: "#f1f1f1",
    marginLeft: 10,
    borderBottomLeftRadius:0,
  },
  incomingText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    paddingLeft: 10,
  },
  
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  buttonIcon: {
    justifyContent:'center',
    paddingHorizontal: 10,
  },
  bubbleContainer: {
    position:"absolute",
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal:2,
    alignItems: 'center',
    justifyContent: 'space-around',
    top:-65,
    left:-37,
    width: 100, 
  },
  icon: {
    marginHorizontal:5,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -10, 
    left: '40%', 
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4CAF50',
  },
  sectionHeader: {
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 10,  
  },
  
  sectionHeaderText: {
    fontSize: 14,
    color: "#555",
    marginHorizontal: 8, 
  },
  
  line: {
    flex: 1,               
    height: 1,             
    backgroundColor: "#ccc", 
  },
  
});

export default Home;
