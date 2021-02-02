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

const abc = [
  <Picker.Item label="A" key={"a1"} value="A" />,
  <Picker.Item label="B" key={"a2"} value="B" />,
  <Picker.Item label="C" key={"a3"} value="C" />,
  <Picker.Item label="D" key={"a4"} value="D" />,
  <Picker.Item label="-" key={"a5"} value="-" />,
];

export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      quizContent: null,
      content: 1,
      answers: [
        { id: 1, value: "-" },
        { id: 2, value: "-" },
      ],
      quizData: [],
      inputChange: this.inputChange.bind(this),
    };
  }

  inputChange = (x, index) => {
    //this.findAndReplace(testing,2,'ASD');
    //console.log(index);
    let ans = this.state.answers;

    ans[index + 1] = { id: index + 1, value: x };

    //console.log(x, index, ans);

    // if (ans.length === 0) {
    //   ans.push({ id: index + 1, value: x });
    // } else {
    //   let srch = ans.find((a) => a.id === index + 1);
    //   if (srch === undefined) ans.push({ id: index + 1, value: x });
    //   else {
    //     this.findAndReplace(ans, index + 1, x);
    //   }
    // }
    console.log(ans[index + 1].value);

    this.setState({ answers: ans }, (c) => {
      //console.log(this.state.answers);
    });

    // console.log()
    // this.state.answers.find(s=> s.id ===1)
  };

  async componentDidMount() {
    await this.loadListQuiz();
  }

  async findAndReplace(object, value, replacevalue) {
    for (var x in object) {
      if (object.hasOwnProperty(x)) {
        if (typeof object[x] == "object") {
          this.findAndReplace(object[x], value, replacevalue);
        }
        if (object[x] == value) {
          object["value"] = replacevalue;
          break; // uncomment to stop after first replacement
        }
      }
    }
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
    //console.log(data);

    data.ans.forEach((e, i) => {
      this.setState((a) => ({
        answers: { ...a.answers, [i + 1]: { id: i + 1, value: "-" } },
      }));
    });

    const inputs = data.ans.map((x, index) => {
      return React.createElement(
        Item,
        { key: index, picker: true },
        React.createElement(Label, {}, `${index + 1}. `),
        React.createElement(
          Picker,
          {
            mode: "dropdown",
            selectedValue: x.value,
            key: index + 1,
            onValueChange: (x) => this.state.inputChange(x, index),
          },
          abc
        )
      );
    });
    console.log(inputs);
    this.setState((a) => ({
      content: 2,
      contentData: data,
      quizPictures: quizImg,
      //ansInputs: inputs,
    }));
  }

  _renderContent(config) {
    const KeysToComponentMap = {
      button: Button,
      item: Item,
      picker: Picker,
    };
    if (typeof KeysToComponentMap[config.component] !== "undefined") {
      return React.createElement(
        KeysToComponentMap[config.component],
        {
          src: config.src,
        },
        config.children &&
          (typeof config.children === "string"
            ? config.children
            : config.children.map((c) => renderer(c)))
      );
    }
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
      //console.log(cUri.uri);
    });
  }

  loadListQuiz() {
    // this.setState({
    //   content: 1,
    // });
    return (
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
    );
  }

  render() {
    //console.log(this.state.image);
    return (
      <Container>
        {/* <Text>{this.state.answers[1].value}</Text> */}
        {((x) => {
          if (this.state.content === 1) {
            return (
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
                          <Entypo
                            name="star-outlined"
                            size={24}
                            color="black"
                          />
                        </Right>
                      </ListItem>
                    );
                  })}
                </List>
              </ScrollView>
            );
          } else {
            return (
              <View
                style={{
                  flex: 1,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Button
                    onPress={(x) => {
                      //this.loadListQuiz();
                      this.setState({ content: 1 });
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
                      {this.state.contentData.name}
                    </Text>
                  </View>
                </View>

                <ImageViewer
                  style={{ flex: 1 }}
                  imageUrls={this.state.quizPictures}
                />

                <ScrollView
                  style={{
                    flex: 1,
                  }}
                >
                  {this.state.contentData.ans.map((x, index) => {
                    return React.createElement(
                      Item,
                      { key: index, picker: true },
                      React.createElement(Label, {}, `${index + 1}. `),
                      React.createElement(
                        Picker,
                        {
                          mode: "dropdown",
                          selectedValue: this.state.answers[index + 1].value,
                          key: index + 1,
                          onValueChange: (x) =>
                            this.state.inputChange(x, index),
                        },
                        abc
                      )
                    );
                  })}
                </ScrollView>
              </View>
            );
          }
        })()}
        {/* {this.state.content} */}
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
