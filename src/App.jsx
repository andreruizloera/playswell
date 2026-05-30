import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CauseBanner from './components/CauseBanner'
import Home from './pages/Home'
import Browse from './pages/Browse'
import ListingDetail from './pages/ListingDetail'
import Sell from './pages/Sell'
import HowItWorks from './pages/HowItWorks'
import Market from './pages/Market'
import Analytics from './pages/Analytics'
import GradingCalc from './pages/GradingCalc'
import PackEV from './pages/PackEV'
import Portfolio from './pages/Portfolio'

export default function App() {
  return (
    <BrowserRouter basename="/playswell">
      <CauseBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/market" element={<Market />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/grading" element={<GradingCalc />} />
        <Route path="/pack-ev" element={<PackEV />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  )
}
