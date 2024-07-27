import { Audio } from "react-loader-spinner";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import Contact from "../components/contact";
export default function Listing() {
  SwiperCore.use([Navigation]);
  const { id } = useParams();
  const [loaderror, setloaderror] = useState(false);
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState({});
  const [contact, setContact] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const res = await fetch(`/api/listing/get/${id}`, {
          method: "GET",
        });

        if (res.ok) {
          setdata(await res.json());
        } else {
          setloaderror("Failed to fetch data");
        }
      } catch (error) {
        setloaderror(error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      {data && !loading && !loaderror && (
        <>
          <div>
            <Swiper
              navigation
              className="mySwiper" // Add a class to customize the Swiper container
            >
              {Array.isArray(data.imageUrls) &&
                data.imageUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="h-[550px] bg-cover bg-center relative" // Adjusted class names
                      style={{
                        backgroundImage: `url(${url})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                      <div className="absolute inset-0 flex items-center justify-center"></div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {data.name} - ₹
              {data.offer
                ? (data.discountPrice ?? 0).toLocaleString("en-US")
                : (data.regularPrice ?? 0).toLocaleString("en-US")}
              {data.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {data.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {data.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {data.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ₹{+data.regularPrice - +data.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {data.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {data.bedrooms > 1
                  ? `${data.bedrooms} beds `
                  : `${data.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {data.bathrooms > 1
                  ? `${data.bathrooms} baths `
                  : `${data.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {data.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {data.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            <button
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
              onClick={() => setContact(true)}
            >
              contact landlord
            </button>
          </div>
        </>
      )}

      {loaderror && (
        <div className="h-screen flex flex-col items-center justify-center">
          <img
            className="rounded-full w-48 h-48 mb-4"
            alt="image description"
            src="https://firebasestorage.googleapis.com/v0/b/home-216b9.appspot.com/o/hippo-empty-cart.png?alt=media&token=9b664469-4c29-42b6-8bd2-aeedb4d4a7e4"
          />
          <h1 className="text-blue-600 text-lg p-2">FAILED TO FETCH DATA</h1>
          <p className="text-red-600 text-lg p-2">{loaderror}</p>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <Audio
            height="80"
            width="80"
            radius="9"
            color="blue"
            ariaLabel="loading"
          />
        </div>
      )}
      {contact && <Contact listing={data} />}
    </div>
  );
}
