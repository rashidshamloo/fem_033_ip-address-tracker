// React
import { useEffect, useRef, useState } from "react";

// react-responsive
import { useMediaQuery } from "react-responsive";

// ip-regex
import ipRegex from "ip-regex";

// toasify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import GeoInfo from "./GeoInfo";
import APISelect from "./APISelect";

// API data
const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

// interfaces
export interface ipInfo {
  ip: string;
  location: string;
  timezone: string;
  isp: string;
  lat?: number;
  lng?: number;
}

interface headerProps {
  setPosition: Function;
  setLocation: Function;
  setMapLoading: Function;
}

const Header = ({ setPosition, setLocation, setMapLoading }: headerProps) => {
  // state
  const [ipInfo, setIpInfo] = useState<ipInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [API, setAPI] = useState<string>("");

  // ref
  const ipRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // media query to change input place holder on small screens
  const matches = useMediaQuery({ query: "(min-width:600px)" });

  // handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // empty check
    if (ipRef.current && errorRef.current) {
      // if the field is empty
      if (ipRef.current.value.trim() === "") {
        // message
        errorRef.current.textContent = "Please input an IP address or domain";
        // show the error element
        errorRef.current.classList.remove("opacity-0");
      } else {
        // set ip/domain query state and fetch data
        const newQuery = ipRef.current!.value.trim();
        setQuery(newQuery);
        fetchIpInfo(newQuery);
        // hide error
        errorRef.current?.classList.add("opacity-0");
        // clear and remove focus from the field
        ipRef.current.value = "";
        ipRef.current.blur();
      }
    }
  };

  // fetch info from api and show error / info
  // also update position/location state in parent
  const fetchIpInfo = async (query: string) => {
    if (!API) return;

    // enable loading
    setLoading(true);
    setMapLoading(true);

    // fetch the data
    let url = API_URL + "?token=" + API_TOKEN;
    // if query is empty (first load)
    if (!query.trim()) url += "&api=" + API;
    // if query is valid ip
    else if (ipRegex({ exact: true }).test(query))
      url += "&api=" + API + "&ip=" + query;
    // else get domain
    else url += "&api=" + API + "&domain=" + query;
    // variable to store either the data or error message
    let tempIpInfo: ipInfo;
    let error = false;
    let res;
    try {
      res = await fetch(url);
    } catch (_: any) {
      error = true;
    }
    if (!res || !res.ok || error) {
      // show error
      const errorMessage = "Error";
      tempIpInfo = {
        ip: errorMessage,
        isp: errorMessage,
        location: errorMessage,
        timezone: errorMessage,
      };
      let toastMessage =
        "Error fetching data from the API!\nPlease try another API.";
      // error message if enetered domain was wrong
      if (res && !res.ok)
        if ((await res.json()).message === "wrong domain name.")
          toastMessage = "Wrong domain name!";
      toast.error(toastMessage, {
        autoClose: 5000,
        theme: "light",
      });
    } else {
      // update states on success
      tempIpInfo = await res.json();
      setPosition({ lat: tempIpInfo.lat, lng: tempIpInfo.lng });
      setLocation(tempIpInfo.location);
    }
    // set the data/error set above
    setIpInfo(tempIpInfo);
    // disable loading
    setLoading(false);
    setMapLoading(false);
  };

  // fetch on start and selected API state change
  useEffect(() => {
    fetchIpInfo(query);
  }, [API]);

  return (
    <header className="relative z-10 flex h-[17.5rem] flex-col items-center justify-center bg-[url('/images/pattern-bg-mobile.png')] bg-cover shadow-md shadow-black/30 md:bg-[url('/images/pattern-bg-desktop.png')] md:pb-14">
      <h1 className="mb-2 text-[1.6rem] font-[500] text-white md:mb-3 md:text-[2rem]">
        IP Address Tracker
      </h1>
      <div className="mb-20 flex w-full max-w-[87%] flex-col items-end md:mb-6 md:w-auto">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="mt-2 flex  w-full  items-start "
        >
          <div className="w-full">
            <input
              type="text"
              name="ip-domain"
              placeholder={
                matches
                  ? "Search for any IP address or domain"
                  : "IP address or domain"
              }
              className="h-[3.5rem] w-full rounded-l-2xl px-6 text-lg placeholder:text-darkGray/80 md:w-[31rem]"
              ref={ipRef}
            />
            <div className="flex items-center justify-between">
              <p
                className="ml-1 mt-1 rounded-xl bg-white/60 px-2 text-[0.8rem] tracking-wide text-red-500 opacity-0 md:ml-2 md:text-sm"
                ref={errorRef}
              >
                &nbsp;
              </p>
            </div>
          </div>
          <button
            className="flex aspect-square h-[3.5rem] items-center justify-center rounded-r-2xl bg-veryDarkGray transition-all duration-500 hover:brightness-200"
            aria-label="Show Geolocation Info"
          >
            <img src="images/icon-arrow.svg" alt="" aria-hidden="true" />
          </button>
        </form>
        <APISelect setAPI={setAPI} API={API} />
      </div>
      <GeoInfo ipInfo={ipInfo} loading={loading} />
      <ToastContainer
        className="whitespace-pre-line"
        pauseOnFocusLoss={false}
      />
    </header>
  );
};

export default Header;
