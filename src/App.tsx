import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// ---- Pages ----
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Prompts from "./pages/Prompts";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Chat from "./pages/Chat";
import MyPrompts from "./pages/MyPrompts";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import FreePromptPackPage from "./pages/FreePromptPackPage"; // ✅ import your new page

// ---- Protected Route Wrapper ----
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth() as { user: any; loading?: boolean };
  const location = useLocation();

  // optional: show loader while checking auth
  if (loading) return null;

  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* ---- Public Routes ---- */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />

              {/* ---- Authenticated Routes ---- */}
              <Route
                path="/prompts"
                element={
                  <ProtectedRoute>
                    <Prompts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/my-prompts"
                element={
                  <ProtectedRoute>
                    <MyPrompts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />

              {/* ✅ New Free Prompt Pack Route */}
              <Route
                path="/free-prompt-pack"
                element={
                  <ProtectedRoute>
                    <FreePromptPackPage />
                  </ProtectedRoute>
                }
              />

              {/* ---- Catch-all ---- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
