import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
function CarouselComponent({itemPost, height}) {
    const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 0 },
    items: 1
  }
};
const CustomDot = ({ onClick, post, ...rest }) => {
  const {
    onMove,
    index,
    active,
    carouselState: { currentSlide, deviceType }
  } = rest;
  const carouselItems = post;
  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  return (
    <div className='justify-end flex items-end'>
      <button className={active ? "activeDot" : "inactiveDot"} />
    </div>
    
    
  );
};
  return (
    <Carousel responsive={responsive} swipeable
    draggable={false}
    showDots={true}
    customDot={<CustomDot post={itemPost}/>}
    ssr={true}
    transitionDuration={500}>
    {itemPost.map((e, index) => (
      <div key={index} className="px-5 pb-5">
        <img src={e.post} style={height ? {height: height} : {height: 304, width: 304}} className="object-cover w-full rounded-md" />
      </div>
    ))}
  </Carousel>
  )
}

export default CarouselComponent