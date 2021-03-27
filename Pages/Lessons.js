import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";

import AppLoading from "expo-app-loading";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Tab,
  Tabs,
  Badge,
  Accordion,
  List,
  ListItem,
} from "native-base";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

const dataArray = [
  {
    title: "Introduction",
    content: {},
    pdf: require("../assets/lessons/0.pdf"),
    description:
      "Sun tracking solar panels can absorb more energy from the Sun than fixed panels.",
  },
  {
    title: "Lesson 1",
    content: {},
    pdf: require("../assets/lessons/1.pdf"),
    description:
      "Sun tracking solar panels can absorb more energy from the Sun than fixed panels.",
  },
  {
    title: "Lesson 2",
    content: {},
    pdf: require("../assets/lessons/2.pdf"),
    description:
      "7 Segment displays are one of the most commonly used displays. They are used in numerous of applications for displaying vital information.",
  },
  {
    title: "Lesson 3",
    content: {},
    pdf: require("../assets/lessons/3.pdf"),
    description:
      "Light Sensor is a device that detects radiant energy or light.",
  },
  {
    title: "Lesson 4",
    content: {},
    pdf: require("../assets/lessons/4.pdf"),
    description:
      "This project presents an alarm clock using Arduino. Real time clock is used in order to get accurate time.",
  },
  {
    title: "Lesson 5",
    content: {},
    pdf: require("../assets/lessons/5.pdf"),
    description:
      "LED matrix is nothing but two dimensional arrangement of LEDs in rows and columns.",
  },
  {
    title: "Lesson 6",
    content: {},
    pdf: require("../assets/lessons/6.pdf"),
    description:
      "LED matrix is nothing but two dimensional arrangement of LEDs in rows and columns.",
  },
  {
    title: "Lesson 7",
    content: {},
    pdf: require("../assets/lessons/7.pdf"),
    description:
      "LED matrix is nothing but two dimensional arrangement of LEDs in rows and columns.",
  },
  {
    title: "Lesson 8",
    content: {},
    pdf: require("../assets/lessons/8.pdf"),
    description:
      "LED matrix is nothing but two dimensional arrangement of LEDs in rows and columns.",
  },
];

export default class Lessons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      content: null,
    };
  }

  async componentDidMount() {
    this.loadListProjects();
  }
  _renderHeader(item, expanded) {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          height: 60,
          borderColor: "black",
          borderStyle: "solid",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#A9DAD6",
        }}
      >
        <Text style={{ fontWeight: "600" }}> {item.title}</Text>
        {expanded ? (
          <Icon style={{ fontSize: 18 }} name="remove-circle" />
        ) : (
          <Icon style={{ fontSize: 18 }} name="add-circle" />
        )}
      </View>
    );
  }
  _renderContent(item) {
    return <Container>{item.content}</Container>;
  }

  async loadAccordionContent(dat) {
    const pdf = await Asset.loadAsync(dat.pdf);
    console.log(pdf[0].localUri);
    FileSystem.getContentUriAsync(pdf[0].localUri).then((cUri) => {
      console.log(cUri.uri);
      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        flags: 1,
        type: "application/pdf",
      });
    });
  }

  loadListProjects() {
    this.setState({
      content: (
        <List>
          {dataArray.map((x, index) => {
            return (
              <ListItem
                key={index}
                button
                onPress={() => {
                  this.loadAccordionContent(x);
                }}
              >
                <Body>
                  <Text>{x.title}</Text>
                  {/* <Text numberOfLines={1} style={{}} note>
                    {x.description}
                  </Text> */}
                </Body>
                {/* <Right>
                  <Entypo name="star-outlined" size={24} color="black" />
                </Right> */}
              </ListItem>
            );
          })}
        </List>
      ),
    });
  }

  render() {
    return <Container>{this.state.content}</Container>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
  },
});
