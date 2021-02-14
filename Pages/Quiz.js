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
import * as SQLite from "expo-sqlite";

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
      newQuiz: true,
      score: 0,
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

    this.props.db.transaction(
      (tx) => {
        tx.executeSql(
          `select * from quiz where quizId = ${Number(data.id)}`,
          [],
          (_, { rows }) => {
            //rows.length === 0
            if (rows.length === 0) {
              data.ans.forEach((e, i) => {
                this.setState((a) => ({
                  answers: {
                    ...a.answers,
                    [i + 1]: { id: i + 1, value: "-", wrong: false },
                  },
                }));
              });
              this.setState((a) => ({
                content: 2,
                contentData: data,
                quizPictures: quizImg,
                newQuiz: true,
              }));
            } else {
              const dbAns = rows._array[0].answer.split(",");
              let finalScore = 0;
              let userAnswers = [];
              data.ans.forEach((e, i) => {
                if (e.toUpperCase() === dbAns[i].toUpperCase()) {
                  finalScore++;

                  this.setState((a) => ({
                    answers: {
                      ...a.answers,
                      [i + 1]: { id: i + 1, value: dbAns[i], wrong: false },
                    },
                  }));
                } else {
                  this.setState((a) => ({
                    answers: {
                      ...a.answers,
                      [i + 1]: { id: i + 1, value: dbAns[i], wrong: true },
                    },
                  }));
                }
              });
              this.setState((a) => ({
                content: 2,
                contentData: data,
                quizPictures: quizImg,
                newQuiz: false,
                score: finalScore,
              }));
            }
          }
        );
      },
      (err) => console.log(err)
    );

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
  }

  async read() {
    this.props.db.transaction(
      (tx) => {
        tx.executeSql(`select * from quiz`, [], (_, { rows }) =>
          console.log(rows)
        );
      },
      (x) => console.log(x)
    );
  }

  async checkQuiz() {
    const arr = this.state.contentData.ans;
    let finalScore = 0;
    let userAnswers = [];

    arr.forEach((e, i) => {
      let ans = this.state.answers;
      userAnswers.push(this.state.answers[i + 1].value.toUpperCase());
      if (this.state.answers[i + 1].value.toUpperCase() === e.toUpperCase()) {
        finalScore++;

        ans[i + 1] = { ...ans[i + 1], wrong: false };
      } else {
        ans[i + 1] = { ...ans[i + 1], wrong: true };
      }
      this.setState({ answers: ans }, (c) => {
        // console.log(
        //   this.state.answers[i + 1].value.toUpperCase(),
        //   e.toUpperCase(),
        //   this.state.answers[i + 1].wrong
        // );
      });
    });

    // console.log(
    //   await FileSystem.readDirectoryAsync(
    //     FileSystem.documentDirectory + "SQLite/"
    //   )
    // );

    let _stringAnswers = JSON.stringify(userAnswers);
    const stringAnswers = userAnswers.toString();
    this.props.db.transaction(
      (tx) => {
        tx.executeSql(
          `select * from quiz where quizId = ${Number(
            this.state.contentData.id
          )}`,
          [],
          (_, { rows }) => {
            if (rows.length === 0) {
              this.props.db.transaction(
                (tx) => {
                  tx.executeSql(
                    `insert into quiz (quizId,answer) VALUES (${Number(
                      this.state.contentData.id
                    )}, '${stringAnswers}') `,
                    []
                  );
                  tx.executeSql(`select * from quiz`, [], (_, { rows }) =>
                    console.log(rows)
                  );
                },
                (err) => console.log(err)
              );
            } else {
              this.props.db.transaction(
                (tx) => {
                  tx.executeSql(
                    `update quiz set answer = '${stringAnswers}'`,
                    []
                  );
                  tx.executeSql(`select * from quiz`, [], (_, { rows }) =>
                    console.log(rows._array[0])
                  );
                },
                (err) => console.log(err)
              );
            }
          }
        );
      },
      (err) => console.log(err)
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
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
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
                        backgroundColor: this.state.newQuiz
                          ? "transparent"
                          : "green",
                      }}
                    >
                      {(() => {
                        if (this.state.newQuiz) {
                          return this.state.contentData.name;
                        } else {
                          return `${this.state.contentData.name} Score(${this.state.score}/${this.state.contentData.ans.length})`;
                        }
                      })()}
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
                        key: index + "cont",
                        picker: true,
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
                                enabled: this.state.newQuiz,
                                onValueChange: (x) =>
                                  this.state.inputChange(x, index),
                              },
                              abc
                            );
                          case 1:
                            return React.createElement(
                              Input,
                              {
                                value: this.state.answers[index + 1].value,
                                editable: this.state.newQuiz,
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
                        ? React.createElement(
                            Label,
                            {
                              style: {
                                backgroundColor: "red",
                              },
                            },
                            `CORRECT ANSWER ${x}`
                          )
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
                  <Button
                    onPress={(x) => {
                      this.read(x);
                    }}
                  >
                    <Text>READ</Text>
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
