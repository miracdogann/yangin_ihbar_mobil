import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";

const logos = [
  require("@/assets/logos/FullLogoOrg.png"),
  require("@/assets/logos/@XRLAB.MCBU_trans.png"),
  require("@/assets/logos/TextBlack.png"),
  require("@/assets/logos/MYOLogo.png"),

  require("@/assets/logos/TextBlack.png"),
];

const { width } = Dimensions.get("window");

export default function AutoScrollingLogos() {
  const scrollRef = useRef(null);

  useEffect(() => {
    let offset = 0;
    const logoWidth = width * 0.25 + 10; // logo width + margin
    const totalWidth = logos.length * logoWidth;

    const interval = setInterval(() => {
      offset += 1; // piksel piksel kaydır
      if (offset > totalWidth) offset = 0;
      scrollRef.current?.scrollTo({ x: offset, animated: false });
    }, 16); // 60 fps

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // kullanıcı müdahalesine kapalı
        contentContainerStyle={styles.scrollContent}
      >
        {logos.concat(logos).map((logo, index) => (
          <Image key={index} source={logo} style={styles.logo} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 0,
    height: 200,
  },
  scrollContent: {
    alignItems: "center",
  },
  logo: {
    width: width * 0.25,
    height: 80,
    resizeMode: "contain",
    marginRight: 10, // logolar arası mesafe
  },
});
