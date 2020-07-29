import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { FontAwesome } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import * as React from "react";
import {
  Platform,
  StatusBar,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { connect, Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import AddScreen from "./Add";
import { GlobalContextProvider } from "./GlobalContext";
import HomeScreen from "./Home";
import MoreScreen from "./More";
import { persistor, store } from "./Store";

const Stack = createStackNavigator();
const MoreStack = createStackNavigator();
const AddStack = createStackNavigator();

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const goDownBack = (navigation: any) => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <FontAwesome name="chevron-down" size={25} style={{ marginLeft: 15 }} />
  </TouchableOpacity>
);

const CardStackComponent = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="home"
      component={HomeScreen}
      options={{ header: () => null, title: "Home" }}
    />
  </Stack.Navigator>
);

const MoreStackComponent = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="more"
      component={MoreScreen}
      options={({ navigation }) => ({
        title: "More",
        headerLeft: () => goDownBack(navigation),
      })}
    />
  </Stack.Navigator>
);

const AddStackComponent = () => (
  <AddStack.Navigator>
    <AddStack.Screen
      name="addScreen"
      component={AddScreen}
      options={({ navigation }) => ({
        title: "Maak een evenement aan",
        headerLeft: () => goDownBack(navigation),
      })}
    />
  </AddStack.Navigator>
);
function App({ global }) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <NavigationContainer>
          <Stack.Navigator mode="modal" headerMode="none">
            <Stack.Screen name="cardStack" component={CardStackComponent} />
            <Stack.Screen name="more" component={MoreStackComponent} />
            <Stack.Screen name="add" component={AddStackComponent} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

class _RootContainer extends React.Component {
  render() {
    const { props } = this;

    return (
      <GlobalContextProvider props={props}>
        <ActionSheetProvider>
          <App global={props} />
        </ActionSheetProvider>
      </GlobalContextProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return { state };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const RootContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(_RootContainer);

export default class FullApp extends React.Component {
  render() {
    return (
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <SafeAreaProvider>
            <RootContainer />
          </SafeAreaProvider>
        </Provider>
      </PersistGate>
    );
  }
}
