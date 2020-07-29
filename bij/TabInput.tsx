import React from "react";
import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";

interface Props {
  tabs: string[];
  keys: any[];
  onChange: (key: any) => void;
  selected: any;
  selectedColor: string;
  nonSelectedColor: string;
  fontSize?: number;
  style?: object;
}

class TabInput extends React.Component<Props> {
  render() {
    const {
      tabs,
      keys,
      onChange,
      selected,
      selectedColor,
      nonSelectedColor,
      style,
      fontSize,
    } = this.props;

    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          ...style,
        }}
      >
        {tabs.map((tab, index) => {
          return (
            <TouchableOpacity
              key={`tab${index}`}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                onChange(keys[index]);
              }}
            >
              <View
                key={`index${index}`}
                style={{
                  borderRadius: fontSize || 20,
                  padding: 10,
                  margin: 5,
                  backgroundColor:
                    selected === keys[index] ? selectedColor : nonSelectedColor,
                }}
              >
                <Text
                  style={[
                    selected === keys[index]
                      ? { color: "#FFF" }
                      : { color: selectedColor },
                    { fontSize: fontSize || undefined },
                  ]}
                >
                  {tab}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

export default TabInput;
