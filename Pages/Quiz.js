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
import { defaultQuizData } from "../quizAns";
import ImageViewer from "react-native-image-zoom-viewer";

export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      quizContent: null,
      content: null,
    };
  }

  async componentDidMount() {
    await this.loadListQuiz();
  }

  async loadQuiz() {
    const png = await Asset.loadAsync(require("../assets/quiz/1.png"));
    FileSystem.getContentUriAsync(png[0].localUri).then((x) => {
      this.setState({ quizContent: <ImageViewer imageUrls={[{ url: x }]} /> });
    });
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
    FileSystem.getContentUriAsync(pdf[0].localUri).then((cUri) => {
      console.log(cUri.uri);
    });
  }

  loadListQuiz() {
    this.setState({
      content: (
        <List>
          {defaultQuizData.map((x, index) => {
            return (
              <ListItem
                key={index}
                button
                // onPress={() => {
                //   this.loadAccordionContent(x);
                // }}
              >
                <Body>
                  <Text>{x.name}</Text>
                  {/* <Text numberOfLines={1} style={{}} note>
                    {x.description}
                  </Text> */}
                </Body>
                <Right>
                  <Entypo name="star-outlined" size={24} color="black" />
                </Right>
              </ListItem>
            );
          })}
        </List>
      ),
    });
  }

  render() {
    //console.log(this.state.image);
    return (
      <Container>
        {this.state.content}
        {/* {this.state.content}
        <Container
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Text>Quiz</Text>
        </Container> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
  },
});
