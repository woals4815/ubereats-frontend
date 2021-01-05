import  GoogleMapReact from 'google-map-react';
import React, { useEffect, useState } from 'react';

interface ICoords{
    lat: number;
    lng: number;
}

interface IDriverProps {
    lat: number;
    lng: number;
    $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🛵</div>;

export const Dashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
    const [map, setMap] = useState<google.maps.Map>();
    const [maps, setMaps] = useState<any>();
    //@ts-ignore
    const onSuccess = ({ coords: { latitude, longitude } }: Position) => {
        setDriverCoords({ lat: latitude, lng: longitude});
    };
    // @ts-ignore
    const onError = (error: PositionError) => {
        console.log(error);
    };
    
    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true
        });
    }, []);
    useEffect(() => {
        if (map && maps) {
          map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
          const geocoder= new google.maps.Geocoder();
          geocoder.geocode(
              {
                  location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
              },
              (results, status) => {
                  console.log(status, results);
              }
          );
        }
      }, [driverCoords.lat, driverCoords.lng]);
    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
        setMap(map);
        setMaps(maps);
      };
    const onGetRouteClick = () => {
        if (map) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "#000",
                    strokeOpacity: 0.9,
                    strokeWeight: 7
                }
            });
            directionsRenderer.setMap(map);
            directionsService.route({
                origin: {
                    location: new google.maps.LatLng(
                        driverCoords.lat,
                        driverCoords.lng
                    ),
                },
                destination: {
                    location: new google.maps.LatLng(
                        driverCoords.lat + 0.01,
                        driverCoords.lng + 0.01
                    ),
                },
                travelMode: google.maps.TravelMode.TRANSIT,
                },
                (result) => {
                    directionsRenderer.setDirections(result);
                }
            );
        }
    };
    return (
        <div>
            <div
                className="overflow-hidden"
                style={{ width: window.innerWidth, height: "50vh" }}
                >
                <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={onApiLoaded}
                    defaultZoom={16}
                    draggable={true}
                    defaultCenter={{
                        lat: 36.58,
                        lng: 125.95
                    }}
                    bootstrapURLKeys={{ key: "AIzaSyA5EIs-B3PN1V_b4Ib6-pCc9djVGtN26ho" }}
                >
                    <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
                </GoogleMapReact>
            </div>
            <button onClick={onGetRouteClick}>Get route</button>
        </div>
    );
};