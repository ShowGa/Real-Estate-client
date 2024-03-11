import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingService from "../services/listing-service";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // function
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };
  const getListingFunction = (searchQuery) => {
    ListingService.getListings(searchQuery)
      .then((res) => {
        if (searchQuery === "offer=true&limit=4") {
          setOfferListings(res.data);
          return;
        }
        if (searchQuery === "type=sale&limit=4") {
          setSaleListings(res.data);
          return;
        }
        if (searchQuery === "type=rent&limit=4") {
          setRentListings(res.data);
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // addEventListener for the window
    window.addEventListener("resize", handleWindowWidth);

    // get offer Listings
    getListingFunction("offer=true&limit=4");
    // get type = sale Listings
    getListingFunction("type=sale&limit=4");
    // get type = rent Listings
    getListingFunction("type=rent&limit=4");

    // removerEventListener when rerender other page
    return () => {
      window.removeEventListener("resize", handleWindowWidth);
    };
  }, []);

  return (
    <div>
      {/* {top} */}
      <div className="flex flex-col gap-8 py-16 px-8 max-w-6xl mx-auto items-start">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your next <span className="text-slate-500">perfect</span>
          <br />
          place from RomaEstate
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          RomaEstate is the best choice for you finding a place to live .
          <br />
          We had already help over{" "}
          <span className="font-bold text-pink-400">69</span> Millons households
          find their dream place .
          <br />
          And it's your turn to be treated by our professional and intimate
          service .
        </div>
        <Link
          className="text-xs sm:text-sm font-bold text-green-800 p-2 border border-green-800 rounded-full hover:bg-green-800 hover:text-white transition-all duration-200"
          to={"/search"}
        >
          Start searching your dream place
        </Link>
      </div>
      {/* {swiper} */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => {
            return (
              <SwiperSlide>
                <div
                  style={{
                    background: `url(${listing.imageURL[0]}) center no-repeat`,
                    backgroundSize: "cover",
                    height: `${Math.floor(windowWidth * 0.28)}px`,
                  }}
                ></div>
              </SwiperSlide>
            );
          })}
      </Swiper>

      {/* {Listing result fro offer, sale, rent} */}
      <div className="mx-8 p-3 flex flex-col gap-8 my-10 box-border">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offer
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => {
                return <ListingItem listing={listing} key={listing._id} />;
              })}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => {
                return <ListingItem listing={listing} key={listing._id} />;
              })}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => {
                return <ListingItem listing={listing} key={listing._id} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
