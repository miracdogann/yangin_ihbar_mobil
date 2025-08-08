import { Tabs } from "expo-router";
import React from "react";
import { Image, Dimensions, View } from "react-native";
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

  const renderTabIcon = (source, focused, isCenter = false) => {
    return (
      <View
        style={{
          width: isCenter ? CENTER_ICON_WRAPPER_SIZE : ICON_WRAPPER_SIZE,
          height: isCenter ? CENTER_ICON_WRAPPER_SIZE : ICON_WRAPPER_SIZE,
          borderRadius: 999,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          marginTop: isCenter ? -30 : 5, // Changed from 0 to 5 for non-center icons
          elevation: isCenter ? 8 : 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          margin: -15,
        }}
      >
        <Image
          source={source}
          style={{
            width: isCenter ? CENTER_ICON_SIZE : ICON_SIZE,
            height: isCenter ? CENTER_ICON_SIZE : ICON_SIZE,
            resizeMode: "contain",
            ...(isCenter
              ? {}
              : {
                  tintColor: focused ? "#0000FF" : "#0000ff8c",
                }),
          }}
        />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderRadius: TAB_BORDER_RADIUS,
          position: "absolute",
          bottom: TAB_BOTTOM_OFFSET + insets.bottom,
          left: TAB_MARGIN,
          right: TAB_MARGIN,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          height: TAB_HEIGHT,
          paddingHorizontal: width * 0.02,
          margin: 25,
        },
      }}
    >
      <Tabs.Screen
        name="Stations"
        options={{
          title: "İstasyon",
          tabBarIcon: ({ focused }) =>
            renderTabIcon(StationsIcon, focused, false),
        }}
      />
      <Tabs.Screen
        name="Fires"
        options={{
          title: "Yangınlar",
          tabBarIcon: ({ focused }) => renderTabIcon(FireIcon, focused, false),
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
          tabBarIcon: ({ focused }) => renderTabIcon(InfoIcon, focused, false),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: "Hesap",
          tabBarIcon: ({ focused }) => renderTabIcon(UserIcon, focused, false),
        }}
      />
    </Tabs>
  );
}
