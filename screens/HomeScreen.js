import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import MapView, { Heatmap, Marker, Polygon } from "react-native-maps";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import FeatherIcon from "react-native-vector-icons/Feather";
import { KeyboardAvoidingView } from "react-native";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import BottomSheet from "react-native-simple-bottom-sheet";
import Spinner from "react-native-loading-spinner-overlay";
import { GOOGLE_MAPS_APIKEY } from "@env";

export default function App({ navigation }) {
  const [heatmaps, setHeatmaps] = useState([]);
  const [location, setLocation] = useState("");
  const [mapInitialLocation, setMapInitialLocation] = useState({
    lat: 52.629729,
    lng: -1.131592,
  });
  const [markerLocation, setMarkerLocation] = useState({});
  const panelRef = useRef(null);
  const [isScotland, setIsScotland] = useState(true);

  const [crimes, setCrimes] = useState([]);
  const [crimeCounts, setCrimeCounts] = useState({});
  const [sortedCrimesCount, setSortedCrimesCount] = useState([]);
  const [totalCrimesCount, setTotalCrimesCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [crimeLevel, setCrimeLevel] = useState();

  async function getUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setIsLoading(false);
      return;
    }

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000 },
      (location) => {
        setLocation(location);
        setMapInitialLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
        setMarkerLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );

    return () => {
      location.remove();
    };
  }

  useEffect(() => {
    getUserLocation();
  }, []);

  const myMapCustomStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#1d2c4d",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8ec3b9",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1a3646",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#4b6878",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#64779e",
        },
      ],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#4b6878",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#334e87",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#023e58",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#283d6a",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#6f9ba5",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d",
        },
      ],
    },
    {
      featureType: "poi.government",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#023e58",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#3C7680",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#304a7d",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#98a5be",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#2c6675",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#255763",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#b0d5ce",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#023e58",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#98a5be",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#283d6a",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: "#3a4762",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#0e1626",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#4e6d70",
        },
      ],
    },
  ];

  const getCityCrimesCount = (city, coordinates) => {
    setIsLoading(true);
    const locationCrimeMap = {};
    var totalCrimes = 0;
    const uri = `https://statistics.gov.scot/slice/observations.json?&dataset=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Frecorded-crime&http%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23measureType=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fmeasure-properties%2Fcount&http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fdimension%2FcrimeOrOffence=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fconcept%2Fcrime-or-offence%2Fall-crimes&http%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea=%7B%22related%22%3A%7B%22http%3A%2F%2Fpublishmydata.com%2Fdef%2Fontology%2Fspatial%2FmemberOf%22%3A%22*%22%7D%7D&page=1&perPage=200&sortDirection=ASC`;
    axios
      .get(uri)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function (data) {
        const uri = `https://statistics.gov.scot/slice/observations.json?&dataset=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Frecorded-crime&http%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23measureType=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fmeasure-properties%2Fcount&http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fdimension%2FcrimeOrOffence=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fconcept%2Fcrime-or-offence%2Fcrimes-group-1-robbery&http%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea=%7B%22related%22%3A%7B%22http%3A%2F%2Fpublishmydata.com%2Fdef%2Fontology%2Fspatial%2FmemberOf%22%3A%22*%22%7D%7D&page=1&perPage=200&sortDirection=ASC`;
        axios
          .get(uri)
          .then(function (response) {
            return response;
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function (firstCrimeData) {
            const uri = `https://statistics.gov.scot/slice/observations.json?&dataset=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Frecorded-crime&http%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23measureType=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fmeasure-properties%2Fcount&http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fdimension%2FcrimeOrOffence=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fconcept%2Fcrime-or-offence%2Fall-group-3-crimes-of-dishonesty&http%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea=%7B%22related%22%3A%7B%22http%3A%2F%2Fpublishmydata.com%2Fdef%2Fontology%2Fspatial%2FmemberOf%22%3A%22*%22%7D%7D&page=1&perPage=200&sortDirection=ASC`;
            axios
              .get(uri)
              .then(function (response) {
                return response;
              })
              .catch(function (error) {
                console.log(error);
              })
              .then(function (secondCrimeData) {
                setIsLoading(false);
                data.data.rows.forEach((records) => {
                  locationCrimeMap[
                    records.metadata.resource.value
                      .toLowerCase()
                      .replaceAll(" ", "_")
                  ] = records.content[25].value;
                  totalCrimes += parseInt(
                    records.content[25].value.replaceAll(",", "")
                  );
                });
                const crimeCount =
                  locationCrimeMap[
                    Object.keys(locationCrimeMap).filter((value, index) => {
                      if (value.includes(city.split(" ")[0].toLowerCase()))
                        return value;
                    })[0]
                  ];

                // Getting first type of crime reports count
                const locationFirstCrimeMap = {};
                firstCrimeData.data.rows.forEach((records) => {
                  locationFirstCrimeMap[
                    records.metadata.resource.value
                      .toLowerCase()
                      .replaceAll(" ", "_")
                  ] = records.content[25].value;
                });
                const firstCrimeCount =
                  locationFirstCrimeMap[
                    Object.keys(locationFirstCrimeMap).filter(
                      (value, index) => {
                        if (value.includes(city.split(" ")[0].toLowerCase()))
                          return value;
                      }
                    )[0]
                  ];

                // Getting second type of crime reports count
                const locationSecondCrimeMap = {};
                secondCrimeData.data.rows.forEach((records) => {
                  locationSecondCrimeMap[
                    records.metadata.resource.value
                      .toLowerCase()
                      .replaceAll(" ", "_")
                  ] = records.content[25].value;
                });
                const secondCrimeCount =
                  locationSecondCrimeMap[
                    Object.keys(locationSecondCrimeMap).filter(
                      (value, index) => {
                        if (value.includes(city.split(" ")[0].toLowerCase()))
                          return value;
                      }
                    )[0]
                  ];

                // Setting the heatmap data
                if (crimeCount) {
                  const weight =
                    parseInt(crimeCount.replaceAll(",", "")) + 1000;
                  const totalCount = totalCrimes;
                  const robbery = parseInt(firstCrimeCount.replaceAll(",", ""));
                  const dishonesty = parseInt(
                    secondCrimeCount.replaceAll(",", "")
                  );

                  if (weight >= 40000 && totalCount >= 40000 && robbery > 300) {
                    setTotalCrimesCount(2000);
                    alertLevel = "High";
                  } else if (weight >= 20000 && totalCount >= 20000) {
                    setTotalCrimesCount(200);
                    alertLevel = "Medium";
                  } else {
                    alertLevel = "Low";
                  }
                  setHeatmaps([
                    {
                      alertLevel,
                      latitude: coordinates.lat,
                      longitude: coordinates.lng,
                      weight,
                      totalCount,
                      city,
                      robbery,
                      dishonesty,
                    },
                  ]);
                } else {
                  setHeatmaps([]);
                  setTotalCrimesCount(0);
                }
              });
          });
      });
  };

  function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        arr.push({
          key: prop,
          value: obj[prop],
        });
      }
    }
    arr.sort(function (a, b) {
      return b.value - a.value;
    });
    return arr;
  }

  const getUkCrimes = async (city, coordinates) => {
    setIsLoading(true);
    fetch(
      `https://data.police.uk/api/crimes-street/all-crime?lat=${coordinates.lat}&lng=${coordinates.lng}&date=2023-01`
    )
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setCrimes(data);
        const counts = {};
        var totalCount = 0;
        data.forEach((crime) => {
          totalCount += 1;
          if (counts[crime.category]) {
            counts[crime.category] += 1;
          } else {
            counts[crime.category] = 1;
          }
        });

        const sortedCounts = {};
        const newlist = sortObject(counts);
        newlist.forEach((obj) => {
          sortedCounts[obj.key] = obj.value;
        });
        setSortedCrimesCount(newlist);

        setTotalCrimesCount(totalCount);
        if (totalCount > 0)
          setHeatmaps([
            {
              latitude: coordinates.lat,
              longitude: coordinates.lng,
              weight: 500,
              city,
            },
          ]);
        else {
          setHeatmaps([]);
          setTotalCrimesCount(0);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <StatusBar style="light" />
      <Spinner
        visible={isLoading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={styles.container}>
        <MapView
          customMapStyle={myMapCustomStyle}
          region={{
            latitude: mapInitialLocation.lat,
            longitude: mapInitialLocation.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          initialRegion={{
            latitude: mapInitialLocation.lat,
            longitude: mapInitialLocation.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          provider={"google"}
          style={styles.map}
          zoomEnabled={true}
          zoomControlEnabled={true}
        >
          {heatmaps.length > 0 && (
            <Heatmap
              radius={totalCrimesCount > 1000 ? 50 : 30}
              opacity={1.0}
              gradient={
                totalCrimesCount > 1000
                  ? {
                      colors: ["red", "#ff3838", "#9c0000"],
                      startPoints: [0.1, 0.5, 1],
                      colorMapSize: 256,
                    }
                  : {
                      colors: ["#f7d2d2", "#ff8a8a", "#ff3838"],
                      startPoints: [0.1, 0.5, 1],
                      colorMapSize: 256,
                    }
              }
              points={heatmaps}
            />
          )}
          {markerLocation.latitude && (
            <Marker
              coordinate={markerLocation}
              title="Your Location"
              description="This is your current location"
            />
          )}
        </MapView>
        {/* Profile Icon */}
        <View
          style={{
            position: "absolute",
            color: "white",
            right: 20,
            top: 80,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Setting", {});
            }}
          >
            <FeatherIcon color="white" name="user" size={45} />
          </TouchableOpacity>
        </View>
        <BottomSheet
          outerContentStyle={{
            backgroundColor: "#6d6987",
          }}
          wrapperStyle={{
            backgroundColor: "#6d6987",
          }}
          isOpen={false}
          sliderMaxHeight={1800}
          sliderMinHeight={230}
          ref={(ref) => (panelRef.current = ref)}
        >
          {/* user current location icon */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: -120,
              right: 10,
            }}
            onPress={() => {
              getUserLocation();
            }}
          >
            <FeatherIcon color="white" name="map" size={35} />
          </TouchableOpacity>

          {/* Bottom sheet */}
          <View style={[styles.mapBottomContainer]}>
            <GooglePlacesAutocomplete
              placeholder="Search Maps"
              debounce={400}
              onPress={async (data, details = null) => {
                isScotland
                  ? getCityCrimesCount(
                      details.address_components[0].short_name,
                      details.geometry.location
                    )
                  : getUkCrimes(
                      details.address_components[0].short_name,
                      details.geometry.location
                    );
                setMapInitialLocation(details.geometry.location);
                setTimeout(() => {
                  panelRef.current.togglePanel();
                }, 1000);
              }}
              fetchDetails={true}
              query={{
                key: GOOGLE_MAPS_APIKEY,
              }}
              styles={{
                container: {
                  marginVertical: -20,
                  marginHorizontal: 0,
                  position: "absolute",
                  width: "80%",
                  zIndex: 10,
                  shadowColor: "#7727c2",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 10,
                  shadowRadius: 15,
                  borderRadius: 25,
                },
                poweredContainer: {
                  display: "none",
                },
                textInputContainer: { borderRadius: 20 },
                textInput: {
                  position: "relative",
                  height: 45,
                  backgroundColor: "#adacb5",
                  fontSize: 16,
                  borderRadius: 20,
                  marginLeft: -10,
                },
                row: {
                  backgroundColor: "#adacb5",
                },
                predefinedPlacesDescription: { color: "red" },
              }}
            />

            <Switch
              trackColor={{ false: "red", true: "#9c5bba" }}
              ios_backgroundColor="#3e3e3e"
              style={{ position: "absolute", top: -11, right: 0, zIndex: 10 }}
              value={isScotland}
              onValueChange={(val) => {
                alert(`Switched to ${val ? "Scotland" : "UK"}`);
                setIsScotland(val);
              }}
            />

            {/* Select some location */}
            {!heatmaps[0] && totalCrimesCount == null && (
              <View>
                <Text
                  style={{
                    marginTop: 40,
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "black",
                    marginBottom: 10,
                  }}
                >
                  Crime data shown default is for Scotland, If you want for Rest
                  of UK then please switch the toggle button.
                </Text>
              </View>
            )}

            {/* No data available */}
            {!heatmaps[0] && totalCrimesCount == 0 && (
              <Text
                style={{
                  marginTop: 70,
                  marginBottom: 150,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                No local criminal records.
              </Text>
            )}

            {/* scotland heatmaps data */}
            {heatmaps[0] && isScotland && (
              <View>
                {/* Highest rated crime */}
                <View style={[styles.frequencyBox]}>
                  <Text
                    style={{
                      color:
                        heatmaps[0]?.alertLevel === "High"
                          ? "red"
                          : heatmaps[0]?.alertLevel === "Medium"
                          ? "yellow"
                          : "green",
                      marginLeft: 10,
                      marginTop: 10,
                      height: 20,
                      fontWeight: "700",
                      fontSize: 20,
                    }}
                  >
                    {heatmaps[0]?.alertLevel === "High"
                      ? "Alert Level - High"
                      : heatmaps[0]?.alertLevel === "Medium"
                      ? "Alert Level - Medium"
                      : "Alert Level - Low"}
                  </Text>

                  <Text
                    style={{
                      color: "gray",
                      marginLeft: 10,
                      marginTop: 10,
                      height: 20,
                      fontWeight: "normal",
                      fontSize: 9,
                    }}
                  >
                    Alert level is calculated using total crime report in your
                    area and Scotland.{" "}
                  </Text>
                </View>
                <View style={[styles.crimeDetailsBox]}>
                  <Text style={[styles.contentHeader]}>Crime Types</Text>
                  <Text
                    style={{
                      color: "gray",
                      marginLeft: 10,
                      marginTop: 10,
                      height: 20,
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Robbery - {heatmaps[0]?.robbery}
                  </Text>
                  <Text
                    style={{
                      color: "gray",
                      marginLeft: 10,
                      marginTop: 10,
                      height: 20,
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Dishonesty Crimes - {heatmaps[0]?.dishonesty}
                  </Text>
                  <Text
                    style={{
                      color: "gray",
                      marginLeft: 10,
                      marginTop: 10,
                      height: 20,
                      marginBottom: 20,
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Total Crime Reports - {heatmaps[0]?.weight}
                  </Text>
                </View>
              </View>
            )}

            {/* UK heatmaps data */}
            {heatmaps[0] && !isScotland && (
              <View>
                {/* Highest rated crime */}
                <View style={[styles.frequencyBox]}>
                  <Text
                    style={{
                      color: totalCrimesCount > 1000 ? "red" : "yellow",
                      marginLeft: 10,
                      marginTop: 10,
                      height: 30,
                      fontWeight: "700",
                      fontSize: 20,
                    }}
                  >
                    {totalCrimesCount > 1000
                      ? "Alert Level - High"
                      : "Alert Level - Medium"}
                  </Text>

                  <Text
                    style={{
                      color: "gray",
                      marginLeft: 10,
                      marginTop: 10,
                      height: 25,
                      fontWeight: "normal",
                      fontSize: 12.5,
                    }}
                  >
                    {totalCrimesCount > 1000
                      ? "Very high rates of crime have been reported in this area"
                      : "This area looks safe"}
                  </Text>
                </View>

                <View>
                  <View style={[styles.crimeDetailsBox]}>
                    <Text style={[styles.contentSmallHeader]}>
                      Top 5 Crimes in this area:
                    </Text>

                    <View style={[styles.crimesList]}>
                      {sortedCrimesCount.map((crime, index) => {
                        return (
                          index < 5 && (
                            <Text key={index} style={[styles.crimesText]}>
                              {crime.key.split("-").join(" ")} - {crime.value}
                            </Text>
                          )
                        );
                      })}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </BottomSheet>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapBottomContainer: {
    backgroundColor: "#6d6987", //#6d6987
    width: "100%",
    height: "100%",
    marginVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "column",
  },
  contentActiveDescription: {
    marginVertical: 100,
    marginLeft: 20,
    color: "white",
  },
  frequencyBox: {
    marginTop: 50,
    marginLeft: -10,
    paddingRight: 10,
    color: "white",
    width: "100%",
    backgroundColor: "black",
    borderRadius: 18,
    zIndex: 1,
  },
  crimeDetailsBox: {
    marginTop: 12,
    marginLeft: -10,
    marginBottom: 40,
    color: "white",
    width: "100%",
    backgroundColor: "black",
    borderRadius: 20,
    zIndex: 1,
  },
  contentHeader: {
    color: "gray",
    marginLeft: 9,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 30,
  },
  contentSmallHeader: {
    color: "gray",
    marginLeft: 15,
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 25,
  },
  crimesList: {
    color: "gray",
    marginLeft: 15,
    marginTop: 15,
  },
  crimesText: {
    color: "gray",
    textTransform: "capitalize",
    marginBottom: 10,
    fontSize: 16,
  },
  spinnerTextStyle: {
    color: "white",
  },
});
