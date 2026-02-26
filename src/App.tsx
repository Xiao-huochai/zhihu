import "./app.less";
import { HashRouter } from "react-router-dom";
import RouterView from "./router";
import store from "./store";
function App() {
  return (
    <HashRouter>
      <RouterView />
    </HashRouter>
  );
}

export default App;
