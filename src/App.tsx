import './App.css'
import Footer from '@/components/common/Footer';
import Header from '@/components/common/header';
import Main from '@/components/Main';

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <header className="flex-1 top-0 left-0 w-full flex flex-col items-center">
        <Header />
      </header>
      <div className="flex-1 w-full flex flex-col">
        <Main />
      </div>
      <footer className="mx-4 bg-white rounded-lg border border-black-200 px-4 py-2 w-full">
        <Footer />
      </footer>
    </main>
  );
}