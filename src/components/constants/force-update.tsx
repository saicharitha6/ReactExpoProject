/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import VersionCheck from "react-native-version-check";

interface ForceUpdatePlayStoreState {
  showPopup: boolean;
  curVersion: string;
  newVersion: string;
}

class ForceUpdatePlayStore extends PureComponent<{}, ForceUpdatePlayStoreState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showPopup: false,
      curVersion: "",
      newVersion: "",
    };
  }

  componentDidMount() {
    try {
      this.processVersionCheck();
    } catch (error) {
      this.setState({ showPopup: false });
    }
  }

  processVersionCheck() {
    VersionCheck.getCountry().then((country: any) => console.log(country));
    let packageName = VersionCheck.getPackageName();
    let currentBuildNumber = VersionCheck.getCurrentBuildNumber();
    let currentVersion = VersionCheck.getCurrentVersion();
    var version = currentVersion + "." + currentBuildNumber;
    VersionCheck.getLatestVersion()
      .then((latestVersion: string) => {
        this.setState({ newVersion: latestVersion ? latestVersion : "" });
      })
      .catch((err: any) => {
        console.log("Get Latest VersionCheck Error", err);
      });
    VersionCheck.needUpdate().then(async (res: { isNeeded: any; }) => {
      if (res && res.isNeeded) {
        this.setState({ showPopup: true, curVersion: version });
      }
    });
  }

  render() {
    if (!this.state.showPopup) {
      return <View></View>;
    }
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          // console.log("close modal");
        }}
        style={styles.modalContainer}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Update Available</Text>
              <Text style={styles.versionText}>
                Current Version : {this.state.curVersion} 
              </Text>
            </View>
            <Text style={styles.description}>
              A New Version ({this.state.newVersion}) of this app is available
              for download. Please Update it from{" "}
              {Platform.OS == "android" ? "play store" : "app store"}.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    showPopup: false,
                  });
                }}
                style={{
                  backgroundColor: "f3f3f3",
                  color: "#000",
                  justifyContent: "flex-end",
                  shadowColor: "transparent",
                  shadowOpacity: 0,
                  shadowOffset: { height: 0, width: 0 },
                  elevation: 0,
                  marginRight: 20
              }}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              {Platform.OS === "android" && (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      "https://play.google.com/store/apps/details?id=com.schedula&hl=en&gl=US"
                    )
                      .then(() => {
                        this.setState({
                          showPopup: false,
                        });
                      })
                      .catch((err) =>
                        console.log("Error Navigating to Play Store", err)
                      );
                  }}
                     style={styles.updateButton}
                >
                  <Text style={styles.buttonText}>UPDATE</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.4)",
    margin: 0,
  },
 popupContainer: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: 200,
  },
  popupContent: {
    backgroundColor: "white",
    padding: 20,
    elevation: 10,
    shadowColor: "#f3f3f3",
    margin: 18,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
    color: "#313131",
  },
  versionText: {
    fontFamily: "Roboto-Bold",
    fontSize: 12,
    color: "#313131",
  },
  description: {
    marginTop: 18,
    fontFamily: "Roboto-light",
    fontSize: 15,
    color: "#505050",
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  button: {
    // justifyContent: "flex-end",
    // shadowColor: "transparent",
    // shadowOpacity: 0,
    // shadowOffset: { height: 0, width: 0 },
    // elevation: 0,
    // marginRight: 20,
    // borderRadius: 5,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
  },
  closeButton: {
    backgroundColor: "#f3f3f3",
    color: "#000",
  },
  updateButton: {
    backgroundColor: "f3f3f3",
    color: "#000",
    justifyContent: "flex-end",
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowOffset: { height: 0, width: 0 },
    elevation: 0,
  },
  buttonText: {
    color: "#61B4AC",
    fontSize: 16,
  },
});

export default ForceUpdatePlayStore;