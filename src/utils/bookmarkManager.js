import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKMARKS_KEY = "@news_reader_bookmarks";

export const bookmarkManager = {
  // Get all bookmarked articles
  getBookmarks: async () => {
    try {
      const bookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error("Error getting bookmarks:", error);
      return [];
    }
  },

  // Check if an article is bookmarked
  isBookmarked: async (articleId) => {
    try {
      const bookmarks = await bookmarkManager.getBookmarks();
      return bookmarks.some((bookmark) => bookmark.article_id === articleId);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return false;
    }
  },

  // Toggle bookmark status
  toggleBookmark: async (article) => {
    try {
      const bookmarks = await bookmarkManager.getBookmarks();
      const isBookmarked = bookmarks.some(
        (bookmark) => bookmark.article_id === article.article_id
      );

      let newBookmarks;
      if (isBookmarked) {
        newBookmarks = bookmarks.filter(
          (bookmark) => bookmark.article_id !== article.article_id
        );
      } else {
        newBookmarks = [...bookmarks, article];
      }

      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
      return !isBookmarked;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      return false;
    }
  },
};
