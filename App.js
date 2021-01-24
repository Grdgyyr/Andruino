import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
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
} from "native-base";
import * as Font from "expo-font";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import Projects from "./Pages/Projects";
import Lessons from "./Pages/Lessons";
import Quiz from "./Pages/Quiz";
import * as SQLite from "expo-sqlite";
//const db = SQLite.openDatabase("andruino.db");
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

const dataArray = [
  { title: "First Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Third Element", content: "Lorem ipsum dolor sit amet" },
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      content: <></>,
      selectedPage: "",
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
    this.loadHome();

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
    let db = SQLite.openDatabase("andruino.db");

    //console.log(defaultQuizData);

    db.transaction(
      (tx) => {
        // tx.executeSql("insert into user (done, value) values (0, ?)", []);
        tx.executeSql("select * from user", [], (_, { rows }) =>
          console.log(rows)
        );
      },
      (x) => console.log(x)
    );
  }

  loadTab() {
    this.setState({
      content: (
        <Tabs>
          <Tab heading="LESSONS">
            <Lessons />
          </Tab>
          <Tab heading="QUIZZES">
            <Quiz />
          </Tab>
          <Tab heading="ACTIVITIES">
            <Projects />
          </Tab>
        </Tabs>
      ),
      selectedPage: "study",
    });
  }
  loadProfile() {
    this.setState({
      content: (
        <Content>
          <Text>Profile With Picture</Text>
        </Content>
      ),
      selectedPage: "profile",
    });
  }
  loadScore() {
    this.setState({
      content: (
        <Content>
          <Text>Scores</Text>
        </Content>
      ),
      selectedPage: "score",
    });
  }

  async loadHome() {
    this.setState({
      content: (
        <Container
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Text>Homes Page</Text>
        </Container>
      ),
      selectedPage: "home",
    });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Container>
        <SafeAreaView style={styles.container}>
          <Header hasTabs>
            <Left>
              <Button transparent>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Andruino</Title>
            </Body>
          </Header>

          <Content>{this.state.content}</Content>
          <Footer>
            <FooterTab>
              <Button
                badge
                onPress={(x) => this.loadTab()}
                vertical
                info={this.state.selectedPage === "study"}
              >
                <Badge>
                  <Text>1</Text>
                </Badge>
                <Entypo name="open-book" size={24} color="black" />
                <Text>STUDY</Text>
              </Button>
              <Button
                badge
                vertical
                info={this.state.selectedPage === "score"}
                onPress={(x) => this.loadScore()}
              >
                <Badge>
                  <Text>1</Text>
                </Badge>
                <Entypo name="progress-full" size={24} color="black" />
                <Text>PERFORMANCE</Text>
              </Button>

              <Button
                badge
                vertical
                info={this.state.selectedPage === "profile"}
                onPress={(x) => this.loadProfile()}
              >
                <Badge>
                  <Text>1</Text>
                </Badge>
                <Entypo name="user" size={24} color="black" />
                <Text>PROFILE</Text>
              </Button>
              <Button
                badge
                vertical
                info={this.state.selectedPage === "home"}
                onPress={(x) => this.loadHome()}
              >
                <Badge>
                  <Text>1</Text>
                </Badge>
                <Ionicons name="home" size={24} color="black" />
                <Text>HOME</Text>
              </Button>
            </FooterTab>
          </Footer>
        </SafeAreaView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor: "#E6E6E6",
  },
  listContainer: {
    alignItems: "center",
  },
  /******** card **************/
  card: {
    marginHorizontal: 2,
    marginVertical: 2,
    flexBasis: "48%",
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 70,
    width: 70,
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 12,
    flex: 1,
    color: "#FFFFFF",
  },
  icon: {
    height: 20,
    width: 20,
  },
});
