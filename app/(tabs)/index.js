import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import NewsCard from "../../src/components/NewsCard";
import { bookmarkManager } from "../../src/utils/bookmarkManager";
import { newsApi } from "../../src/services/newsApi";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const router = useRouter();

  const fetchNews = async () => {
    try {
      const data = await newsApi.getTopHeadlines();
      setArticles(data.results || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const bookmarks = await bookmarkManager.getBookmarks();
      setBookmarkedArticles(new Set(bookmarks.map((b) => b.article_id)));
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
    loadBookmarks();
  };

  const handleArticlePress = (article) => {
    router.push({
      pathname: "/article",
      params: { article: JSON.stringify(article) },
    });
  };

  const handleBookmarkPress = async (article) => {
    const newBookmarkStatus = await bookmarkManager.toggleBookmark(article);
    if (newBookmarkStatus) {
      setBookmarkedArticles((prev) => new Set([...prev, article.article_id]));
    } else {
      setBookmarkedArticles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(article.article_id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />
      <FlatList
        data={articles}
        renderItem={({ item }) => (
          <NewsCard
            article={item}
            onPress={() => handleArticlePress(item)}
            onBookmarkPress={() => handleBookmarkPress(item)}
            isBookmarked={bookmarkedArticles.has(item.article_id)}
          />
        )}
        keyExtractor={(item) => item.article_id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
});
