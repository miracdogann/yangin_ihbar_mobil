import { Tabs } from "expo-router";
import React from "react";
import { Image, Dimensions, View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Icon imports
import MapIcon from "@/assets/icons/map.png";
import UserIcon from "@/assets/icons/user.png";
import InfoIcon from "@/assets/icons/info.png";
import FireIcon from "@/assets/icons/map-fire.png";
import StationsIcon from "@/assets/icons/stations.png";

const { width } = Dimensions.get("window");

const ICON_SIZE = 30;
const ICON_WRAPPER_SIZE = 50;
const CENTER_ICON_WRAPPER_SIZE = 72;
const CENTER_ICON_SIZE = 50;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const TAB_HEIGHT = 60;
  const TAB_MARGIN = width * 0.05;
  const TAB_BORDER_RADIUS = width * 0.1;
  const TAB_BOTTOM_OFFSET = -15;

  const renderTabIcon = (source, focused, isCenter = false) => (
    <View
      style={[
        styles.iconWrapper,
        isCenter && styles.centerIconWrapper,
        Platform.select({
          ios: styles.shadowIos,
          android: styles.shadowAndroid,
        }),
      ]}
    >
      <Image
        source={source}
        style={[
          isCenter ? styles.centerIcon : styles.icon,
          !isCenter && { tintColor: focused ? "#0000FF" : "#0000ff8c" },
        ]}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        animation: "fade",
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: TAB_BOTTOM_OFFSET + insets.bottom,
            borderRadius: TAB_BORDER_RADIUS,
            left: TAB_MARGIN,
            right: TAB_MARGIN,
            height: TAB_HEIGHT,
            paddingHorizontal: width * 0.02,
            margin: 25,
          },
          Platform.select({
            ios: styles.shadowIos,
            android: styles.shadowAndroid,
          }),
        ],
      }}
    >
      <Tabs.Screen
        name="Stations"
        options={{
          title: "İstasyon",
          tabBarIcon: ({ focused }) => renderTabIcon(StationsIcon, focused),
        }}
      />
      <Tabs.Screen
        name="Fires"
        options={{
          title: "Yangınlar",
          tabBarIcon: ({ focused }) => renderTabIcon(FireIcon, focused),
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          title: "Harita",
          tabBarIcon: ({ focused }) => renderTabIcon(MapIcon, focused, true),
          tabBarItemStyle: {
            zIndex: 2,
          },
        }}
      />
      <Tabs.Screen
        name="Info"
        options={{
          title: "Bilgiler",
          tabBarIcon: ({ focused }) => renderTabIcon(InfoIcon, focused),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: "Hesap",
          tabBarIcon: ({ focused }) => renderTabIcon(UserIcon, focused),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  iconWrapper: {
    width: ICON_WRAPPER_SIZE,
    height: ICON_WRAPPER_SIZE,
    borderRadius: 999,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    margin: -15,
  },
  centerIconWrapper: {
    width: CENTER_ICON_WRAPPER_SIZE,
    height: CENTER_ICON_WRAPPER_SIZE,
    marginTop: -30,
    elevation: 8,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  centerIcon: {
    width: CENTER_ICON_SIZE,
    height: CENTER_ICON_SIZE,
  },
  shadowIos: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  shadowAndroid: {
    elevation: 6,
  },
});
