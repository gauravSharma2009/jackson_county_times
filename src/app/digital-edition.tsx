import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const EDITION_URL = 'https://digital.jacksoncountytimes.news/sub/account_login.php';

export default function DigitalEditionScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: EDITION_URL }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#1565C0" />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
