
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthWrapper, SignInPage, SignUpPage } from "@/components/auth";
import { ExpensesProvider } from "@/hooks/useExpenses";
import Home from "@/pages/Index";
import ProfilePage from "@/pages/Profile";
import FriendsPage from "@/pages/Friends";
import NotFound from "@/pages/NotFound";
import { Header } from './components/Header';

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <ThemeProvider defaultTheme="dark" storageKey="expense-tracker-theme">
            <Routes>
              <Route path="/login" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path="/*"
                element={
                  <AuthWrapper>
                    <ExpensesProvider>
                      <Header />
                      <div className="outer-container">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/friends" element={<FriendsPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                      <Toaster />
                    </ExpensesProvider>
                  </AuthWrapper>
                }
              />
            </Routes>
          </ThemeProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
