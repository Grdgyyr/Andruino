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
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Container>
        <SafeAreaView style={styles.container}>
          <Header hasTabs>
            <Body>
              <Title>Arduino Uno</Title>
            </Body>
          </Header>

          <Content>
            <Tabs>
              <Tab heading="LESSONS">
                <Lessons />
              </Tab>
              <Tab heading="QUIZZES"></Tab>
              <Tab heading="ACTIVITIES">
                <Projects />
              </Tab>
            </Tabs>
          </Content>
          <Footer>
            <FooterTab>
              <Button badge vertical>
                <Badge>
                  <Text>1</Text>
                </Badge>
                <Entypo name="open-book" size={24} color="black" />
                <Text>STUDY</Text>
              </Button>
              <Button badge vertical>
                <Badge>
                  <Text>1</Text>
                </Badge>
                <Entypo name="progress-full" size={24} color="black" />
                <Text>PERFORMANCE</Text>
              </Button>
              <Button badge vertical>
                <Badge>
                  <Text>1</Text>
                </Badge>
                <Ionicons name="notifications" size={24} color="black" />
                <Text>NOTIFICATIONS</Text>
              </Button>
              <Button badge vertical>
                <Badge>
                  <Text>1</Text>
                </Badge>
                <Entypo name="user" size={24} color="black" />
                <Text>PROFILE</Text>
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
