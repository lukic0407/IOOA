import L, { MarkerCluster } from 'leaflet';

export const handleIcon=(type)=>{
    const HouseIcon = L.icon({
        iconUrl: require('../../img/Icons/Map_Icon.png'),
        iconSize: [64, 64], // size of the icon
        iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -64] // point from which the popup should open relative to the iconAnchor
    });
    
    switch (type) {
        case "value":
            
            break;
    
        default:
            return HouseIcon
            break;
    }
}