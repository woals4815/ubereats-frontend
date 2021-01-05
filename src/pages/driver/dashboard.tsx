import { gql, useMutation, useSubscription } from '@apollo/client';
import  GoogleMapReact from 'google-map-react';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { cookedOrders } from '../../__generated__/cookedOrders';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';


const COOKED_ORDERS_SUBSCRIPTION = gql`
    subscription cookedOrders {
        cookedOrders{
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
    mutation takeOrder($input: TakeOrderInput!){
        takeOrder(input: $input){
            ok
            error
        }
    }
`;

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
    const makeRoute = () => {
        if (map) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "#000",
                    strokeOpacity: 0.9,
                    strokeWeight: 5
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
    const { data: cookedOrdersData } = useSubscription<cookedOrders>(
        COOKED_ORDERS_SUBSCRIPTION
    );
    useEffect(() => {
        if(cookedOrdersData?.cookedOrders.id){
            makeRoute();
        }
    }, [cookedOrdersData]);
    const history = useHistory();
    const onCompleted = (data: takeOrder) => {
        if(data.takeOrder.ok){
            history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
        }
    };
    const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
        TAKE_ORDER_MUTATION, { onCompleted }
    );
    const triggerMutation = (orderId: number) => {
        takeOrderMutation({
            variables: {
                input: {
                    id: orderId,
                },
            },
        });
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
            <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
                {cookedOrdersData?.cookedOrders.restaurant ? (
                <>
                    <h1 className="text-center  text-3xl font-medium">
                    New Coocked Order
                    </h1>
                    <h1 className="text-center my-3 text-2xl font-medium">
                    Pick it up soon @{" "}
                    {cookedOrdersData?.cookedOrders.restaurant?.name}
                    </h1>
                    <button
                        onClick={() => 
                            triggerMutation(cookedOrdersData.cookedOrders.id)
                        }
                        className="btn w-full  block  text-center mt-5"
                    >
                        Accept Challenge &rarr;
                    </button>
                </>
                ) : (
                <h1 className="text-center  text-3xl font-medium">
                    No orders yet...
                </h1>
                )}
            </div>
        </div>
    );
};