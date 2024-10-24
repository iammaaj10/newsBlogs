import React from 'react';
import Blog from '../components/Blog';
import NewsSection from '../components/NewsSection';
import Entertainmentnews from '../components/Entertainmentnews';
import SportsSection from '../components/SportsSection';
import Tech from '../components/Tech';
import Business from '../components/Business';

const RenderComponent = ({ index, selected, setSelected }) => {
  switch(index) {
    case 0:
      return <NewsSection />;
    case 1:
      return <Tech />;
    case 2:
      return <Entertainmentnews />;
    case 3:
      return  <SportsSection />;

    case 4 :
        return <Business/> 
    default:
      return null;
  }
};

export default RenderComponent;
