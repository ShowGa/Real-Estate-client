import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingService from "../services/listing-service";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
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
                    className="h-[300px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "contain",
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </main>
  );
};

export default Listing;
