// react-responsive
import { useMediaQuery } from "react-responsive";

// icons
import {
  BsGithub,
  BsFillBriefcaseFill,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs";

const Credits = () => {
  const matches = useMediaQuery({ query: "(min-width:600px)" });
  return (
    <footer
      className="fixed bottom-0 left-0   flex items-center justify-center bg-white/70  px-[0.05rem] py-[0.2rem] text-xs md:px-[0.2rem] md:py-[0.05rem]"
      style={{ writingMode: matches ? "inherit" : "vertical-rl" }}
    >
      Developed by Rashid Shamloo |
      <ul className="mt-1 inline-flex items-center justify-center gap-x-2 text-sm md:ml-1 md:mt-0  [&_a]:transition-all [&_a]:duration-500 hover:[&_a]:text-darkGray">
        <li>
          <a
            href="https://www.rashidshamloo.ir"
            title="Portfolio"
            target="_blank"
          >
            <BsFillBriefcaseFill />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/rashidshamloo"
            title="GitHub"
            target="_blank"
          >
            <BsGithub />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/rashid-shamloo/"
            title="LinkedIn"
            target="_blank"
          >
            <BsLinkedin />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/rashidshamloo"
            title="Twitter"
            target="_blank"
          >
            <BsTwitter />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Credits;
