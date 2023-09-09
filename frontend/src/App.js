import AllRoutes from "./Routes/AllRoutes";
import { TaskProvider } from "./Util/TaskContext";

function App() {
  return (
    <div className="App">
      <TaskProvider>
        <AllRoutes />
      </TaskProvider>
    </div>
  );
}

export default App;
