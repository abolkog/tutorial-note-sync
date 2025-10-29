import { Route, Routes } from 'react-router';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/react-router';

function ProtectedMainPage() {
  return (
    <>
      <SignedIn>
        <MainPage />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<ProtectedMainPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<RegisterPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
