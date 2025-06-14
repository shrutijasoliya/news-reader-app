import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { bookmarkManager } from "../src/utils/bookmarkManager";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 280;

export default function ArticleDetail() {
  const { article: articleParam } = useLocalSearchParams();
  const article = JSON.parse(articleParam);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();

  const checkBookmarkStatus = async () => {
    const bookmarked = await bookmarkManager.isBookmarked(article.article_id);
    setIsBookmarked(bookmarked);
  };

  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleReadMore = () => {
    Linking.openURL(article.link);
  };

  const handleBookmarkPress = async () => {
    const newBookmarkStatus = await bookmarkManager.toggleBookmark(article);
    setIsBookmarked(newBookmarkStatus);
  };

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />
      <Animated.View
        style={[
          styles.headerImageContainer,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: imageOpacity,
          },
        ]}
      >
        <Image
          source={{ uri: article.image_url }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBookmarkPress}
              style={styles.bookmarkButton}
            >
              <MaterialIcons
                name={isBookmarked ? "bookmark" : "bookmark-border"}
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.sourceContainer}>
              <MaterialIcons
                name="article"
                size={16}
                color="#666"
                style={styles.sourceIcon}
              />
              <Text style={styles.source}>{article.source_id}</Text>
            </View>
            <View style={styles.dateContainer}>
              <MaterialIcons
                name="access-time"
                size={16}
                color="#666"
                style={styles.dateIcon}
              />
              <Text style={styles.date}>
                {new Date(article.pubDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Text style={styles.description}>{article.description}</Text>
          <Text style={styles.contentText}>{article.content}</Text>

          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={handleReadMore}
            activeOpacity={0.8}
          >
            <Text style={styles.readMoreText}>Read Full Article</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#007AFF" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1,
  },
  headerImage: {
    width: width,
    height: HEADER_HEIGHT,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 100,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    minHeight: height - HEADER_HEIGHT,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bookmarkButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
    lineHeight: 32,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceIcon: {
    marginRight: 4,
  },
  source: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    marginRight: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 24,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 16,
    color: "#007AFF",
    marginRight: 8,
    fontWeight: "600",
  },
});
