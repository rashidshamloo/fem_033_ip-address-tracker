import { useEffect, useRef, useState } from "react";

// API data
const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

// toasify
import { toast } from "react-toastify";

// utility
import fetchTimeout from "../utility/utility";

// interfaces
interface APISelectProps {
  API: string;
  setAPI: Function;
}

const APISelect = ({ API, setAPI }: APISelectProps) => {
  //state
  const [apiList, setApiList] = useState<Array<{ [key: string]: string }>>([]);
  // ref
  const ref = useRef<HTMLSelectElement>(null);

  // handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // set state
    setAPI(e.target.value);
    // unfocus
    e.target.blur();
  };

  // set auto width using a temp select element
  const autoWidth = (element: HTMLSelectElement) => {
    const tempSelect = document.createElement("select");
    tempSelect.classList.add("text-xs");
    tempSelect.classList.add("opacity-0");
    const tempOption = document.createElement("option");
    tempOption.textContent = element.options[element.selectedIndex].text;
    tempSelect.appendChild(tempOption);
    element.after(tempSelect);
    const width = tempSelect.getBoundingClientRect().width;
    element.style.width = String(width + 8) + "px";
    tempSelect.remove();
  };

  // refetch API list
  const reFetch = (sec: number) => {
    toast.error(
      `Error in fetching API list!\nTrying again in ${sec} seconds.`,
      {
        autoClose: sec * 1000,
        theme: "light",
      }
    );
    setTimeout(fetchApiList, sec * 1000);
  };

  // gets API list and updates state
  const fetchApiList = async () => {
    const url = API_URL + "list?token=" + API_TOKEN;
    let error = false;
    let res;
    try {
      res = await fetchTimeout(url);
    } catch (_: any) {
      error = true;
    }
    // refetch on error
    if (!res || !res.ok || error) {
      reFetch(4);
    } else {
      // set API list and API states
      const tempApiList = await res.json();
      setApiList(tempApiList);
      setAPI(tempApiList[0].name);
    }
  };

  // get API list on first load
  useEffect(() => {
    fetchApiList();
  }, []);

  // auto width on API change
  useEffect(() => {
    ref.current?.options.length && autoWidth(ref.current);
  }, [API]);

  return (
    <div className="absolute right-[0.2rem] top-[0.2rem] flex gap-x-1 md:static md:-mt-5 md:mr-1">
      <label htmlFor="api" className="text-xs text-white">
        API:
      </label>
      <select
        id="api"
        className="rounded-xl px-1 text-xs transition-all duration-500"
        onChange={handleChange}
        defaultValue={API}
        ref={ref}
      >
        {apiList.map((item, index) => {
          return (
            <option value={item.name} key={index}>
              {item.domain}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default APISelect;
