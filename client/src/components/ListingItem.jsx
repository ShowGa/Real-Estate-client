import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed } from "react-icons/fa6";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white gap-4 shadow-md hover:shadow-2xl transition-all duration-200 overflow-hidden rounded-lg w-full sm:w-[290px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="h-[320px] sm:h-[200px] w-full object-cover hover:scale-105 transition-scale duration-300"
          src={listing.imageURL[0]}
          alt="listing Image"
        />
        <div className="mt-1 p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex flex-col font-semibold">
            <div className="flex items-center gap-2 text-red-900">
              <FaBed />
              <p>
                {listing.bedrooms}
                {listing.bedrooms > 1 ? " Beds" : " Bed"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sky-900">
              <FaBath />
              <p>
                {listing.bathrooms}
                {listing.bathrooms > 1 ? " Baths" : " Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
