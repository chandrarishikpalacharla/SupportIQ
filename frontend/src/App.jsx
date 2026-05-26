import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./context/AuthContext"
import { store } from "./store/index"
import AppRoutes from "./routes/AppRoutes"

const queryClient = new QueryClient()

const App = () => (
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes/>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
)

export default App
