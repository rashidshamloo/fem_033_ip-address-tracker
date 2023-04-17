import { useEffect, useRef } from "react";

// interfaces
interface APISelectProps {
  API: string;
  setAPI: Function;
}

const APISelect = ({ API, setAPI }: APISelectProps) => {
  const ref = useRef<HTMLSelectElement>(null);
  // handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // set state
    setAPI(e.target.value);
    // unfocus
    e.target.blur();
    autoWidth(e.target);
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
    element.style.width = String(width + 7) + "px";
    tempSelect.remove();
  };

  // autoWidth on first load
  useEffect(() => {
    if (ref.current) autoWidth(ref.current);
  }, [ref.current]);

  return (
    <div className="absolute right-[0.2rem] top-[0.2rem] flex gap-x-1 md:static md:-mt-5 md:mr-1">
      <label htmlFor="api" className="text-xs text-white">
        API:
      </label>
      <select
        id="api"
        className="rounded-xl px-1 text-xs transition-all duration-500"
        onChange={(e) => {
          handleChange(e);
        }}
        defaultValue={API}
        ref={ref}
      >
        <option value="ip-api">ip-api.com</option>
        <option value="ipify">ipify.org</option>
        <option value="ip2location">ip2location.io (IP Only)</option>
        <option value="ipgeolocation">ipgeolocation.io (IP Only)</option>
        <option value="ipwho">ipwho.is (IP Only)</option>
      </select>
    </div>
  );
};

export default APISelect;
