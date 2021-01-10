import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

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
import * as Font from "expo-font";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";

const dataArray = [
  { title: "First Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Third Element", content: "Lorem ipsum dolor sit amet" },
];

export default class Lessons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  render() {
    // if (!this.state.isReady) {
    //   return <AppLoading />;
    // }

    return (
      <List>
        <ListItem avatar>
          <Left>
            <Thumbnail source={{ uri: "Image URL" }} />
          </Left>
          <Body>
            <Text>Kumar Pratik</Text>
            <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
            <Text note>3:43 pm</Text>
          </Right>
        </ListItem>
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
  },
});
