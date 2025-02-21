import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import MapComponent from '../components/googleMapComponent/page';
import api from '@/api/apiKey';
import 'swiper/css';
import HostelsComponent from '../components/HostelsComponent';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';
import { Modal, Box } from '@mui/material';
import { Close, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
const HostelDetail = () => {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const swiperRef = useRef(null);

  // Define the list of hostel images
  const hostelImages = [
    hostel?.image,
    hostel?.image2,
    hostel?.image3,
  ].filter(Boolean); // Filters out undefined or null values

  // Handle image click to open modal
  const handleImageClick = useCallback((index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setCurrentImageIndex(0);
  }, []);

  // Navigate to the previous image
  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? hostelImages.length - 1 : prevIndex - 1
    );
  }, [hostelImages]);

  // Navigate to the next image
  const handleNext = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === hostelImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [hostelImages]);

  useEffect(() => {
    const fetchSingleHostel = async () => {
      try {
        const response = await api.get(`https://beiyo-admin.in/api/hostels/${id}`);
        setHostel(response.data);
        if (response.data) {
          document.title = `Book your Bed in ${response.data.name}`;
       // Update URL query string when locationLink changes
       const queryParams = new URLSearchParams(window.location.search);
       if (response.data.locationLink) {
         queryParams.set("location", response.data.location);
       } else {
         queryParams.delete("location");
       }

       // Update the URL with the new query string
       navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
     }

      } catch (error) {
        console.log(error);
      }
    }
    fetchSingleHostel();
  }, [id, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-white/5 to-gray-50/10 p-4 md:p-8">
      {/* Breadcrumb */}
      <nav className="mt-16 ml-20 flex py-4 mb-6" aria-label="Breadcrumb">
        {/* <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="/" className="text-gray-700 hover:text-[#FFD700] transition-colors">Beiyo</a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
              <a href="/hostel" className="text-gray-700 hover:text-[#FFD700] transition-colors">Hostels</a>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span className="text-gray-500">{hostel?.name}</span>
            </div>
          </li>
        </ol> */}
      </nav>

      <div className="backdrop-blur-md bg-white/30 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Beiyo {hostel?.name}
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FFD700]/20">
                  {hostel?.hostelType}
                </span>
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <img src="/images/location_Marker.svg" alt="" className="h-4 w-4" />
                <p>{hostel?.location}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href={`https://api.whatsapp.com/send?text=https://beiyo.in/hostel/${hostel?._id}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
              >
                <img src="/images/whatsapp1.svg" alt="" className="h-5 w-5" />
                <span>Share</span>
              </a>
              <a 
                href={hostel?.locationLink}
                className="px-4 py-2 rounded-lg bg-[#ffc72c] hover:bg-[#ffc72c]/50 transition-colors"
              >
                View on Map
              </a>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Image Slider */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              {hostelImages.length > 0 && (
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Autoplay]}
                slidesPerView={1}
                loop={true}
                navigation={true}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                className="aspect-video"
              >
                {hostelImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      alt={`Hostel Image ${index + 1}`} 
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleImageClick(index)} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              )}
            </div>
          </div>

          {/* Pricing and Booking Card */}
          <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="space-y-4">
              <div className="space-y-3">
                {hostel?.singlePrice && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/50">
                    <div className="flex items-center gap-2">
                      <img src="/images/bed.svg" alt="" className="h-6 w-6" />
                      <span>Single</span>
                    </div>
                    <div className="flex items-center">
                      <img src="/images/rupee.svg" alt="" className="h-4 w-4" />
                      <span className="font-bold">{hostel.singlePrice}/bed</span>
                    </div>
                  </div>
                )}
                  {hostel?.doublePrice && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/50">
                    <div className="flex items-center gap-2">
                      <img src="/images/bed.svg" alt="" className="h-6 w-6" />
                      <span>Double</span>
                    </div>
                    <div className="flex items-center">
                      <img src="/images/rupee.svg" alt="" className="h-4 w-4" />
                      <span className="font-bold">{hostel.doublePrice}/bed</span>
                    </div>
                  </div>
                )}
                  {hostel?.triplePrice && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/50">
                    <div className="flex items-center gap-2">
                      <img src="/images/bed.svg" alt="" className="h-6 w-6" />
                      <span>Triple</span>
                    </div>
                    <div className="flex items-center">
                      <img src="/images/rupee.svg" alt="" className="h-4 w-4" />
                      <span className="font-bold">{hostel.triplePrice}/bed</span>
                    </div>
                  </div>
                )}
                {/* Similar blocks for double and triple */}
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-3">
                <a 
                  href={`/bookingPage/${hostel?._id}`}
                  className="block w-full py-3 text-center font-medium bg-[#FFD700] text-black rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  Book Now
                </a>
                <div className="text-center text-gray-500">OR</div>
                <a 
                  href={`https://api.whatsapp.com/send/?phone=918305523140&text=I%27d%20like%20to%20book%20a%20room%20in%20${hostel?.name}%20Can%20you%20help%20me%20with%20availability%20my%20name%20is%20:&`}
                  target="_blank"
                  className="block w-full py-3 text-center font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <img src="/images/whatsapp1.svg" alt="" className="h-5 w-5" />
                    Connect on WhatsApp
                  </div>
                </a>
              </div>
              <div>
                <MapComponent />
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="p-6 border-t border-gray-200/50">
          <h2 className="text-2xl font-bold mb-6">Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'High-Speed WI-FI',
              'Furnished',
              'Camera Security',
              'Washing Machine',
              'Purified Water',
              'Professional Housekeeping'
            ].map((service) => (
              <div key={service} className="p-4 rounded-lg bg-[#ffc72c] justify-center flex text-center items-center hover:bg-white/70 transition-colors">
                {service}
              </div>
            ))}
          </div>
        </div>

        {/* Address and Nearby Places */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-t border-gray-200/50">
          <div>
            <h2 className="text-2xl font-bold mb-4">Address</h2>
            <a 
              href={hostel?.locationLink}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <img src="/images/location_Marker.svg" alt="" className="h-4 w-4" />
              <span>{hostel?.location}</span>
            </a>
          </div>

          {hostel?.nearby1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Nearby Places</h2>
              <div className="space-y-3">
                {[
                  { place: hostel.nearby1, distance: hostel.nearby1distance },
                  { place: hostel.nearby2, distance: hostel.nearby2distance },
                  { place: hostel.nearby3, distance: hostel.nearby3distance },
                ].filter(item => item.place).map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-gray-600">
                    <img src="/images/location_Marker.svg" alt="" className="h-4 w-4" />
                    <span>{item.place}</span>
                    <span className="text-sm text-gray-500">- {item.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other Hostels Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Other Hostels</h2>
        <HostelsComponent notincludID={hostel?._id} />
      </div>

      {/* Image Modal */}
      <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-none shadow-lg p-4 overflow-auto transition-opacity duration-700">

          {hostelImages[currentImageIndex ] ? (
            <img
              src={hostelImages[currentImageIndex ]}
              alt="Selected Hostel"
              className="max-w-full max-h-[90vh] rounded-2xl border-2 border-[#ffc72c] object-contain transition-opacity duration-700"
              loading="lazy"
            />
          ) : (
            <p className="text-white">Image could not be loaded.</p>
          )}

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-6 bg-[#ef4444] text-white p-2 rounded-full hover:bg-[#ef4444]/80 transition-colors"
            >
              <Close/>
            </button>

            {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-[#ffc72c] text-white p-3 rounded-s-xl hover:bg-[#ffc72c]/80"
          >
            <ArrowBackIosNew/>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-[#ffc72c] text-white p-3 rounded-e-xl hover:bg-[#ffc72c]/80"
          >
            <ArrowForwardIos/>
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default HostelDetail;