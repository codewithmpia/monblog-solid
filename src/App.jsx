import { ErrorBoundary } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { MetaProvider, Meta } from "@solidjs/meta";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Post from "./pages/Post";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <MetaProvider>
      <Meta name="author" content="codewithmpia" />
      <Meta name="description" content="Blog personnel sur le développement web, tutoriels de programmation et actualités tech" />
      <Meta name="keywords" content="développement web, programmation, tutoriels, technologie, javascript, react, solid" />
      <Meta name="robots" content="index, follow" />
      <Meta name="language" content="French" />
      <Meta property="og:title" content="codewithmpia" />
      <Meta property="og:description" content="Blog personnel sur le développement web, tutoriels de programmation et actualités tech" />
      <Meta property="og:type" content="website" />
      <ErrorBoundary fallback={(error) => <Error message={error.message} />}>
        <Router root={Layout}>
          <Route path="/" component={() => (
            <ErrorBoundary fallback={(error) => <Error message={error.message} />}>
              <Index />
            </ErrorBoundary>
          )} />
          <Route path="/:slug" component={() => (
            <ErrorBoundary fallback={(error) => <Error message={error.message} />}>
              <Post />
            </ErrorBoundary>
          )} />
          <Route path="*" component={NotFound} />
        </Router>
      </ErrorBoundary>
    </MetaProvider>
  )
}

export default App;