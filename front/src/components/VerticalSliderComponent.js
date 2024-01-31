import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// ...import all necessary components and images

// Slider settings for vertical scroll
const settings = {
    dots: true,
    infinite: true,
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    // ... other settings you might need
};

export const VerticalSliderComponent = ({ children }) => {
    return (
        <Slider {...settings}>
            {children}
        </Slider>
    );
};

