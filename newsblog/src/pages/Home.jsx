import React, { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import RenderComponent from '../components/RenderComponent';
import Blog from '../components/Blog';
import Fashion from '../components/Fashion';

const Home = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <HeroBanner />
      <Blog selected={selected} setSelected={setSelected} />
      <RenderComponent index={selected} selected={selected} setSelected={setSelected} />
      <Fashion />
    </div>
  );
};

export default Home;
