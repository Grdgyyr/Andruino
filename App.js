import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
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
} from "native-base";
import * as Font from "expo-font";
import { Ionicons, Entypo, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Projects from "./Pages/Projects";
import Lessons from "./Pages/Lessons";
import Quiz from "./Pages/Quiz";
import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import { defaultQuizData } from "./quizAns";
const screenWidth = Dimensions.get("window").width;
const data = {
  labels: ["Unit Test", "Quizzes"], // optional
  data: [0.4, 0.6],
};
const chartConfig = {
  backgroundGradientFrom: "#7a7a7a",
  //backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#7a7a7a",
  //backgroundGradientToOpacity: 0.5,

  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};
let db = null;

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
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });

    if (
      !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
        .exists
    ) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "SQLite"
      );
    }
    // await FileSystem.downloadAsync(
    //   Asset.fromModule(require("./assets/db/andruino.db")).uri,
    //   FileSystem.documentDirectory + "SQLite/andruino.db"
    // );
    db = SQLite.openDatabase("andruino.db");
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

  loadScoreData() {
    let labels = [];
    defaultQuizData.forEach((e) => {
      labels.push(e.name.replace("uiz", ""));
      //console.log(e.name.);
    });
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
            data={data}
            width={screenWidth}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        </View>
      </Content>
    );
  }

  async resetDB() {
    db = null;
    await FileSystem.deleteAsync(FileSystem.documentDirectory + "SQLite/");

    if (
      !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
        .exists
    ) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "SQLite"
      );
    }
    await FileSystem.downloadAsync(
      Asset.fromModule(require("./assets/db/andruino.db")).uri,
      FileSystem.documentDirectory + "SQLite/andruino.db"
    );
    db = SQLite.openDatabase("andruino.db");
    // console.log(
    //   await FileSystem.readDirectoryAsync(
    //     FileSystem.documentDirectory + "SQLite/"
    //   )
    // );
  }

  loadHome() {
    return (
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
            explanations, and code snippets, which they can copy and paste into
            the Arduino IDE. Mobile Application for Learning Arduino Uno can
            help the students learn the Arduino Uno without connecting to WiFi.
            The app will contain lessons on Arduino Uno that are needed to know.
            Additionally, it will include quizzes and user’s performance to
            provide feedback.
          </Text>
          <Button
            onPress={(x) => {
              this.resetDB(x);
            }}
          >
            <Text>Reset DB</Text>
          </Button>
        </View>
      </Container>
    );
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{}}>
          <Header style={{}} hasTabs>
            <Left>
              <Button transparent>
                <Icon name="arrow-back" />
              </Button>
            </Left>
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
                <Text>PERFORMANCE</Text>
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
