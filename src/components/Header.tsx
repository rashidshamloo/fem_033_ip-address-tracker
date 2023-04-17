const API_KEYS = {
  ipify: import.meta.env.VITE_API_KEY_IPIFY,
  ipgeolocation: import.meta.env.VITE_API_KEY_IPGEOLOCATION,
  ip2location: import.meta.env.VITE_API_KEY_IP2LOCATION,
};

// API URL
const API_URL = {
  "ip-api": "http://ip-api.com/json/",
  ipify:
    "https://geo.ipify.org/api/v2/country,city?apiKey=" + API_KEYS["ipify"],
  ipgeolocation:
    "https://api.ipgeolocation.io/ipgeo?apiKey=" +
    API_KEYS["ipgeolocation"] +
    "&ip=",
  ipwho: "http://ipwho.is/",
  ip2location:
    "https://api.ip2location.io/?key=" +
    API_KEYS["ip2location"] +
    "&format=json",
};

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

// types
import { position } from "../App";

// interfaces
export interface ipInfo {
  ip: string;
  location: string;
  timezone: string;
  isp: string;
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
  const [API, setAPI] = useState<string>("ip-api");

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
        // if the value is not a valid ip but an ip only API is selected
      } else if (
        !ipRegex({ exact: true }).test(ipRef.current.value) &&
        (API === "ipgeolocation" || API === "ipwho" || API === "ip2location")
      ) {
        // message
        errorRef.current.textContent = "Selected API only accepts IP Addresses";
        // show the error element
        errorRef.current.classList.remove("opacity-0");
      } else {
        // show loading
        setLoading(true);
        setMapLoading(true);
        // set ip/domain query state
        // which triggers fetching the data (useEffect())
        setQuery(ipRef.current!.value.trim());
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
  const fetchIpInfo = async () => {
    setLoading(true);
    // set API url for different API providers
    let res: Response;
    if (API === "ipify" || API === "ip2location") {
      const isIp = ipRegex({ exact: true }).test(query);
      const ip = isIp
        ? "&ip" + (API === "ipify" ? "Address" : "") + "=" + query
        : "";
      const domain = !isIp && query.trim() !== "" ? "&domain=" + query : "";
      res = await fetch(API_URL[API] + ip + domain);
    } else if (API === "ip-api" || API === "ipgeolocation" || API === "ipwho") {
      res = await fetch(API_URL[API] + query);
    } else return null;
    let tempIpInfo: ipInfo;
    let resJson;
    if (res.ok) {
      resJson = await res.json();
    }
    // if fetch failed or the "ip-api" API returned an "status" other than "success"
    // or "ipwho" API's returned "success" was "false", show error
    if (
      !res.ok ||
      (API === "ip-api" && !(resJson.status === "success")) ||
      (API === "ipwho" && resJson.success === false)
    ) {
      // show error
      const errorMessage = "Error";
      tempIpInfo = {
        ip: errorMessage,
        isp: errorMessage,
        location: errorMessage,
        timezone: errorMessage,
      };
      toast.error("Error in fetching data from API!", {
        autoClose: 4000,
        theme: "light",
      });
    } else {
      // set the data according to the API
      // and call set Position/Location in parent
      let ip = "";
      let isp = "";
      let location = "";
      let timezone = "";
      let position: position = { lat: 0, lng: 0 };
      if (API === "ipify") {
        ip = resJson.ip;
        isp = resJson.isp;
        location = `${resJson.location.country}, ${resJson.location.region}, ${resJson.location.city} ${resJson.location.postalCode}`;
        timezone = "UTC" + resJson.location.timezone;
        position = { lat: resJson.location.lat, lng: resJson.location.lng };
      } else if (API === "ip-api") {
        ip = resJson.query;
        isp = resJson.isp;
        location = `${resJson.country}, ${resJson.regionName}, ${resJson.city} ${resJson.zip}`;
        timezone = resJson.timezone;
        position = { lat: resJson.lat, lng: resJson.lon };
      } else if (API === "ipgeolocation") {
        ip = resJson.ip;
        isp = resJson.isp;
        location = `${resJson.country_code2}, ${resJson.state_prov}, ${resJson.city} ${resJson.zipcode}`;
        timezone =
          resJson.time_zone.name +
          "\n" +
          "UTC" +
          (resJson.time_zone.offset > 0 && "+") +
          resJson.time_zone.offset;
        position = { lat: resJson.latitude, lng: resJson.longitude };
      } else if (API === "ipwho") {
        ip = resJson.ip;
        isp = resJson.connection.isp;
        location = `${resJson.country_code}, ${resJson.region}, ${resJson.city} ${resJson.postal}`;
        timezone = resJson.timezone.id + "\nUTC" + resJson.timezone.utc;
        position = {
          lat: Number(resJson.latitude),
          lng: Number(resJson.longitude),
        };
      } else if (API === "ip2location") {
        ip = resJson.ip;
        isp = "N/A";
        location = `${resJson.country_name}, ${resJson.region_name}, ${resJson.city_name} ${resJson.zip_code}`;
        timezone = "UTC" + resJson.time_zone;
        position = {
          lat: Number(resJson.latitude),
          lng: Number(resJson.longitude),
        };
      }

      tempIpInfo = {
        ip: ip,
        isp: isp,
        location: location,
        timezone: timezone,
      };
      // set map position and popup location in parent
      setPosition(position);
      setLocation(location);
    }
    // show the data/error set above
    setIpInfo(tempIpInfo);
    setLoading(false);
    setMapLoading(false);
  };

  // fetch on start and select/query state change
  useEffect(() => {
    fetchIpInfo();
  }, [API, query]);

  return (
    <header className="relative z-10 flex h-[17.5rem] flex-col items-center justify-center bg-[url('images/pattern-bg-mobile.png')] bg-cover shadow-md shadow-black/30 md:bg-[url('images/pattern-bg-desktop.png')] md:pb-14">
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
      <ToastContainer />
    </header>
  );
};

export default Header;
