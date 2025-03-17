import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
    return (
        <Router>
            <div className="App flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* Thêm các routes khác khi phát triển */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;