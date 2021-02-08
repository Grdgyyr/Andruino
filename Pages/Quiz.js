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
  Input,
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
const truefalse = [
  <Picker.Item label="A" key={"a1"} value="TRUE" />,
  <Picker.Item label="B" key={"a2"} value="FALSE" />,
  <Picker.Item label="-" key={"a3"} value="-" />,
];

export default class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      quizContent: null,
      content: 1,
      answers: [{ id: 1, value: "-", wrong: false }],
      quizData: [],
      inputChange: this.inputChange.bind(this),
      contentData: [],
    };
  }

  inputChange = (x, index, type) => {
    //console.log(x);
    let ans = this.state.answers;
    ans[index + 1] = { id: index + 1, value: x, wrong: false };
    //console.log(ans[index + 1].value);
    this.setState(
      (a) => ({
        answers: {
          ...a.answers,
          ans,
        },
      }),
      (c) => {
        //console.log(this.state.answers[index + 1]);
      }
    );
    //this.setState({ answers: ans }, (c) => {});
  };

  async componentDidMount() {
    //await this.loadListQuiz();
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
        answers: {
          ...a.answers,
          [i + 1]: { id: i + 1, value: "-", wrong: false },
        },
      }));
    });

    // const inputs = data.ans.map((x, index) => {
    //   return React.createElement(
    //     Item,
    //     { key: index, picker: true },
    //     React.createElement(Label, {}, `${index + 1}. `),
    //     React.createElement(Label, {}, `TST`),
    //     React.createElement(
    //       Picker,
    //       {
    //         mode: "dropdown",
    //         selectedValue: x.value,
    //         key: index + 1,
    //         onValueChange: (x) => this.state.inputChange(x, index),
    //       },
    //       abc
    //     )
    //   );
    // });
    //console.log(inputs);
    this.setState((a) => ({
      content: 2,
      contentData: data,
      quizPictures: quizImg,
    }));
  }

  checkQuiz() {
    const arr = this.state.contentData.ans;
    let finalScore = 0;

    arr.forEach((e, i) => {
      let ans = this.state.answers;
      if (this.state.answers[i + 1].value.toUpperCase() === e.toUpperCase()) {
        finalScore++;

        ans[i + 1] = { ...ans[i + 1], wrong: false };
      } else {
        ans[i + 1] = { ...ans[i + 1], wrong: true };
      }
      this.setState({ answers: ans }, (c) => {
        console.log(
          this.state.answers[i + 1].value.toUpperCase(),
          e.toUpperCase(),
          this.state.answers[i + 1].wrong
        );
      });
    });

    console.log(finalScore);
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
                      {
                        key: index,
                        picker: true,
                        style: this.state.answers[index + 1].wrong
                          ? { backgroundColor: "red" }
                          : { backgroundColor: "none" },
                      },
                      React.createElement(Label, {}, `${index + 1}. `),
                      ((x) => {
                        switch (this.state.contentData.type) {
                          case 0:
                            return React.createElement(
                              Picker,
                              {
                                mode: "dropdown",
                                selectedValue: this.state.answers[index + 1]
                                  .value,
                                key: index + 1,
                                onValueChange: (x) =>
                                  this.state.inputChange(x, index),
                              },
                              abc
                            );
                          case 1:
                            return React.createElement(
                              Input,
                              {
                                selectedValue: this.state.answers[index + 1]
                                  .value,
                                key: index + 1,
                                onChangeText: (text) =>
                                  this.state.inputChange(text, index),
                                //,
                              }
                              //abc
                            );
                          case 2:
                            return React.createElement(
                              Picker,
                              {
                                mode: "dropdown",
                                selectedValue: this.state.answers[index + 1]
                                  .value,
                                key: index + 1,
                                onValueChange: (x) =>
                                  this.state.inputChange(x, index),
                              },
                              truefalse
                            );
                        }
                      })(),

                      this.state.answers[index + 1].wrong
                        ? React.createElement(Label, {}, `CORRECT ANSWER ${x}`)
                        : null
                    );
                  })}
                  <Button
                    onPress={(x) => {
                      this.checkQuiz(x);
                    }}
                  >
                    <Text>Submit</Text>
                  </Button>
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
