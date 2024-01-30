import React from 'react';
import RatingStars from 'react-rating-stars-component';

export const Rating = ({ averageRating, onRatingChange }) => {
    return (
        <div className={"rating-wrapper"}>
            <RatingStars
                count={5}
                value={averageRating}
                size={24}
                edit={false}
                isHalf={true}
                activeColor="#ffd700"
                color={"lightgray"}
            />
            <p>{averageRating}</p>
        </div>
    );
};