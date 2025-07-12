import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import MarketOverview from '../components/MarketOverview'
import CallToAction from '../components/CallToAction'

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <MarketOverview />
      <Features />
      <CallToAction />
    </>
  )
}

export default HomePage