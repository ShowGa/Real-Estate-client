import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingService from "../services/listing-service";

const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const handleChange = (e) => {
    // check searchTerm
    if (e.target.id === "searchTerm") {
      setSearchData({
        ...searchData,
        searchTerm: e.target.value,
      });
    }
    // check type
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setSearchData({
        ...searchData,
        type: e.target.id,
      });
      return;
    }
    // check parking, offer, furnished
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setSearchData({
        ...searchData,
        [e.target.id]: e.target.checked,
      });
      return;
    }
    // check sort, order
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSearchData({
        ...searchData,
        sort,
        order,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchData.searchTerm);
    urlParams.set("type", searchData.type);
    urlParams.set("parking", searchData.parking);
    urlParams.set("furnished", searchData.furnished);
    urlParams.set("offer", searchData.offer);
    urlParams.set("sort", searchData.sort);
    urlParams.set("order", searchData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    const typeFromURL = urlParams.get("type");
    const parkingFromURL = urlParams.get("parking");
    const furnishedFromURL = urlParams.get("furnished");
    const offerFromURL = urlParams.get("offer");
    const sortFromURL = urlParams.get("sort");
    const orderFromURL = urlParams.get("order");

    if (
      searchTermFromURL ||
      typeFromURL ||
      parkingFromURL ||
      furnishedFromURL ||
      offerFromURL ||
      sortFromURL ||
      orderFromURL
    ) {
      setSearchData({
        searchTerm: searchTermFromURL || "",
        type: typeFromURL || "all",
        parking: parkingFromURL === "true" ? true : false,
        furnished: furnishedFromURL === "true" ? true : false,
        offer: offerFromURL === "true" ? true : false,
        sort: sortFromURL || "createdAt",
        order: orderFromURL || "desc",
      });
    }

    // After the location.search change, we start to fetch data
    const searchQuery = urlParams.toString();
    setLoading(true);
    ListingService.getListings(searchQuery)
      .then((res) => {
        console.log("Operating axios");
        setListings(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, [location.search]);

  return (
    <main className="flex flex-col md:flex-row">
      <section className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term :
            </label>
            <input
              onChange={handleChange}
              value={searchData.searchTerm}
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type :</label>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={searchData.type === "all"}
                type="checkbox"
                id="all"
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={searchData.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={searchData.type === "sale"}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={searchData.offer || searchData.offer === "true"}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities :</label>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={searchData.parking || searchData.parking === "true"}
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={
                  searchData.furnished || searchData.furnished === "true"
                }
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label>Sort :</label>
            <select
              onChange={handleChange}
              defaultValue={"create_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createAt_desc">Latest</option>
              <option value="createAt_asc">Oldest</option>
            </select>
          </div>
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </form>
      </section>
      <section className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results :
        </h1>
      </section>
    </main>
  );
};

export default Search;
