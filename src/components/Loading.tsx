import ReactLoading from "react-loading";

// react-responsive
import { useMediaQuery } from "react-responsive";

// interfaces
interface loadingProps {
  map?: boolean;
}

const Loading = ({ map = false }: loadingProps) => {
  const matches = useMediaQuery({ query: "(min-width:600px)" });
  return (
    <div
      className={
        "flex items-center justify-center " +
        (map ? "absolute inset-0 z-[2] bg-black/20" : "")
      }
    >
      <ReactLoading
        type={map ? "spin" : "bars"}
        color="black"
        width={matches ? 84 : 40}
        height={matches ? 40 : 22}
      />
    </div>
  );
};

export default Loading;
