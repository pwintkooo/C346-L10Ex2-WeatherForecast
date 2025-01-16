import React, {useState, useEffect} from "react";
import {Text, View, StyleSheet, FlatList, StatusBar, TextInput, Image} from "react-native";
import {WeatherIcons} from "./WeatherIcons";

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  itemContainer: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "orange",
    marginBottom: 10,
    padding: 5,
    borderRadius: 15
  },
  contentTitleContainer: {
    padding: 5,
    borderBottomColor: "#FFE3C1",
    borderBottomWidth: 1
  },
  contentTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 5
  },
  bodyText: {
    fontSize: 16,
    padding: 5
  },
  title: {
    textAlign: "center",
    backgroundColor: "orange",
    padding: 5,
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 25,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20
  },
  noResult: {
    padding: 20,
    fontWeight: "bold",
    fontSize: 20
  }
});

let originalData = [];

const App = () => {
  const [myData, setMyData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const FilteredData = (text) => {
    if (text !== "") {
      let myFilteredData = originalData.filter((item) =>
          item.area.toLowerCase().includes(text.toLowerCase()));
      setMyData(myFilteredData);
    } else {
      setMyData(originalData);
    }
  }

  useEffect(() => {
    fetch("https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast")
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          const foreCasts = myJson.data.items[0].forecasts;
          if (originalData < 1) {
            originalData = foreCasts;
            setMyData(foreCasts);
          }
        })
  }, []);

  const renderItem = ({item}) => {
    const wIcons = WeatherIcons[item.forecast];

    return(
        <View style={styles.itemContainer}>
          <View style={styles.contentTitleContainer}>
            <Text style={styles.contentTitle}>{item.area}</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.bodyText}>Forecast: {item.forecast}</Text>
          </View>
          <View>
            <Image source={{uri: wIcons}} width={50} height={50}/>
          </View>
        </View>
    )
  }

  return(
      <View style={{flex: 1}}>
        <StatusBar/>
        <Text style={styles.title}>2-hour Weather Forecast</Text>
        <TextInput
            style={styles.textInput}
            value={searchText}
            onChangeText={(text) => {
              FilteredData(text);
              setSearchText(text);
            }}
            placeholder="Search for area..."
        />
        {originalData.length === 0 ? (
            <Text style={styles.noResult}>Loading...</Text>
        ) : (
            myData.length === 0 ? (
                <Text style={styles.noResult}>No result found for "{searchText}"</Text>
            ) : (
                <FlatList
                    data={myData}
                    renderItem={renderItem}
                    contentContainerStyle={styles.container}
                />
            )
        )}
      </View>
  )
}

export default App;
