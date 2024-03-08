import React, { useEffect, useState } from "react";
import ContactService from "../services/contact-service";
import { Link } from "react-router-dom";

const ContactBox = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    ContactService.getLandlord(listing.userRef)
      .then((res) => {
        setLandlord(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for <span className="font-semibold">{listing.name}</span>
          </p>
          <textarea
            className="border border-black p-1 rounded-lg w-full"
            name="message"
            id="message"
            rows="5"
            // value={message}
            onChange={handleChange}
            placeholder="Say something to the landlord ..."
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default ContactBox;

//http://localhost:5173/listing/65e881d1f929b8ed0b833579
