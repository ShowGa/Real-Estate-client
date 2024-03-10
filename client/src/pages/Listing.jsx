import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingService from "../services/listing-service";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { HiOutlineChatAlt } from "react-icons/hi";
import { useSelector } from "react-redux";
import ContactBox from "../components/ContactBox";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const { currentUser } = useSelector((state) => {
    return state.user;
  });
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  console.log(windowWidth);

  // function
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    // addEventListener to the window resize
    window.addEventListener("resize", handleWindowWidth);

    ListingService.getListing(params.listingId)
      .then((res) => {
        setLoading(false);
        if (res.success === false) {
          setError(true);
          return;
        }
        setListing(res.data);
        setError(false);
      })
      .catch((e) => {
        setError(true);
        setLoading(false);
      });

    return () => {
      window.removeEventListener("resize", handleWindowWidth);
    };
  }, []);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">
          Ops ! Error happened when loading the page
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageURL.map((url) => {
              return (
                <SwiperSlide key={url}>
                  <div
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                      height: `${Math.floor(windowWidth * 0.4)}px`,
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Copied !
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  $
                  {(
                    +listing.regularPrice - +listing.discountPrice
                  ).toLocaleString("en-US")}{" "}
                  OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="flex flex-wrap items-center gap-4 text-green-900 font-semibold text-sm sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? `Parking` : ""}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.furnished ? "Furnished" : ""}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => {
                  setContact(true);
                }}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 flex items-center justify-center gap-2 font-bold"
              >
                <HiOutlineChatAlt className="text-2xl" />
                <span>Contact landlord</span>
              </button>
            )}
            {contact && <ContactBox listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
