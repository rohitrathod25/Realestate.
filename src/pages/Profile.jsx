import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { RiDeleteBin2Line, RiEdit2Line } from "react-icons/ri"; // Import delete and edit icons

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filep, setFilep] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formdata, setFormdata] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [empty, isEmpty] = useState(false);

  const hchange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  const handleDeleteAccount = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      } else {
        alert("Account deleted successfully.");
        dispatch(deleteUserSuccess());
      }
    } catch (err) {
      dispatch(deleteUserFailure(err.message || "An error occurred"));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
      } else {
        alert("Signed out successfully.");
        dispatch(signOutUserSuccess(data));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message || "An error occurred"));
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilep(Math.round(progress));
      },
      (error) => {
        setFileUploadError(
          error.message || "An error occurred during file upload."
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormdata({ ...formdata, profile: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    dispatch(updateUserStart());

    if (!formdata.username && !formdata.email && !formdata.password && !file) {
      setFileUploadError("Please make changes before submitting.");
      setSubmitting(false);
      return;
    }

    try {
      const req = await fetch(`/api/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await req.json();

      if (req.ok) {
        alert("Profile updated successfully.");
        dispatch(updateUserSuccess(data));
      } else {
        setFileUploadError(data.message || "Update failed. Please try again.");
        dispatch(updateUserFailure(data.message || "Update failed."));
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setFileUploadError(
        error.message || "An error occurred during the update."
      );
      dispatch(
        updateUserFailure(
          error.message || "An error occurred during the update."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleShow = async () => {
    try {
      const res = await fetch(`/api/solo/${currentUser._id}`, {
        method: "GET",
      });

      if (res.ok) {
        const result = await res.json();
        setData(result);

        if (result.length === 0) {
          isEmpty(true);
        }
      } else {
        console.error("Error fetching data:", res.status, res.statusText);
        isEmpty(true);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      isEmpty(true);
    }
  };

  const sdelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // If deletion is successful, update the data state
        setData((prevData) =>
          prevData.filter((listing) => listing._id !== listingId)
        );
      } else {
        console.log("Deletion failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 p-8 max-w-md mx-auto mt-8 rounded-lg shadow-md">
      <h1 className="text-3xl text-center font-semibold my-4">Your Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full">
          {filep > 0 && (
            <div className="rounded-full overflow-hidden">
              <img
                src={formdata.profile || currentUser.profile}
                alt="profile"
                className="w-full h-full object-cover border-8"
              />
              <div
                className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center"
                style={{
                  opacity: filep / 100,
                  transition: "opacity 0.5s ease",
                }}
              >
                <CircularProgressbar
                  value={filep}
                  text={`${filep}%`}
                  strokeWidth={5}
                  styles={{
                    root: { width: "100%", height: "100%" },
                    path: {
                      stroke: `rgba(62, 152, 199, 1)`, // Always fully opaque
                    },
                  }}
                />
              </div>
            </div>
          )}

          <img
            onClick={() => fileRef.current.click()}
            src={formdata.profile || currentUser.profile}
            alt="profile"
            className="rounded-full w-full h-full object-cover border-8 cursor-pointer"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          className="hidden"
        />

        {fileUploadError && (
          <p className="text-red-500 mt-2 text-sm">{fileUploadError}</p>
        )}

        <input
          type="text"
          id="username"
          placeholder={currentUser.username}
          onChange={hchange}
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          id="email"
          placeholder={currentUser.email}
          onChange={hchange}
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          id="password"
          placeholder="New Password"
          onChange={hchange}
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:bg-blue-600 mb-4"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        <Link
          to="/add-listing"
          className="bg-green-500 text-white p-3 rounded-lg uppercase hover:bg-green-600 mb-4 text-center"
        >
          Add Listing
        </Link>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="text-red-500 hover:underline focus:outline-none"
          >
            Delete Account
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="text-red-500 hover:underline focus:outline-none"
          >
            Sign Out
          </button>
        </div>
      </form>

      <button
        onClick={handleShow}
        className="w-full text-center text-green-500 hover:underline focus:outline-none p-5"
      >
        MY LISTING
      </button>

      <div className="flex justify-center items-center h-full">
        <div className="mx-auto space-y-4">
          {!empty ? (
            data.map((listing) => (
              <Link to={`/listing/${listing._id}`}>
                <div key={listing._id}>
                  <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-md w-full sm:w-[300px] flex">
                    <div className="relative overflow-hidden w-1/2">
                      <img
                        src={
                          listing.imageUrls[0] ||
                          "path/to/placeholder-image.jpg"
                        }
                        alt="listing cover"
                        className="h-full w-full object-cover transform scale-100 hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 w-1/2">
                      <p className="text-lg font-semibold text-gray-800">
                        {listing.name}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {listing.description}
                      </p>

                      {/* Edit and Delete buttons */}
                      <div className="flex mt-2">
                        <Link to={`/update/${listing._id}`}>
                          <button className="text-blue-500 mr-2 hover:underline">
                            <RiEdit2Line /> Edit
                          </button>
                        </Link>
                        <Link>
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => sdelete(listing._id)}
                          >
                            <RiDeleteBin2Line /> Delete
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="h-screen flex flex-col items-center justify-center">
              <img
                className="rounded-full w-48 h-48 mb-4"
                alt="image description"
                src="https://firebasestorage.googleapis.com/v0/b/home-216b9.appspot.com/o/hippo-empty-cart.png?alt=media&token=9b664469-4c29-42b6-8bd2-aeedb4d4a7e4"
              />
              <h1 className="text-blue-600 text-lg p-2">
                YOU dont have listing add listing
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
