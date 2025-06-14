import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NewsCard from "../../src/components/NewsCard";
import { bookmarkManager } from "../../src/utils/bookmarkManager";

export default function BookmarksScreen() {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadBookmarks = async () => {
    try {
      const bookmarks = await bookmarkManager.getBookmarks();
      setBookmarkedArticles(bookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const handleArticlePress = (article) => {
    router.push({
      pathname: "/article",
      params: { article: JSON.stringify(article) },
    });
  };

  const handleBookmarkPress = async (article) => {
    await bookmarkManager.toggleBookmark(article);
    loadBookmarks();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (bookmarkedArticles.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No bookmarked articles yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedArticles}
        renderItem={({ item }) => (
          <NewsCard
            article={item}
            onPress={() => handleArticlePress(item)}
            onBookmarkPress={() => handleBookmarkPress(item)}
            isBookmarked={true}
          />
        )}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.article_id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
