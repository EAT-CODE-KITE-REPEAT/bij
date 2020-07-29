import moment from "moment";
import React from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import Constants from "./Constants";
import { Device } from "./Store";

type Props = {
  navigation: any;
  dispatch: ({ type, value }: { type: string; value: any }) => void;
};
type State = {
  title: string;
  description: string;
  isWork: boolean;
  points: number;
  times: number;
  week: number;
  year: number;
};

class _Add extends React.Component<Props, State> {
  state = {
    goal: undefined,
    title: "",
    description: "",
    isWork: false,
    points: "1",
    times: "0",
    week: moment(Date.now()).isoWeek(),
    year: new Date().getFullYear(),
  };

  submit = () => {
    const { date, title, description, maxParticipants } = this.state;

    const { dispatch, navigation, token } = this.props;

    const url = `${Constants.SERVER_ADDR}/upsertEvent`;
    console.log("URL", url);
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        title,
        description,
        maxParticipants,
        date,
      }),
    })
      .then((response) => response.json())
      .then(async ({ response }) => {
        dispatch({ type: "ADD_EVENT", value: response });
      })
      .catch((error) => {
        console.error(error);
      });

    navigation.goBack();
  };
  renderForm = () => {
    const { goal } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Titel"
          value={this.state.title}
          onChangeText={(value) => this.setState({ title: value })}
          style={{
            width: "100%",
            fontSize: 24,
            borderBottomWidth: 1,
            borderBottomColor: "#000",
            borderTopWidth: 1,
            borderTopColor: "#000",
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}
        />

        <TextInput
          placeholder="Beschrijving"
          value={this.state.description}
          onChangeText={(value) => this.setState({ description: value })}
          style={{
            width: "100%",
            fontSize: 24,
            borderBottomWidth: 1,
            borderBottomColor: "#000",
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#000",
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}
        >
          <Text style={{ fontSize: 24, marginRight: 15 }}>
            Max. aantal deelnemers
          </Text>

          <TouchableOpacity
            onPress={() =>
              this.setState({
                times:
                  Number(this.state.times) <= 1
                    ? "1"
                    : (Number(this.state.times) - 1).toString(),
              })
            }
          >
            <View
              style={{
                borderRadius: 25,
                borderWidth: 1,
                borderColor: "#000",
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24 }}>-</Text>
            </View>
          </TouchableOpacity>
          <TextInput
            placeholder="Times"
            value={this.state.times}
            onChangeText={(value) => this.setState({ times: value })}
            style={{
              fontSize: 24,
              padding: 5,
            }}
          />

          <TouchableOpacity
            onPress={() =>
              this.setState({
                times: (Number(this.state.times) + 1).toString(),
              })
            }
          >
            <View
              style={{
                borderRadius: 25,
                borderWidth: 1,
                borderColor: "#000",
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24 }}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Button title="Aanmaken" onPress={() => this.submit()} />
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>{this.renderForm()}</View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ device }: { device: Device }) => {
  return { token: device.loginToken };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Add = connect(mapStateToProps, mapDispatchToProps)(_Add);

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
