import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
//import { AppLoading } from "expo";
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
  Input,
  Form,
  Item,
  Label,
  Card,
  CardItem,
} from "native-base";
import * as Font from "expo-font";
import { Ionicons, Entypo, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Projects from "./Pages/Projects";
import Lessons from "./Pages/Lessons";
import Quiz from "./Pages/Quiz";
import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { Restart } from "fiction-expo-restart";
import { Col, Row, Grid } from "react-native-easy-grid";
import * as Permissions from "expo-permissions";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import { defaultQuizData } from "./quizAns";
import * as Application from "expo-application";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking } from "expo";
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#7a7a7a",
  //backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#7a7a7a",
  //backgroundGradientToOpacity: 0.5,

  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};
const db = SQLite.openDatabase("db.db");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputChange: this.inputChange.bind(this),
      isReady: false,
      content: <></>,
      selectedPage: "",
      selectedProfileAction: { value: 0, name: "" },
      txtName: { value: "", editable: false },
      txtSchool: { value: "", editable: false },
      txtTeacher: { value: "", editable: false },
      unitTestPercentage: 0,
      quizPercentage: 0,
      totalQuizzes: 0,
      totalUnitTest: 0,
      totalQuizzesScore: 0,
      totalUnitTestScore: 0,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });

    // if (
    //   !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
    //     .exists
    // ) {
    //   await FileSystem.makeDirectoryAsync(
    //     FileSystem.documentDirectory + "SQLite"
    //   );
    // }

    // await FileSystem.downloadAsync(
    //   Asset.fromModule(require("./assets/db/andruino.db")).uri,
    //   FileSystem.documentDirectory + "SQLite/andruino.db"
    // );
    this.checkFileAccessPermission();
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists user ( id integer primary key, name text, school text, teacher text, quizData text, projectData text, lessonData text);",
        [],
        (ax) => {
          //console.log("===== TABLE USER CREATED =====");
        },
        (x) => console.log(x)
      );
      tx.executeSql(
        "create table if not exists quiz ( id integer primary key, quizId integer, answer text);",
        [],
        (ax) => {
          //console.log("===== TABLE QUIZ CREATED =====");
        },
        (x) => console.log(x)
      );
      tx.executeSql(
        "create table if not exists settings ( id integer primary key, isNew integer default 1, hasFileAccess integer default 0 );",
        [],
        (ax) => {
          //console.log("===== TABLE QUIZ CREATED =====");
        },
        (x) => console.log(x)
      );
      tx.executeSql(`select * from user`, [], (_, { rows }) => {
        //console.log("===== DATA =====");
        //console.log(rows._array[0]);
      });
    });

    //let db = SQLite.openDatabase("andruino.db");

    //console.log(defaultQuizData);

    // db.transaction(
    //   (tx) => {
    //     // tx.executeSql("insert into user (done, value) values (0, ?)", []);
    //     // tx.executeSql("select * from user", [], (_, { rows }) =>
    //     //   console.log(rows)
    //     // );
    //   },
    //   (x) => console.log()
    // );
  }

  open_settings() {
    // TODO: it might work on SDK 37?
    // Linking.openSettings();
    if (Platform.OS === "ios") {
      Linking.openURL(`app-settings:`);
    } else {
      const bundleIdentifier = Application.applicationId;
      IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
        {
          data: `package:${bundleIdentifier}`,
        }
      );
    }
  }

  async checkFileAccessPermission() {
    const { status, permissions } = await Permissions.askAsync(
      Permissions.MEDIA_LIBRARY
    );
    if (status !== "granted") {
      Alert.alert(
        "No File Access Permission",
        "please goto setting and turn on File access permission",
        [
          { text: "cancel", onPress: () => console.log("cancel") },
          { text: "Allow", onPress: () => this.open_settings() },
        ],
        { cancelable: false }
      );
      return;
    } else {
      //alert("");
      //throw new Error("Location permission not granted");
    }

    // const { status } = await Permissions.getAsync(Permissions.FileSystem);
    // if (status !== 'granted') {
    //   alert('File access to your device is required for this application to run. Please enable File access permission.');
    // }
  }

  inputChange = (e) => {
    //console.log(e);
    this.setState((a) => ({
      [e.name]: {
        ...a[e.name],
        value: e.value,
        editable: e.editable,
      },
    }));
  };

  loadTab() {
    return (
      <Tabs locked>
        <Tab heading="LESSONS">
          <Lessons />
        </Tab>
        <Tab heading="QUIZZES">
          <Quiz db={db} />
        </Tab>
        <Tab heading="ACTIVITIES">
          <Projects />
        </Tab>
      </Tabs>
    );
  }
  async getProfileInfo() {
    db.transaction(
      (tx) => {
        tx.executeSql(`select * from user`, [], (_, { rows }) => {
          if (rows._array[0]) {
            this.setState(
              (a) => ({
                txtName: {
                  ...a.txtName,
                  value: rows._array[0].name,
                },
                txtSchool: {
                  ...a.txtSchool,
                  value: rows._array[0].school,
                },
                txtTeacher: {
                  ...a.txtTeacher,
                  value: rows._array[0].teacher,
                },
              }),
              (cb) => {}
            );
          } else {
          }
        });
      },
      (x) => console.log(x)
    );
  }
  async saveProfileInfo() {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `update user set name = '${this.state.txtName.value}', school = '${this.state.txtSchool.value}', teacher = '${this.state.txtTeacher.value}' `,
          [],
          (_) => {
            this.getProfileInfo();
          }
        );
      },
      (x) => console.log(x)
    );
  }
  loadProfile() {
    return (
      <Content>
        <View style={{ flex: 1, paddingTop: 30 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Student profile
          </Text>
          <FontAwesome5
            name="user-graduate"
            size={100}
            style={{ textAlign: "center" }}
            color="black"
          />
          <Form>
            <Item stackedLabel>
              <Label>Full Name</Label>
              <Input
                onChangeText={(text) => {
                  this.state.inputChange({
                    value: text,
                    name: "txtName",
                  });
                }}
                editable={this.state.txtName.editable}
                defaultValue={this.state.txtName.value}
              />
            </Item>
            <Item stackedLabel last>
              <Label>School</Label>
              <Input
                onChangeText={(text) => {
                  this.state.inputChange({
                    value: text,
                    name: "txtSchool",
                  });
                }}
                editable={this.state.txtSchool.editable}
                defaultValue={this.state.txtSchool.value}
              />
            </Item>
            <Item stackedLabel last>
              <Label>Teacher</Label>
              <Input
                onChangeText={(text) => {
                  this.state.inputChange({
                    value: text,
                    name: "txtTeacher",
                  });
                }}
                editable={this.state.txtTeacher.editable}
                defaultValue={this.state.txtTeacher.value}
              />
            </Item>
          </Form>
        </View>
        <View style={{ flexDirection: "row", paddingTop: 10 }}>
          {this.state.selectedProfileAction.value === 0 ? (
            <Button
              onPress={(x) => {
                this.setState((a) => ({
                  selectedProfileAction: { value: 2, name: "edit" },
                  txtName: { ...a.txtName, editable: true },
                  txtSchool: { ...a.txtSchool, editable: true },
                  txtTeacher: { ...a.txtTeacher, editable: true },
                }));
              }}
              full
              style={{ flex: 1, margin: 3 }}
            >
              <Text>Edit</Text>
            </Button>
          ) : null}

          {this.state.selectedProfileAction.value === 2 ? (
            <Button
              onPress={(x) => {
                this.setState(
                  (a) => ({
                    selectedProfileAction: { value: 0, name: "" },
                    txtName: { ...a.txtName, editable: false },
                    txtSchool: { ...a.txtSchool, editable: false },
                    txtTeacher: { ...a.txtTeacher, editable: false },
                  }),
                  (x) => {
                    this.saveProfileInfo();
                  }
                );
              }}
              full
              success
              style={{ flex: 1, margin: 3 }}
            >
              <Text>Save</Text>
            </Button>
          ) : null}
          {this.state.selectedProfileAction.value === 2 ? (
            <Button
              full
              onPress={(x) => {
                this.setState(
                  (a) => ({
                    selectedProfileAction: { value: 0, name: "" },
                    txtName: { ...a.txtName, editable: false },
                    txtSchool: { ...a.txtSchool, editable: false },
                    txtTeacher: { ...a.txtTeacher, editable: false },
                  }),
                  (x) => {
                    this.getProfileInfo();
                  }
                );
              }}
              warning
              style={{ flex: 1, margin: 3 }}
            >
              <Text>Cancel</Text>
            </Button>
          ) : null}
        </View>
      </Content>
    );
  }

  async getQuizData(data) {
    let totalQuizzes = 0;
    let totalUnitTest = 0;
    let totalQuizzesScore = 0;
    let totalUnitTestScore = 0;

    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `select * from quiz where quizId = ${Number(data.id)}`,
            [],
            (_, { rows }) => {
              if (rows.length > 0) {
                const dbAns = rows._array[0].answer.split(",");
                let finalScore = 0;
                data.ans.forEach((e, i) => {
                  if (data.type === 0 || data.type === 1) {
                    if (e.toUpperCase() === dbAns[i].toUpperCase()) {
                      finalScore++;
                    }
                  } else {
                    if (e === dbAns[i]) {
                      finalScore++;
                    }
                  }
                });
                if (data.examType === 1) {
                  totalQuizzesScore += finalScore;
                  totalQuizzes += data.ans.length;
                } else {
                  totalUnitTestScore += finalScore;
                  totalUnitTest += data.ans.length;
                }
              } else {
                if (data.examType === 1) {
                  totalQuizzes += data.ans.length;
                } else {
                  totalUnitTest += data.ans.length;
                }
              }
              resolve({
                totalQuizzes,
                totalUnitTest,
                totalQuizzesScore,
                totalUnitTestScore,
              });
            }
          );
        },
        (err) => console.log(err)
      );
    });
  }

  async loadScoreData() {
    let totalQuizzes = 0;
    let totalUnitTest = 0;
    let totalQuizzesScore = 0;
    let totalUnitTestScore = 0;

    for (let i = 0; i < defaultQuizData.length; i++) {
      const data = defaultQuizData[i];
      const quizData = await this.getQuizData(data);
      totalQuizzes += quizData.totalQuizzes;
      totalUnitTest += quizData.totalUnitTest;
      totalQuizzesScore += quizData.totalQuizzesScore;
      totalUnitTestScore += quizData.totalUnitTestScore;
    }

    this.setState(
      (a) => ({
        totalQuizzes,
        totalUnitTest,
        totalQuizzesScore,
        totalUnitTestScore,
        quizPercentage: ((totalQuizzesScore / totalQuizzes) * 100).toFixed(2),
        unitTestPercentage: (
          (totalUnitTestScore / totalUnitTest) *
          100
        ).toFixed(2),
      }),
      () => console.log(this.state)
    );
  }

  loadScore() {
    return (
      <Content>
        <View
          style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}
        >
          <Text
            style={{
              textAlign: "center",
              flex: 1,
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            Test progression
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <ProgressChart
            data={{
              labels: ["Unit Test", "Quizzes"], // optional\
              data: [0.4, 0.6],
              data: [
                this.state.unitTestPercentage / 100,
                this.state.quizPercentage / 100,
              ],
            }}
            width={screenWidth}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        </View>
        <View>
          <Card>
            <CardItem header bordered>
              <Text>Quizzes</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Grid>
                  <Col>
                    <Text>{`Total Quizzes:`}</Text>
                  </Col>
                  <Col>
                    <Text>{this.state.totalQuizzes}</Text>
                  </Col>
                </Grid>
                <Grid>
                  <Col>
                    <Text>Your Total Score:</Text>
                  </Col>
                  <Col>
                    <Text>{this.state.totalQuizzesScore}</Text>
                  </Col>
                </Grid>
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem header bordered>
              <Text>Unit Tests</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Grid>
                  <Col>
                    <Text>{`Total Unit Test Score:`}</Text>
                  </Col>
                  <Col>
                    <Text>{this.state.totalUnitTest}</Text>
                  </Col>
                </Grid>
                <Grid>
                  <Col>
                    <Text>{`Your Total Score:`}</Text>
                  </Col>
                  <Col>
                    <Text>{this.state.totalUnitTestScore}</Text>
                  </Col>
                </Grid>
              </Body>
            </CardItem>
          </Card>
        </View>
      </Content>
    );
  }

  async resetDB() {
    Alert.alert("Reset DB", "Reset DB requires app reset. Reset now?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          // db = null;
          // await FileSystem.deleteAsync(
          //   FileSystem.documentDirectory + "SQLite/"
          // );

          // if (
          //   !(
          //     await FileSystem.getInfoAsync(
          //       FileSystem.documentDirectory + "SQLite"
          //     )
          //   ).exists
          // ) {
          //   await FileSystem.makeDirectoryAsync(
          //     FileSystem.documentDirectory + "SQLite"
          //   );
          // }
          // await FileSystem.downloadAsync(
          //   Asset.fromModule(require("./assets/db/andruino.db")).uri,
          //   FileSystem.documentDirectory + "SQLite/andruino.db"
          // );
          // db = SQLite.openDatabase("andruino.db");
          db.transaction(
            (tx) => {
              tx.executeSql(
                "drop table if exists user;",
                [],
                (ax) => {},
                (x) => console.log(x)
              );
              tx.executeSql(
                "create table if not exists user ( id integer primary key, name text, school text, teacher text, quizData text, projectData text, lessonData text);",
                [],
                (ax) => {
                  //console.log("===== TABLE USER CREATED =====");
                },
                (x) => console.log(x)
              );
              tx.executeSql(
                "drop table if exists quiz;",
                [],
                (ax) => {},
                (x) => console.log(x)
              );
              tx.executeSql(
                "create table if not exists quiz ( id integer primary key, quizId integer, answer text);",
                [],
                (ax) => {
                  //console.log("===== TABLE QUIZ CREATED =====");
                },
                (x) => console.log(x)
              );
              tx.executeSql(
                "drop table if exists settings;",
                [],
                (ax) => {},
                (x) => console.log(x)
              );
              tx.executeSql(
                "create table if not exists settings ( id integer primary key, isNew integer default 1, hasFileAccess integer default 0 );",
                [],
                (ax) => {
                  //console.log("===== TABLE QUIZ CREATED =====");
                },
                (x) => console.log(x)
              );
              tx.executeSql(`select * from user`, [], (_, { rows }) => {
                //console.log("===== DATA =====");
                //console.log(rows._array[0]);
              });
            },
            null,
            () => {
              Restart();
            }
          );
        },
      },
    ]);

    // console.log(
    //   await FileSystem.readDirectoryAsync(
    //     FileSystem.documentDirectory + "SQLite/"
    //   )
    // );
  }

  loadHome() {
    return (
      <ScrollView>
        <Container
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flex: 1, paddingTop: 30 }}>
            <Image
              style={{
                width: "50%",
                height: "50%",
                alignSelf: "center",
              }}
              resizeMode="center"
              source={require("@expo/../../assets/icon.png")}
            />

            <Text style={{ textAlign: "justify", padding: 15 }}>
              In this Application, the learners can see predefined images with
              explanations, and code snippets, which they can copy and paste
              into the Arduino IDE. Mobile Application for Learning Arduino Uno
              can help the students learn the Arduino Uno without connecting to
              WiFi. The app will contain lessons on Arduino Uno that are needed
              to know. Additionally, it will include quizzes and user’s
              performance to provide feedback.
            </Text>

            <Text style={{ textAlign: "justify", padding: 15 }}>
              Version 1.1.1
            </Text>
            <Button
              full
              warning
              style={{ margin: 20 }}
              onPress={(x) => {
                this.resetDB(x);
              }}
            >
              <Text>Reset DB</Text>
            </Button>
          </View>
        </Container>
      </ScrollView>
    );
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{}}>
          <Header style={{ paddingLeft: 35 }} hasTabs>
            {/* <Left>
              <Button transparent>
                <Icon name="arrow-back" />
              </Button>
            </Left> */}
            <Body>
              <Title>Andruino</Title>
            </Body>
          </Header>
        </View>
        <View style={{ flex: 10 }}>
          {((x) => {
            switch (this.state.selectedPage) {
              case "home":
                return this.loadHome();
              case "profile":
                return this.loadProfile();
              case "study":
                return this.loadTab();
              case "score":
                return this.loadScore();
              default:
                return this.loadHome();
            }
          })()}
        </View>

        <View style={{}}>
          <Footer style={{}}>
            <FooterTab>
              <Button
                badge
                vertical
                info={this.state.selectedPage === "home"}
                onPress={(x) => {
                  this.setState({
                    selectedPage: "home",
                  });
                }}
              >
                {/* <Badge>
                  <Text>1</Text>
                </Badge> */}
                <Ionicons name="home" size={24} color="black" />
                <Text>HOME</Text>
              </Button>
              <Button
                badge
                onPress={(x) => {
                  this.setState({
                    selectedPage: "study",
                  });
                }}
                vertical
                info={this.state.selectedPage === "study"}
              >
                {/* <Badge>
                  <Text>1</Text>
                </Badge> */}
                <Entypo name="open-book" size={24} color="black" />
                <Text>STUDY</Text>
              </Button>
              <Button
                badge
                vertical
                info={this.state.selectedPage === "score"}
                onPress={(x) => {
                  this.loadScoreData();
                  this.setState({
                    selectedPage: "score",
                  });
                }}
              >
                {/* <Badge>
                  <Text>1</Text>
                </Badge> */}
                <Entypo name="progress-full" size={24} color="black" />
                <Text>SCORES</Text>
              </Button>

              <Button
                badge
                vertical
                info={this.state.selectedPage === "profile"}
                onPress={(x) => {
                  this.setState({
                    selectedPage: "profile",
                  });
                  this.getProfileInfo();
                }}
              >
                {/* <Badge>
                  <Text>1</Text>
                </Badge> */}
                <Entypo name="user" size={24} color="black" />
                <Text>PROFILE</Text>
              </Button>
            </FooterTab>
          </Footer>
        </View>
      </SafeAreaView>
    );
  }
}
