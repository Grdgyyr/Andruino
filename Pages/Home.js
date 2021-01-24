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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      content: null,
    };
  }

  async componentDidMount() {}

  render() {
    return <Text>Home Page</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
  },
});
