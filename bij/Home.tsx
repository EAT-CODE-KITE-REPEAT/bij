import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import React, { useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Constants from "./Constants";
import Separator from "./Separator";
import { Event } from "./Store";

function renderItem(
  { item, index }: { item: Event; index: number },
  dispatch: Dispatch,
  showActionSheetWithOptions
) {
  return (
    <TouchableOpacity
      onLongPress={() => {
        //open action sheet

        const options = ["Delete", "Cancel"];
        const destructiveButtonIndex = 0;
        const cancelButtonIndex = 1;

        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
            destructiveButtonIndex,
          },
          (buttonIndex: number) => {
            if (buttonIndex === 0) {
              dispatch({ type: "DELETE_EVENT", value: item.id });
            }
          }
        );
      }}
    >
      <View
        style={{
          margin: 15,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text>{item.title}</Text>
        <Text>{(Number(item.points) * Number(item.times)).toString()}</Text>
      </View>
      {item.description ? (
        <View style={{ marginHorizontal: 15, marginBottom: 15 }}>
          <Text style={{ fontStyle: "italic" }}>{item.description}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

function fetchUser(token, dispatch) {
  const url = `${Constants.SERVER_ADDR}/me?token=${token}`;
  console.log("URL", url);
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      dispatch({ type: "SET_USER", value: response });
    })
    .catch((error) => {
      console.error(error);
    });
}

function App({
  navigation,
  activities,
  dispatch,
  token,
}: {
  navigation: any;
  activities: Event[];
  token: number;
  dispatch: Dispatch;
}) {
  useEffect(() => {
    getiOSNotificationPermission();

    fetchUser(token, dispatch);
    // runs only once
  }, []);

  const insets = useSafeArea();

  const renderGear = (
    <View style={{ alignItems: "flex-end", marginHorizontal: 15 }}>
      <TouchableOpacity onPress={() => navigation.navigate("more")}>
        <FontAwesome name="gear" size={20} />
      </TouchableOpacity>
    </View>
  );

  const renderPlusButton = (
    <TouchableOpacity
      onPress={() => navigation.navigate("add")}
      hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      style={{
        position: "absolute",
        alignSelf: "center",
        bottom: 15 + insets.bottom,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellow",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <FontAwesome
        name="plus"
        color="#000"
        size={25}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}
      />
    </TouchableOpacity>
  );

  const { showActionSheetWithOptions } = useActionSheet();

  /**
   * renders a week or the graph
   */
  const renderWeekOrGraph = (items: Event[]) => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", marginHorizontal: 15 }}>Agenda</Text>
        <FlatList
          data={items}
          renderItem={(x) =>
            renderItem(x, dispatch, showActionSheetWithOptions)
          }
          ListEmptyComponent={
            <View style={{ margin: 15 }}>
              <Text>
                Geen evenementen om weer te geven. Klik op de gele knop om er 1
                aan te maken.
              </Text>
            </View>
          }
          ItemSeparatorComponent={Separator}
          keyExtractor={(item, index) => `item${index}`}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderGear}

      {renderWeekOrGraph(activities)}
      {renderPlusButton}
    </SafeAreaView>
  );
}

const mapStateToProps = ({ device }) => {
  return { token: device.loginToken, activities: device.activities };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
