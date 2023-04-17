// components
import Loading from "./Loading";

// types
import { ipInfo } from "./Header";

// interfaces
interface geoInfoProps {
  ipInfo: ipInfo | undefined;
  loading: boolean;
}

const GeoInfo = ({ ipInfo, loading }: geoInfoProps) => {
  return (
    <div className="absolute top-full z-[1] w-full max-w-[87%] -translate-y-[6.8rem] rounded-2xl bg-white shadow-md shadow-black/30 md:min-h-[10rem] md:-translate-y-1/2 lg:max-w-[69.5rem]">
      <ul className="grid h-full grid-cols-1 px-4 py-1 text-center md:grid-cols-4 md:px-0 md:py-0 md:text-left [&>*]:flex [&>*]:flex-col [&>*]:items-center [&>*]:justify-between [&>*]:pt-2 [&>*]:after:w-[58%] [&>*]:after:border-b-[1px] [&>*]:after:border-black/10 last:[&>*]:after:w-0 md:[&>*]:h-full md:[&>*]:min-h-[10rem] md:[&>*]:flex-row md:[&>*]:pl-8 md:[&>*]:after:h-[48%] md:[&>*]:after:w-0 md:[&>*]:after:border-r-[1px] md:last:[&>*]:after:h-0 [&_div]:pb-2 md:[&_div]:pr-8 first:[&_p]:text-[0.65rem] first:[&_p]:font-bold first:[&_p]:tracking-widest first:[&_p]:text-darkGray last:[&_p]:mt-1 last:[&_p]:text-xl last:[&_p]:font-[500] last:[&_p]:leading-tight md:first:[&_p]:text-[0.8rem] md:last:[&_p]:mt-3 md:last:[&_p]:text-2xl">
        <li>
          <div>
            <p>IP ADDRESS</p>
            {loading ? <Loading /> : <p className="break-all">{ipInfo?.ip}</p>}
          </div>
        </li>
        <li>
          <div>
            <p>LOCATION</p>
            {loading ? <Loading /> : <p>{ipInfo?.location}</p>}
          </div>
        </li>
        <li>
          <div>
            <p>TIMEZONE</p>
            {loading ? (
              <Loading />
            ) : (
              <p className="whitespace-pre-line break-all">
                {ipInfo?.timezone}
              </p>
            )}
          </div>
        </li>
        <li>
          <div>
            <p>ISP</p>
            {loading ? <Loading /> : <p>{ipInfo?.isp}</p>}
          </div>
        </li>
      </ul>
    </div>
  );
};
export default GeoInfo;
