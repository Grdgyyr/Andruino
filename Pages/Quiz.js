import React, { Component } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
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
  Item,
  Picker,
  Form,
  Label,
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

  async loadQuiz(data) {
    const imgData = data.img;
    let quizImg = [];

    for (let index = 0; index < imgData.length; index++) {
      const imgPath = await Asset.loadAsync(imgData[index]);
      const finalPath = await FileSystem.getContentUriAsync(
        imgPath[0].localUri
      );
      quizImg.push({ url: finalPath });
    }
    console.log(data);
    this.setState({
      content: (
        <View
          style={{
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Button
              onPress={(x) => {
                this.loadListQuiz();
              }}
            >
              <Icon name="arrow-back" />
            </Button>
            <View style={{ flexGrow: 1 }}>
              <Text
                style={{
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                {data.name}
              </Text>
            </View>
          </View>

          <ImageViewer style={{ flex: 1 }} imageUrls={quizImg} />

          <ScrollView
            style={{
              flex: 1,
            }}
          >
            {data.ans.map((x, index) => {
              return this._renderQuestionInputs(x, index);
            })}
          </ScrollView>
        </View>
      ),
    });

    // const png = await Asset.loadAsync(require("../assets/quiz/1.png"));
    // FileSystem.getContentUriAsync(png[0].localUri).then((x) => {
    //   this.setState({ content: <ImageViewer imageUrls={[{ url: x }]} /> });
    // });
  }

  _renderQuestionInputs(data, index) {
    const abc = [
      <Picker.Item label="A" key={"a1"} value="key0" />,
      <Picker.Item label="B" key={"a2"} value="key1" />,
      <Picker.Item label="C" key={"a3"} value="key2" />,
      <Picker.Item label="D" key={"a4"} value="key3" />,
    ];

    return (
      // <Text key={index}>{index}</Text>
      <Item key={index} picker>
        <Label>{`${index + 1}. `}</Label>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={{ width: undefined }}
          placeholder={index}
          placeholderStyle={{ color: "#bfc6ea" }}
          placeholderIconColor="#007aff"
          selectedValue={null}
        >
          {abc}
        </Picker>
      </Item>
    );
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
        <ScrollView>
          <List>
            {defaultQuizData.map((x, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  onPress={() => {
                    this.loadQuiz(x);
                  }}
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
        </ScrollView>
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
