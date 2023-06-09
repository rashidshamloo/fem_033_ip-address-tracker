import { useEffect, useMemo, useState } from 'react';

// react-leaflet
import { useMap } from 'react-leaflet';

// react-responsive
import { useMediaQuery } from 'react-responsive';

// types
import { position as positionType } from '../App';
import { LatLngExpression } from 'leaflet';
import { Control } from 'leaflet';

// interfaces
interface setMapCenterProps {
  position: positionType | undefined;
  mode: string;
  firstMapLoad?: boolean;
  setfirstMapLoad?: Function;
}

const SetMapCenter = ({
  position,
  mode,
  firstMapLoad = false,
  setfirstMapLoad,
}: setMapCenterProps) => {
  // state
  const [moveEnded, setMoveEnded] = useState<boolean>(false);
  // map
  const map = useMap();

  // media query to change map center offset according to screen size
  // and show zoom controls on desktop or remove on mobile
  const matches = useMediaQuery({ query: '(min-width:600px)' });

  if (position && !(position.lat === 0 && position.lng === 0)) {
    // move position according to screen sie to center it inside the visible area
    const newPosition: LatLngExpression = [
      Number(position.lat) + (matches ? 0.002 : 0.0075),
      position.lng,
    ];
    if (mode === 'fly' && !firstMapLoad) {
      map.flyTo(newPosition, 13);
    } else {
      map.setView(newPosition, 13);
      if (!moveEnded) setMoveEnded(true);
    }
  }

  // add zoom controls on desktop and remove in mobile
  const zoomControl = useMemo(() => new Control.Zoom(), []);
  useEffect(() => {
    if (moveEnded && !firstMapLoad) {
      if (matches) {
        map.addControl(zoomControl);
      } else {
        map.removeControl(zoomControl);
      }
    }
  }, [moveEnded, firstMapLoad, matches]);

  useEffect(() => {
    // after first map move, set setfirstMapLoad to false
    // to show the map and enable flyTo animation
    if (moveEnded && setfirstMapLoad) setfirstMapLoad(false);
  }, [moveEnded]);
  return null;
};

export default SetMapCenter;
