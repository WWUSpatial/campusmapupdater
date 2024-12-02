import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
/* Import Widgets */
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import Locate from '@arcgis/core/widgets/Locate';
import Search from '@arcgis/core/widgets/Search';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Home from '@arcgis/core/widgets/Home';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import Measurement from '@arcgis/core/widgets/Measurement';
import Print from '@arcgis/core/widgets/Print'; 
import Bookmarks from '@arcgis/core/widgets/Bookmarks'
import Bookmark from "@arcgis/core/webmap/Bookmark.js";
import LayerList from '@arcgis/core/widgets/LayerList';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import "./style.css";


/* DEFAULTS & CONFIGS */
let zoom = 15;
let center = [-122.48614277687422, 48.732800397930795];

// Hash processing function

function hashProcesser(hash = window.location.hash, search = window.location.search){
  return hash.replace('#','').concat('&', search.replace('?', ''));

};


function getCurrentDateString() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + ", " + strTime;
};

const currentDateString = getCurrentDateString();
const tabIndent = 'style="margin-left: 40px"'
/* Create Layers */

/* Building Info */
// This defines the template for building info popups. It uses HTML syntax to format the popup.
// Note the use of `backticks` to format with tabindentation

const buildingInfoPopUpTemplate = {
  title: '<b><a href={bldg_url}>{name} ({abv})</a></b>',
  content: `  <p>{bldg_type} Building</p>\
              <p><b><a href = 'https://disability.wwu.edu'> Accessibility</a>: {acc_header}</b></p>\
              <p ${tabIndent}> {acc_elev}</p>\
              <p ${tabIndent}> {acc_pop}</p>\
              <p><b>Restrooms: {rr_header}</b></p>\
              <p ${tabIndent}> <a href = 'https://lgbtq.wwu.edu/gender-neutral-restrooms/'> Gender Neutral Restrooms </a></p>\
              <p ${tabIndent}> {rr_pop}</p>\
              <p><b>Family Amenities: {fam_header}</b></p>\
              <p ${tabIndent}> <a href = 'https://hr.wwu.edu/lactation-rooms'> Lactation Rooms </a></p>\
              <p ${tabIndent}> {fam_pop}</p>\
              <p><b>Computer Labs: {com_header}</b></p>\
              <p ${tabIndent}> {com_pop}</p>\
              <p ${tabIndent}><a href={com_url}>{com_urltxt}</a></p>\
              <p><b><a href = 'https://www.wwu.edu/sustainable-campus'> Sustainability</a> Features: {sus_header}</b></p>\
              <p ${tabIndent}> {sus_pop1}</p>\
              <p ${tabIndent}> {sus_pop2}</p>\
              <p ${tabIndent}> {sus_pop3}</p>\
              <p><b><a href = 'https://wwu.campusdish.com/LocationsAndMenus'>Food</a>: {food_header}</b></p>\
              <p ${tabIndent}> {food_pop}</p>\
              <p><a href={food_url}>{food_url}</a></p>\
              <p><img src="{image_url}"></p>\
              <p>{name}</p>\
              <p><b><a href={bldg_url}> Building Information</a></b></p>`,
};
const buildingInfo5k = new FeatureLayer({
  title: 'Building Info',
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Building_Info__5k/FeatureServer',
  title: 'Building Info',
  visible: true, 
  popupTemplate: buildingInfoPopUpTemplate,
  popupEnabled: false,
});
const buildingInfo100k = new FeatureLayer({
  title: 'Building Info',
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/ArcGIS/rest/services/Building_Info_5_100k/FeatureServer/3',
  visible: true,
  popupTemplate: buildingInfoPopUpTemplate,
  minScale: 13000,
  popupEnabled: false,
});


const miscPoints = new FeatureLayer({
  title: 'Miscellaneous Points',
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/misc_points_popups/FeatureServer',
  title: 'Miscellaneous Points',
  popupEnabled: false,
  popupTemplate: {
    title: '{name}',
    content: '<p>{display}</p>\
              <p>{popup}</p>\
              <p><a href={URL}>{URL}</a></p>',},
  visible: true,
});

const buildingPopupPolys = new FeatureLayer({
  title: 'Building Popup Polys',
  url:'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/building_popups/FeatureServer',
  visible: true,
  legendEnabled: false,
  listMode: 'hide',
  popupTemplate: buildingInfoPopUpTemplate,
});

const buildingInfoGroup = new GroupLayer({
  title: 'Building Info',
  layers: [buildingInfo5k, buildingInfo100k, miscPoints, buildingPopupPolys],
  visible: true,
  listMode: 'hide',
  legendEnabled: false,
});

/* MISC Always On */

const labelLines =  new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/label_lines/FeatureServer',
  title: 'Label Lines',
  visible: true,
  legendEnabled: false,
  listMode: 'hide',
  popupEnabled: false,
});

const miscLabels = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/label_points/FeatureServer',
  title: 'Point Labels',
  visible: true,
  popupEnabled: false,
  listMode: 'hide',
  legendEnabled: false,
});

const miscAlwaysOnGroup = new GroupLayer({
  title: 'Misc Always On',
  layers: [labelLines, miscLabels],
  visible: true,
  listMode: 'hide',
  legendEnabled: false,
});
/* Accessibility */

const accessibleBuildings100 = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Acc_Building_Info_5_100k/FeatureServer/5',
  title: '',
  popupEnabled: false,
});

const accessibleBuildings5k = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Acc_Building_Info__5k/FeatureServer/4',
  title: '',
  popupEnabled: false,
});

const accessibleBuildingsGroup = new GroupLayer({
  title: 'Accessible Buildings',
  layers: [accessibleBuildings5k, accessibleBuildings100],
  visible: true,
  listMode: 'hide',
});

const accStairs = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Stairs/FeatureServer',
  title: 'Stairs',
  legendEnabled: true,
  listMode: 'hide',
  popupEnabled: false,
  visible: true,
});

const accessibleDoors = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Accessible_Doors/FeatureServer',
  title: 'Accessible Doors',
  popupTemplate: {
    title: '{type}',
    content: '<p>{popup2}</p>\
              <p><a href="https://disability.wwu.edu/">Disability Access Center</a></p>',},
  effect: 'drop-shadow(3px, 3px, 5px)'
});
const accessibleElevators = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Accessible_Elevators/FeatureServer',
  title: 'Accessible Elevators',
  popupTemplate: {
    title: '{popup} Elevator',
    content: '<p>{popup2}</p>\
              <p><a href="https://disability.wwu.edu/">Disability Access Center</a></p>',},
  effect: 'drop-shadow(3px, 3px, 5px)'
});

const accessibleWalkways = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Accessible_Walkways/FeatureServer',
  title: 'Accessible Walkways',
  popupTemplate: {
    title: '{acc_type}',
    content: '<p>{AccPopUp} </p>\
              <p>{SnowPopUp}</p>\
              <p><a href="https://disability.wwu.edu/">Disability Access Center</a></p>',},
  effect: 'drop-shadow(3px, 3px, 5px)'
});
const accessibleParkingSettings = {
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Accessible_Parking/FeatureServer/74',
  title: 'Accessible Parking',
  popupTemplate: {
    title: '{type} Parking',
    content: '<p><b>{location}</b></p>\
              <p>{spaces} Spaces</p>\
              <p>State Permit required all hours.</p>\
              <p>WWU Permit required M-F 8:00AM - 4:30PM</p>\
              <p>A valid state issued disability permit and a valid on-campus WWU purchased parking or permit are both required to park in a posted accessible parking space.</p>\
              <p>After 4:30pm weekdays and all hours on weekends, only a valid state issued disability permit is required for parking in a posted accessible parking space.</a></p>\
              <p><a href="https://disability.wwu.edu/">Disability Access Center</a></p>\
              <p><a href="https://transportation.wwu.edu/disability-access">Accessible Parking Information</a></p>\
              <p><a href="https://transportation.wwu.edu/">Parking Information</a></p>'},
  effect: 'drop-shadow(3px, 3px, 5px)',
  listMode: 'hide',
  visible: true,
};
const accessibleParking = new FeatureLayer(accessibleParkingSettings);
const accessibleGroup = new GroupLayer({
  title: 'Accessibility',
  layers: [accessibleWalkways, accessibleElevators, accessibleDoors, accessibleBuildingsGroup, accStairs, accessibleParking],
  visible: false,
});

/* Food */
const food = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Food/FeatureServer',
  title: 'Food (Retail / Residential)',
  visible: false,
  popupTemplate: {
    title: '{name} Food Service',
    content: '<p>{locations}</p>\
              <p>{building}</p>\
              <p>{goods}</p>\
              <p><a href="{wwu_link}">More Information</a></p>',}
});

/* Building Features */
const computerLabBuildings = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Computer_Labs_ATUS_ResTek/FeatureServer',
  title: 'Computer Labs (ATUS & ResTek)',
  visible: false,
  popupEnabled: false,
});
const sustainableBuildings = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Sustainable_Features_Buildings/FeatureServer',
  title: 'Sustainable Features & Buildings',
  visible: false,
  popupEnabled: false,
  effect: 'drop-shadow(3px, 3px, 5px)'
});
const genderNeutralRestrooms = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Gender_Neutral_Restrooms/FeatureServer',
  visible : true,
  popupEnabled: false,
  title: 'Gender Neutral Restrooms',
  visible: false,
  effect: 'drop-shadow(3px, 3px, 5px)'
});
const familyFeatures = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Family_Changing_Lactation__25k/FeatureServer',
  title: 'Family (Changing & Lactation)',
  popupEnabled: false,
  visible: false,
});

/* Search Layers */
const searchPoints = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/ArcGIS/rest/services/search_points/FeatureServer/171',
  visible: false,
  listMode: 'hide',
  popupTemplate: {
    title: '{Display}',}
});

/* Parking */

// NO POPUPS CURRENTLY: This defines the template for parking popups. It uses HTML syntax to format the popup.
const parkingPopupTemplate = {
  title: 'Parking Lot {abv}',
  content: '<p>{popup1} </p>\
            <p>{popup2}</p>\
            <p>{surface_3}</p>\
            <p><a href="https://transportation.wwu.edu">Parking Info</a></p>',

};
const summerZoneParkingLots = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Parking_Lots_Summer_Zones/FeatureServer',
  title: 'Summer Zone Parking Lots',
  visible: false  ,
  popupTemplate: parkingPopupTemplate,
  popupEnabled: false,
});
const visitorParkingLots = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Visitor_Parking_Lots/FeatureServer',
  title: 'Visitor Parking Lots',
  visible: true,
  popupTemplate: parkingPopupTemplate,
  popupEnabled: false,
});
const eveningWeekendParkingLots = new FeatureLayer({
  url:'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Evening_Weekend_Visitor_Parking_Lots/FeatureServer/3',
  title: 'Evening & Weekend Visitor Parking Lots',
  visible: false,
  popupTemplate: parkingPopupTemplate,
  popupEnabled: false,
});
const parkingPointFeatures = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Parking_Point_Features/FeatureServer',
  title: 'Parking Misc.',
  popupEnabled: false,
  popupTemplate: {
    title: '{type}',
    content: '<p>{location}</p>\
              <p><a href="https://transportation.wwu.edu">Parking Information</a></p>',},
  visible: true,
  popupEnabled: false,
});
const parkingPermitAcademic = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Permit_Parking_Lots_Academic_Year/FeatureServer',
  title: 'Permit Parking Lots (Academic Year)',
  visible: false,
  popupTemplate: parkingPopupTemplate,
  popupEnabled: false,
});

const accessibleParkingDupe = new FeatureLayer(accessibleParkingSettings);

// Unused for now
// const parkingArray = [parkingPermitAcademic, summerZoneParkingLots, eveningWeekendParkingLots, visitorParkingLots];

const parkingGroup = new GroupLayer({
  title: 'Parking (expand for options)',
  layers: [parkingPermitAcademic, summerZoneParkingLots, eveningWeekendParkingLots, visitorParkingLots, parkingPointFeatures, accessibleParkingDupe],
  visible: false,
});

/* Construction */
const constructionPoints = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Construction_pts/FeatureServer',
  title: 'Construction Locations',
  visible: true,
  popupTemplate: {
    title: '{Name} CONSTRUCTION',
    content: '<p>Estimated End Date: {EndDate}</p>\
              <p><a href="cpd.wwu.edu/construction-projects"> WWU Construction Projects</a></p>',
    fieldInfos:[{
      fieldName: 'EndDate',
      format: {
        dateFormat: 'day-short-month-year'
      }
    }]},
  definitionExpression: `((StartDate < CURRENT_TIMESTAMP AND EndDate > CURRENT_TIMESTAMP) OR (StartDate < CURRENT_TIMESTAMP AND EndDate IS NULL))`

});

const miscLabelPolys = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/label_popup_polys/FeatureServer',
  title: 'Miscellaneous Label Polygons',
  legendEnabled: false,
  visible: true,
  popupTemplate: {
    title: '{name}',
    content: '<p>{popup1}</p>\
              <p>{popup2}</p>\
              <p>{popup3}</p>\
              <p><a href="{url}">{url_text}</a></p>',},
});
const constructionGroup = new GroupLayer({
  title: 'Construction',
  layers: [constructionPoints, miscLabelPolys],
  visible: true,
});


/* Safety */
const emergencyPhones = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Emergency_Phones/FeatureServer/1',
  title: 'Emergency Phones',
  popupTemplate: {
    title: 'Emergency Phone Call Box',
    content: `<p><b>{location}</b></p>\
              <p>Emergency Phone</p>\
              <p>Uriversity Police:</p>\
              <p ${tabIndent}> Emergency: 360-650-3911</p>\
              <p ${tabIndent}> Safety Escort or Non-Emergency: 360-650-3555</p>
              <p ${tabIndent}> <a href="https://police.wwu.edu/">University Police</a></p>`,}
});
const snowRemoval = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Snow_Removal_Routes/FeatureServer/4',
  title: 'Snow Removal Routes',
  popupsEnabled: true,
  popupTemplate: {
    title: 'Priority Snow Removal Route',
    content: '<p>{snow_1}</p>\
              <p>{acc_1}',},
  visible: (new Date().getMonth() > 11 || new Date().getMonth() < 4), //only visible during winter months
});
const AED = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/AEDs/FeatureServer/3',
  title: 'AEDs',
  popupTemplate: {
    title: 'AED',
    content: '<p>Building: <b>{building}</b></p>\
              <p>Location: <b>{location}</b></p>\
              <p>AED (Automated External Defibrillator) Location</p>\
              <p><a href="https://ehs.wwu.edu/automatic-external-defibrillators-aeds">Additional AED Information</a></p>',},
});
const disasterAssemblyAreas = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Major_Disaster_Assembly_Areas/FeatureServer/0',
  title: 'Major Disaster Assembly Areas',
  popupTemplate: {
    title: '{type}',
    content: `<p><b>{location}</b></p>\
              <p>{type}</p>
              <p>For more information:</p>\
              <p ${tabIndent}><a href="https://emergency.wwu.edu/">Safety & Emergency Information</a></p>\
              <p ${tabIndent}><a href=" https://emergency.wwu.edu/faq">Emergency FAQ</a></p>`,},
  visible: false,
});

const safetyArray = [emergencyPhones, snowRemoval, AED, disasterAssemblyAreas];
const safetyGroup = new GroupLayer({
  title: 'Safety (expand for options)',
  layers: [disasterAssemblyAreas, AED, emergencyPhones, snowRemoval],
  visible: false,
});

/* Art */
const artGalleries = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Art_Galleries/FeatureServer/1',
  title: 'Art Galleries',
  popupTemplate: {
    title: '{name}',
    content: '<p><img src="{image}" alt="{name}" width="200"></p>\
              <p>{note_1}</p>\
              <p>{note_2}</p>\
              <p>{loc_note}</p>\
              <p><a href="{url}">{url_text}</a></p>'
  },
  effect: 'drop-shadow(3px, 3px, 5px)'
});
const scupltures = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Sculpture/FeatureServer/2',
  title: 'Sculptures',
  popupTemplate: {
    title: '{name}',
    content: '<img src="{image}" alt="{name}" width="200">\
              <p>{artist}</p>\
              <p>{year}</p>\
              <p><a href="{url}">{url_text}</a></p>'
  }
});
const scultpureTour = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Sculpture_Tour/FeatureServer/3',
  title: 'Sculpture Tour',
  popupTemplate: {
    title: 'Campus Scultpure Tour',
    content: '<p>{acc_1}</p>\
              <p><a href="https://westerngallery.wwu.edu/sculpture-collection">Western’s Sculpture Collection</a></p>'
  },
  effect: 'drop-shadow(3px, 3px, 5px)'
});
const artGroup = new GroupLayer({
  title: 'Art',
  layers: [scultpureTour, artGalleries, scupltures],
  visible: false,
});

/* Trees */

// For this we are going to need to use a function to define the popups because of the way that they constructed the db
// This function takes in a feature and returns a popupTemplate
function treePopupTemplate(feature) {
  if(feature.graphic.attributes.tree_species == 'Other') {
    return '{tree_species_other}'}
  else {
    return '{tree_species}'
  }
};


const trees = new FeatureLayer({
  url:'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/tree_pts/FeatureServer',
  title: 'Trees',
  popupTemplate: {
    title: treePopupTemplate,
    content: [{type: 'attachments'}]
  },
  visible: false,

  renderer: {
    type: "simple",
    symbol: {
      type: "simple-marker",
      path: "M4,17h7v4H8a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2H13V17h7a1,1,0,0,0,.759-1.651L16.174,10H18a1,1,0,0,0,.759-1.651l-6-7a1.033,1.033,0,0,0-1.518,0l-6,7A1,1,0,0,0,6,10H7.826L3.241,15.349A1,1,0,0,0,4,17Zm6.759-7.349A1,1,0,0,0,10,8H8.174L12,3.537,15.826,8H14a1,1,0,0,0-.759,1.651L17.826,15H6.174Z",
      size: 16,
      color: 'green',
    }
  },
  // Required to make popup function work
  outFields: ['*'],


});


// This function waits for the tree layer to load completely and then logs it to the console

/* Bus Layers */
const busRoutes = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/WTA_Bus_Routes/FeatureServer/1',
  title: 'WTA Bus Routes',
  popupTemplate: {title: 'WTA Bus Route',
                  content: '<p>Route: <b>{route}</b></p>\
                            <p>For full route and schedule information: <a href="https://www.ridewta.com/">https://www.ridewta.com/</a></p>'
  }
});
const busStops = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/WTA_Bus_Stops/FeatureServer/0',
  title: 'WTA Bus Stops',
  popupTemplate: {
    title: 'WTA Bus Stop at {point_name}',
    content: '<p>WTA Bus Stop {roof} a roof.</p>\
              <p>This bus stop {seating} seating.</p>\
              <p>For full route and schedule information: <a href="https://www.ridewta.com/">https://www.ridewta.com/</a></p>',},
  effect: 'drop-shadow(3px, 3px, 5px)'
});
const busGroup = new GroupLayer({
  title: 'Bus Info (WTA near WWU)',
  layers: [busRoutes, busStops],
  visible: false,
  listMode: "hide-children",
});

/* Bicycle Group */

const bikeRacks = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Bicycle_Racks/FeatureServer/173',
  title: 'Bicycle Racks',
  popupEnabled: true,
  popupTemplate: {
    title: '{type}',},
  effect: 'drop-shadow(3px, 3px, 5px)',
});
const thruBikeRoutes = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Thru_Campus_Bike_Routes/FeatureServer/0',
  title: 'Through Campus Bike Routes',
  popupEnabled: true,
  popupTemplate: {
    title: 'Through Campus Bike Routes',
    content: '<p>{note}</p>',},
  renderer: {
    type: 'simple',
    symbol: {
      type: 'simple-line',
      color: '#000000',
      width: 4,
      style: 'dot',
    }
  },
});
const bikeDesignations = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Bicycle_Designations/FeatureServer/185',
  title: 'Bicycle Designations',
  popupEnabled: true,
  popupTemplate: {
    title: 'Bicycle Designation: {bike}',},
});
const bellinghamBikeRoutes = new FeatureLayer({ 
  url: 'https://maps.cob.org/arcgis4/rest/services/Maps/Grp_Transportation/MapServer/14',
  title: 'Bellingham Bike Routes',
  popupEnabled: true,
  popupTemplate: {
    title: 'City Of Bellingham Bike Route',
    content: '<p><b>{Name}</b></p>\
              <p>{FacilityType}</p>\
              <p>{MapSymbol}</p>\
              <p><a href="https://cob.org/services/transportation/biking">Biking in Bellingham</a></p>'
  },
  visible: false,
});

const accStairsBikes = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Stairs/FeatureServer',
  title: 'Stairs',
  legendEnabled: true,
  listMode: 'hide',
  popupEnabled: false,
  visible: true,
});
const sehomeNotAllowed = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Sehome_Hill/FeatureServer',
  title: 'Sehome Hill (Bikes Prohibited)',
  visible: true,
  popupEnabled: false,
  listMode: 'hide',
});




const bikeGroup = new GroupLayer({
  title: 'Bicycle Info',
  layers: [bellinghamBikeRoutes, bikeDesignations, bikeRacks, thruBikeRoutes, sehomeNotAllowed, accStairsBikes],
  visible: false,
});

/* Baselayer */
const dummyBasemap = new FeatureLayer({
  url: 'https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/DummyBasemapForLegend/FeatureServer',
  title: '',
  legendEnabled: true,
  listMode: 'hide',
});
const tileBaseLayer = new VectorTileLayer({
  url: 'https://tiles.arcgis.com/tiles/qboYD3ru0louQq4F/arcgis/rest/services/WWUbasemap/VectorTileServer',
  title: 'WWU Basemap',
  visible: true,
  listMode: 'hide',
});
const basemapGroup = new GroupLayer({
  title: '',
  layers: [tileBaseLayer, dummyBasemap],
  visible: true,
  listMode: 'hide',
});

/* A dictionary that is used to tie URL layer names to internal variables */
/* Add here to create custom URLs for each of the layer groups */
const layersDict = {
  'art': [artGroup],
  'bike': [bikeGroup],
  'bicycle': [bikeGroup],
  'bus': [busGroup],
  'computer': [computerLabBuildings],
  'family': [familyFeatures],
  'food': [food],
  'gnrr': [genderNeutralRestrooms],
  'parking': [parkingGroup],
  'safety': [safetyGroup],
  'sustainable': [sustainableBuildings],
  'sustainability': [sustainableBuildings],
  'safety': [safetyGroup],
  'trees': [trees],
  'accessibility': [accessibleGroup],
  'visitor': [parkingGroup],
  'parking': [parkingGroup],
  // These layers are handled differently because they are grouped and need to be toggled on/off
  'evening': [eveningWeekendParkingLots],
  'summer': [summerZoneParkingLots],
  'permit': [parkingPermitAcademic],
  'snow': [snowRemoval],

};


/* A table for the layers that should always be on **not used** */

// const alwaysOnLayers = [basemapGroup, buildingInfoGroup, ];

/* Layers to load  */
const allLayers = [basemapGroup, constructionGroup, //basemap must be first
  searchPoints, trees, sustainableBuildings, safetyGroup, parkingGroup,
  genderNeutralRestrooms, food, familyFeatures, computerLabBuildings, 
  busGroup, bikeGroup, artGroup, accessibleGroup, buildingInfoGroup, miscAlwaysOnGroup,];

// Format: "ABV": [Lon, Lat]
// These get added to the dictionary that the hash query can use to set location from the hash
const customPlaces = {

};

/* Processes the hash and runs the correct functions based on hash length */

const hashActions = function (hash = hashProcesser()) {
  const hashSplit = hash.split('&');
  hashSplit.forEach(param => {
    const keyValue = param.split('=');
    const key = keyValue[0] && keyValue[0].toUpperCase();
    const value = keyValue[1] && keyValue[1].toUpperCase(); // Ensure value is in uppercase

    switch (key) {
      // Each is just an alias for the building case
      case 'FIND':
      case 'WWU':
      case 'BUILDING':
        setLocationFromHash(view, value);
        break;
      case 'LAYERS':
        if (value){
          const enabledLayersString = value.toLowerCase().split('/');
          enabledLayersString.forEach(group => {
            // Kinda hacky, but it works

            if (group === 'airphoto') {
              document.getElementsByClassName('esri-basemap-toggle')[0].click();
            }
            // Funky logic to handle parking layers
            else if (['permit', 'summer', 'evening'].includes(group)) {
              parkingGroup.visible = true;
              layersDict[group].forEach(layer => {
                layer.visible = true;
              });
            }
            // Funky logic to handle snow layer from url
            else if (group === 'snow')  {
              safetyGroup.visible = true;
              safetyArray.forEach(layer => {
                layer.visible = false;
              });
              layersDict[group].forEach(layer => {
                layer.visible = true;
              });
            }
            else {
            (layersDict[group] || []).forEach(layer => {
              layer.visible = true;
            })};
          });
        }
        break;
    }
  });
};


/* Gets the location definined in the hash*/
const getLocationFromHash = function(places, loc) {
  console.log('getting location from hash')
  const locUpper = loc.toUpperCase();
  if (loc in Object.assign({}, places, customPlaces)){
    return({
      zoom: 18.5,
      center: [places[loc][0], places[loc][1]]
    });
  };
};

/* Queries the search info layer and places every location into the places dictionary*/
const getPlaces = function(layer){
  console.log('getting places')
  // Creates a new Promise that will resolve with dictionary
  return new Promise((resolve, reject) => {
    layer.queryFeatures().then(result => {
      // Reduces query to just the abv and coordinates
      const featuresProc = (result.features).reduce((acc, feature) => {
        acc[feature.attributes.Abv] = [feature.geometry.longitude,feature.geometry.latitude];
        return acc;
          }, {});
            resolve(featuresProc);
      }).catch(error => {reject(error);})
    }
  );
};

// Uses the getPlaces, getLocation functions to set the center based on the map
const setLocationFromHash = function(view, loc){
  if (window.location.hash !== '' || window.location.search !== ''){
    try{
      console.log('setting location from hash')
      // This will execute async to the map loading, so it may take a sec to snap to the new location.
      // Query speed dependent
      getPlaces(searchPoints).then(result => 
        getLocationFromHash(result, loc)).then(result => 
          view.goTo(result));
    } catch(error) {
      console.error(error);
    };
  };
};

/* Creates the Map and View */
const map = new Map({
  basemap: "streets-vector",
  layers: allLayers,

});

const view = new MapView({
  container: "map",
  map: map,
  zoom: zoom,
  center: center,
  popupEnabled: true,
  popup: {
    defaultPopupTemplateEnabled: true,
    dockOptions: {
      position: 'bottom-right',
    },
  },
  constraints: {
    snapToZoom: false,
    minZoom: 13,
    maxZoom: 20,
  },
});

// Sets the location based on the hash and adds layers AFTER the map loads
reactiveUtils.whenOnce(() => !view.updating).then(() => hashActions());

/* Bookmarks */
const buildingBookmarks = new Bookmarks({
  view: view,
  bookmarks: [
// condensed line format, from google spreadsheet formater...
  new Bookmark({name: "Academic Instructional Center", viewpoint: {targetGeometry: {type: "extent",xmin:-122.487316, ymin:48.73133517, xmax:-122.484224, ymax:48.7327802 }  }  }),
  new Bookmark({name: "Academic Instructional West", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4881142, ymin:48.73128564, xmax:-122.4850222, ymax:48.73273067 }  }  }),
  new Bookmark({name: "Admin Services Center", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4752071, ymin:48.73031057, xmax:-122.4721151, ymax:48.73175563 }  }  }),
  new Bookmark({name: "Alma Clark Glass Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4898971, ymin:48.73536805, xmax:-122.486805, ymax:48.73681297 }  }  }),
  new Bookmark({name: "Alumni House", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4842795, ymin:48.74004371, xmax:-122.4811874, ymax:48.74148848 }  }  }),
  new Bookmark({name: "Archives Building (Wa. State)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4872448, ymin:48.72534432, xmax:-122.4841528, ymax:48.72678952 }  }  }),
  new Bookmark({name: "Arntzen Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4871312, ymin:48.73312002, xmax:-122.4840391, ymax:48.734565 }  }  }),
  new Bookmark({name: "Arts Annex", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4867384, ymin:48.73507307, xmax:-122.4836464, ymax:48.73651799 }  }  }),
  new Bookmark({name: "Biology Bldg.", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4885165, ymin:48.73321226, xmax:-122.4854245, ymax:48.73465723 }  }  }),
  new Bookmark({name: "Birnam Wood (Residences)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4815013, ymin:48.72974653, xmax:-122.4750125, ymax:48.73263664 }  }  }),
  new Bookmark({name: "Bond Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4874994, ymin:48.73587291, xmax:-122.4844074, ymax:48.73731781 }  }  }),
  new Bookmark({name: "Bookstore (Viking Union)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4876661, ymin:48.7379062, xmax:-122.4844218, ymax:48.73935104 }  }  }),
  new Bookmark({name: "Buchanan Towers", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4883247, ymin:48.72612309, xmax:-122.4852326, ymax:48.72756826 }  }  }),
  new Bookmark({name: "Campus Services", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4914188, ymin:48.72676146, xmax:-122.4883268, ymax:48.72820662 }  }  }),
  new Bookmark({name: "Canada House", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4895245, ymin:48.73718852, xmax:-122.4864325, ymax:48.73863338 }  }  }),
  new Bookmark({name: "Carver", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4881961, ymin:48.73531926, xmax:-122.4849518, ymax:48.73676417 }  }  }),
  new Bookmark({name: "Chemistry Bldg. (Morse Hall)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4882102, ymin:48.73397016, xmax:-122.4851181, ymax:48.73541511 }  }  }),
  new Bookmark({name: "College Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4885771, ymin:48.7364015, xmax:-122.4854851, ymax:48.73784639 }  }  }),
  new Bookmark({name: "Commissary", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4860323, ymin:48.72656925, xmax:-122.4829402, ymax:48.72801442 }  }  }),
  new Bookmark({name: "Communications Facility", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4867747, ymin:48.73201848, xmax:-122.4836826, ymax:48.73346349 }  }  }),
  new Bookmark({name: "Edens Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4849894, ymin:48.7383615, xmax:-122.4818973, ymax:48.73980633 }  }  }),
  new Bookmark({name: "Edens Hall North", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4844894, ymin:48.73878604, xmax:-122.4813974, ymax:48.74023085 }  }  }),
  new Bookmark({name: "(Ross) Engineering Technology", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4870793, ymin:48.73396025, xmax:-122.4839873, ymax:48.73540521 }  }  }),
  new Bookmark({name: "Environmental Studies Bldg.", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4870022, ymin:48.73268226, xmax:-122.4839101, ymax:48.73412725 }  }  }),
  new Bookmark({name: "Fairhaven College (Admin Bldg.)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4874022, ymin:48.72941124, xmax:-122.4841578, ymax:48.73118862 }  }  }),
  new Bookmark({name: "Fairhaven Stacks (Resicences)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4875288, ymin:48.72849973, xmax:-122.4842844, ymax:48.73027714 }  }  }),
  new Bookmark({name: "Fine Arts Bldg.", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4867446, ymin:48.73471741, xmax:-122.4836526, ymax:48.73616234 }  }  }),
  new Bookmark({name: "Fraser Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4860859, ymin:48.7364015, xmax:-122.4829938, ymax:48.73784639 }  }  }),
  new Bookmark({name: "Haggard Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4878326, ymin:48.73664775, xmax:-122.4847405, ymax:48.73809263 }  }  }),
  new Bookmark({name: "Higginson Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4848864, ymin:48.73909737, xmax:-122.4817944, ymax:48.74054217 }  }  }),
  new Bookmark({name: "High Street Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4896779, ymin:48.7366152, xmax:-122.4865859, ymax:48.73806008 }  }  }),
  new Bookmark({name: "Humanities Bldg.", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4866215, ymin:48.73665526, xmax:-122.4833771, ymax:48.73810014 }  }  }),
  new Bookmark({name: "Interdisciplinary Science Bldg.", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4892311, ymin:48.73290855, xmax:-122.4859866, ymax:48.73435353 }  }  }),
  new Bookmark({name: "LIBRARY", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4874494, ymin:48.73710098, xmax:-122.484205, ymax:48.73854585 }  }  }),
  new Bookmark({name: "Mathes Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4863085, ymin:48.73917928, xmax:-122.4830641, ymax:48.74062408 }  }  }),
  new Bookmark({name: "Miller Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4864115, ymin:48.73571097, xmax:-122.4831671, ymax:48.73715588 }  }  }),
  new Bookmark({name: "Morse Hall Chemistry Bldg.", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4882864, ymin:48.73397016, xmax:-122.4850419, ymax:48.73541511 }  }  }),
  new Bookmark({name: "Nash Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4854304, ymin:48.73946104, xmax:-122.4821859, ymax:48.74090584 }  }  }),
  new Bookmark({name: "OLD MAIN", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4856985, ymin:48.73721523, xmax:-122.4824542, ymax:48.73866009 }  }  }),
  new Bookmark({name: "Parks Hall", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4881978, ymin:48.73278938, xmax:-122.4849534, ymax:48.73423437 }  }  }),
  new Bookmark({name: "Performing Arts Center (PAC)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4888652, ymin:48.73727847, xmax:-122.4856207, ymax:48.73872333 }  }  }),
  new Bookmark({name: "Physical Plant", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4847951, ymin:48.72388683, xmax:-122.4815507, ymax:48.72533207 }  }  }),
  new Bookmark({name: "Recreation Center", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4907699, ymin:48.73083945, xmax:-122.4875255, ymax:48.73228449 }  }  }),
  new Bookmark({name: "Ridgeway (Residences)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4928181, ymin:48.73210621, xmax:-122.4863293, ymax:48.73566072 }  }  }),
  new Bookmark({name: "Ross Engineering Technology", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4872144, ymin:48.73393895, xmax:-122.48397, ymax:48.73538391 }  }  }),
  new Bookmark({name: "SMATE (Sci. Math Tech. Ed.)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4888065, ymin:48.73450081, xmax:-122.4855622, ymax:48.73594575 }  }  }),
  new Bookmark({name: "Steam Plant", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4864913, ymin:48.73425031, xmax:-122.4832469, ymax:48.73569526 }  }  }),
  new Bookmark({name: "Viking Commons", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4868925, ymin:48.73848313, xmax:-122.4836481, ymax:48.73992796 }  }  }),
  new Bookmark({name: "VIKING UNION", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4877315, ymin:48.73798218, xmax:-122.4844871, ymax:48.73942702 }  }  }),
  new Bookmark({name: "Viqueen Lodge (Sinclair Island)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.7009019, ymin:48.61598908, xmax:-122.6906451, ymax:48.6216205 }  }  }),
  new Bookmark({name: "Wilson Library", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4874494, ymin:48.73710098, xmax:-122.484205, ymax:48.73854585 }  }  }),
  ]
});
const poiBookmarks = new Bookmarks({
  view: view,
  bookmarks: [
  new Bookmark({name: 'WWU Main Campus', viewpoint: {targetGeometry: new Point({x: center[0], y: center[1], spatialReference: {wkid: 4326}}),scale: 13000}}),
  new Bookmark({name: "Birnam Wood (Residences)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4815013, ymin:48.72941423, xmax:-122.4750125, ymax:48.73296892 }  }  }),
  new Bookmark({name: "Bookstore", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4876661, ymin:48.73774008, xmax:-122.4844218, ymax:48.73951716 }  }  }),
  new Bookmark({name: "Canyon Creek Community Forest", viewpoint: {targetGeometry: {type: "extent",xmin:-122.0828454, ymin:48.81144319, xmax:-122.0224137, ymax:48.84448513 }  }  }),
  new Bookmark({name: "College of the Environment", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4871919, ymin:48.73279303, xmax:-122.4839475, ymax:48.73423802 }  }  }),
  new Bookmark({name: "COVID-19 Student Test Site", viewpoint: {targetGeometry: {type: "extent",xmin:-122.488872, ymin:48.73647689, xmax:-122.4856276, ymax:48.73792177 }  }  }),
  new Bookmark({name: "Everett Community College (Everett)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.214467, ymin:47.99910888, xmax:-122.1897142, ymax:48.01286347 }  }  }),
  new Bookmark({name: "Fairhaven College", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4874022, ymin:48.7295774, xmax:-122.4841578, ymax:48.73102248 }  }  }),
  new Bookmark({name: "Fairhaven (Residences)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4875288, ymin:48.72866588, xmax:-122.4842844, ymax:48.73011099 }  }  }),
  new Bookmark({name: "Harrington Field", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4902046, ymin:48.72781522, xmax:-122.4869602, ymax:48.72926035 }  }  }),
  new Bookmark({name: "Haskell Plaza", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4879043, ymin:48.73340443, xmax:-122.4846599, ymax:48.73484941 }  }  }),
  new Bookmark({name: "Lakewood", viewpoint: {targetGeometry: {type: "extent",xmin:-122.3440808, ymin:48.72770015, xmax:-122.337592, ymax:48.73059037 }  }  }),
  new Bookmark({name: "Lincoln Creek Parking Lot", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4685641, ymin:48.73322895, xmax:-122.46238, ymax:48.73661648 }  }  }),
  new Bookmark({name: "Old Main", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4856985, ymin:48.7370491, xmax:-122.4824542, ymax:48.73882622 }  }  }),
  new Bookmark({name: "Olympic College (Poulsbo)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.6699521, ymin:47.76003746, xmax:-122.6541103, ymax:47.76888154 }  }  }),
  new Bookmark({name: "Outback Farm", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4881683, ymin:48.72748826, xmax:-122.4849238, ymax:48.7289334 }  }  }),
  new Bookmark({name: "Outdoor Center", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4881511, ymin:48.73831235, xmax:-122.4849067, ymax:48.73975718 }  }  }),
  new Bookmark({name: "PAC (Performing Arts Center)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4888652, ymin:48.73711235, xmax:-122.4856207, ymax:48.73888945 }  }  }),
  new Bookmark({name: "Parking / Transportation (Old Main)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4852839, ymin:48.73705304, xmax:-122.4832074, ymax:48.7381904 }  }  }),
  new Bookmark({name: "Peninsula College (Pt. Angles)", viewpoint: {targetGeometry: {type: "extent",xmin:-123.4167342, ymin:48.09944828, xmax:-123.4102454, ymax:48.1030473 }  }  }),
  new Bookmark({name: "Planetarium", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4879794, ymin:48.73667785, xmax:-122.484735, ymax:48.73812272 }  }  }),
  new Bookmark({name: "Red Square", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4871447, ymin:48.7361896, xmax:-122.4839003, ymax:48.73763449 }  }  }),
  new Bookmark({name: "Ridgeway (Residences)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4928181, ymin:48.7324385, xmax:-122.4863293, ymax:48.73532846 }  }  }),
  new Bookmark({name: "SEA Discovery Center (Poulsbo)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.6467294, ymin:47.7320836, xmax:-122.6440715, ymax:47.73356829 }  }  }),
  new Bookmark({name: "Sehome Hill Arboretum", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4952772, ymin:48.72934315, xmax:-122.469322, ymax:48.74090268 }  }  }),
  new Bookmark({name: "Shannon Pt. Marine Center", viewpoint: {targetGeometry: {type: "extent",xmin:-122.687355, ymin:48.50674713, xmax:-122.6808662, ymax:48.50965003 }  }  }),
  new Bookmark({name: "Student Health Center", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4915529, ymin:48.72677561, xmax:-122.4883086, ymax:48.72822077 }  }  }),
  new Bookmark({name: "Viking Union", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4877315, ymin:48.73781605, xmax:-122.4844871, ymax:48.73959313 }  }  }),
  new Bookmark({name: "Viking Union Gallery", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4881005, ymin:48.73826073, xmax:-122.484856, ymax:48.73970556 }  }  }),
  new Bookmark({name: "Viqueen Lodge (Sinclair Island)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.7009019, ymin:48.61598908, xmax:-122.6906451, ymax:48.6216205 }  }  }),
  new Bookmark({name: "Wash. State Archives", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4872448, ymin:48.72521989, xmax:-122.4841528, ymax:48.72691395 }  }  }),
  new Bookmark({name: "Western Gallery", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4869975, ymin:48.73461097, xmax:-122.4837531, ymax:48.7360559 }  }  }),
  new Bookmark({name: 'WWU Main Campus', viewpoint: {targetGeometry: new Point({x: center[0], y: center[1], spatialReference: {wkid: 4326}}),scale: 13000}}),
  ],
});
const parkingBookmarks = new Bookmarks({
  view: view,
  bookmarks: [
    new Bookmark({name: "Lincoln Creek Parking Lot", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4685641, ymin:48.73322895, xmax:-122.46238, ymax:48.73661648 }  }  }),
    new Bookmark({name: "Parking Lot 1-R", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4875838, ymin:48.72618268, xmax:-122.4844918, ymax:48.72762785 }  }  }),
    new Bookmark({name: "Parking Lot 3-R", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4826829, ymin:48.7397057, xmax:-122.4795909, ymax:48.74115049 }  }  }),
    new Bookmark({name: "Parking Lot 4-R", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4857771, ymin:48.73974108, xmax:-122.482685, ymax:48.74118587 }  }  }),
    new Bookmark({name: "Parking Lot 5-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4846269, ymin:48.73916901, xmax:-122.4815348, ymax:48.74061382 }  }  }),
    new Bookmark({name: "Parking Lot 6-V", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4873653, ymin:48.73876565, xmax:-122.4842732, ymax:48.74021046 }  }  }),
    new Bookmark({name: "Parking Lot 7-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4835036, ymin:48.73971949, xmax:-122.4804116, ymax:48.74116428 }  }  }),
    new Bookmark({name: "Parking Lot 8-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.485441, ymin:48.73717739, xmax:-122.482349, ymax:48.73862225 }  }  }),
    new Bookmark({name: "Parking Lot 9-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4891983, ymin:48.73374409, xmax:-122.4861062, ymax:48.73518905 }  }  }),
    new Bookmark({name: "Parking Lot 10-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4876458, ymin:48.73483595, xmax:-122.4814617, ymax:48.73772577 }  }  }),
    new Bookmark({name: "Parking Lot 11-CP (Carpool)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.488695, ymin:48.73733205, xmax:-122.4874285, ymax:48.73802577 }  }  }),
    new Bookmark({name: "Parking Lot 11-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4894364, ymin:48.73683068, xmax:-122.4863444, ymax:48.73827555 }  }  }),
    new Bookmark({name: "Parking Lot 12-A", viewpoint: {targetGeometry: {type: "extent",xmin:-122.48848, ymin:48.72954268, xmax:-122.4853879, ymax:48.73098776 }  }  }),
    new Bookmark({name: "Parking Lot 13-A", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4856741, ymin:48.72387787, xmax:-122.482582, ymax:48.72532311 }  }  }),
    new Bookmark({name: "Parking Lot 15-R", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4908071, ymin:48.73445218, xmax:-122.487715, ymax:48.73589712 }  }  }),
    new Bookmark({name: "Parking Lot 17-CP (Carpool)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4857962, ymin:48.7339307, xmax:-122.4838173, ymax:48.73501472 }  }  }),
    new Bookmark({name: "Parking Lot 17-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4880491, ymin:48.73210872, xmax:-122.4818651, ymax:48.7349987 }  }  }),
    new Bookmark({name: "Parking Lot 19-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4886533, ymin:48.73188298, xmax:-122.4855612, ymax:48.733328 }  }  }),
    new Bookmark({name: "Parking Lot 20-R", viewpoint: {targetGeometry: {type: "extent",xmin:-122.492646, ymin:48.73119843, xmax:-122.4895539, ymax:48.73264347 }  }  }),
    new Bookmark({name: "Parking Lot 22-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4864667, ymin:48.72660501, xmax:-122.4833747, ymax:48.72805017 }  }  }),
    new Bookmark({name: "Parking Lot 23-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4915654, ymin:48.72730185, xmax:-122.4884734, ymax:48.728747 }  }  }),
    new Bookmark({name: "Parking Lot 24-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4849414, ymin:48.72380134, xmax:-122.4818494, ymax:48.72524659 }  }  }),
    new Bookmark({name: "Parking Lot 25-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.489115, ymin:48.73744247, xmax:-122.4860229, ymax:48.73888733 }  }  }),
    new Bookmark({name: "Parking Lot 26-CP (Carpool)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4878682, ymin:48.73024569, xmax:-122.4858893, ymax:48.73132979 }  }  }),
    new Bookmark({name: "Parking Lot 27-R", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4815428, ymin:48.72979936, xmax:-122.4753587, ymax:48.73268946 }  }  }),
    new Bookmark({name: "Parking Lot 29-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4870443, ymin:48.72988638, xmax:-122.4839523, ymax:48.73133146 }  }  }),
    new Bookmark({name: "Parking Lot 30-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4833627, ymin:48.74037777, xmax:-122.4818167, ymax:48.74110016 }  }  }),
    new Bookmark({name: "Parking Lot 32-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4753207, ymin:48.73050959, xmax:-122.4722287, ymax:48.73195464 }  }  }),
    new Bookmark({name: "Parking Lot 33-G", viewpoint: {targetGeometry: {type: "extent",xmin:-122.486526, ymin:48.72542256, xmax:-122.483434, ymax:48.72686776 }  }  }),
    new Bookmark({name: "Parking Lot 18-R", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4889017, ymin:48.72818935, xmax:-122.4858096, ymax:48.72963447 }  }  }),
    new Bookmark({name: "Parking Lot AIC", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4858305, ymin:48.73172883, xmax:-122.4842845, ymax:48.73245134 }  }  }),
    new Bookmark({name: "Parking Lot C", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4924214, ymin:48.7283076, xmax:-122.4862373, ymax:48.73119779 }  }  }),
    new Bookmark({name: "Parking Lot CBS", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4882264, ymin:48.73429114, xmax:-122.4862474, ymax:48.73537514 }  }  }),
    new Bookmark({name: "Parking Lot ET", viewpoint: {targetGeometry: {type: "extent",xmin:-122.485699, ymin:48.73417214, xmax:-122.4844325, ymax:48.73486591 }  }  }),
    new Bookmark({name: "Parking Lot LC (Lincoln Creek)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4685641, ymin:48.73347777, xmax:-122.46238, ymax:48.73636767 }  }  }),
    new Bookmark({name: "Parking Office (Old Main)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4852839, ymin:48.73705304, xmax:-122.4832074, ymax:48.7381904 }  }  }),
  ],
});

///* Widgets!! *///

/* Locate widget using a simple marker as the symbol (Prob change) */
const locate = new Locate({
  view: view,
  graphic: new Graphic({
    symbol: {type: 'simple-marker'}
  }),
  container: locateWidget
});

/* Layer Selector Widget */
const selector = new LayerList({
  view: view,
});

/* Legend Widget */

const legend = new Legend({
  view: view,
}); 

/* Search Widget */
const search = new Search({
  view: view,
  locationEnabled: false,
  includeDefaultSources: false,
  popupTemplate:{
    title: '{Display}',
  },
  container: 'searchWidget',
  sources: [
    {
      minSuggestCharacters: 2,
      prefix: '%',
      suffix: '%',
      placeholder: 'Search buildings, parking, etc.',
      layer: searchPoints,
      searchFields: ['Abv','Name', 'Keywords'],
      displayField: 'Display',
      name: 'WWU Search Points',
      zoomScale: 1000
    },
]
});

/* Home Button Widget */
const home = new Home({
  view: view,
  viewpoint: {
    targetGeometry: new Point({
      x: center[0],
      y: center[1],
      spatialReference: {wkid: 4326}
    }),
    scale: 13000
  }
});

/* Basemap Toggle Widget */
const basemapToggle = new BasemapToggle({
  view: view,
  nextBasemap: 'satellite',
  label: 'Toggle Basemap',
});


/* Zoom Slider -- Not Currently Used*/
// const zoomSlider = new Slider({
//   min: 13,
//   max: 20,
//   layout: 'vertical',
//   steps: [13, 14.56, 16, 18, 20],
//   values: [ zoom ],
//   tickConfigs: [{
//     mode: "position",
//     values: [13, 14.56, 16, 18, 20],
//     labelsVisible: true,
//     labelFormatFunction: function(value, type) {

//       return (value === 14.56) ? "Home" : "";
//     }
//   }],
//   labelsVisible: true,
//   expandTooltip: 'Zoom Slider',
// });

/* Measure Widget */
const measure = new Measurement({
  view: view,
  container: document.createElement("div"),
  activeTool: "null", // starts measure as inactive
});


/* Expand Widgets */
const buildingBookmarkExpand = new Expand({
  view: view,
  autoCollapse: true,
  content: buildingBookmarks,
  expandIcon: 'urban-model',
  group: 'top-right',
  expandTooltip: 'Buildings',
});
const poiBookmarkExpand = new Expand({
  view: view,
  autoCollapse: true,
  content: poiBookmarks,
  expandIcon: 'map-pin',
  group: 'top-right',
  expandTooltip: 'Points of Interest',

});
const parkingBookmarksExpand = new Expand({
  view: view,
  autoCollapse: true,
  content: parkingBookmarks,
  expandIcon: 'car',
  group: 'top-right',
  expandTooltip: 'Parking',
});
const selectorExpand = new Expand({
  view: view,
  content: selector,
  group: 'top-left',
  expandTooltip: 'Layer Selector',
});
const legendExpand = new Expand({
  view: view,
  content: legend,
  mode: "floating",
  expandTooltip: "Legend",
  container: "legend",
  expanded: false,
  group:  'top-left',
});
const searchExpand = new Expand({
  view: view,
  content: search,
  expandIcon: 'search',
  expandTooltip: 'Search',
  mode: 'floating',
});
// const zoomExpand = new Expand({
//   container: "zoomSlider",
//   expanded: true,
//   view: view,
//   content: zoomSlider,
//   expandIcon: 'caret-double-vertical',
//   mode: 'floating',
//   expandTooltip: 'Expand Zoom Slider',
// });
const printExpand = new Expand({
  view: view,
  content: new Print({view: view,}),
  expandIcon: 'print',
  expandTooltip: 'Print',
  mode: 'floating',
  container: 'printWidget',
});
/* Disabled in CSS when on mobile */
const measureExpand = new Expand({
  view: view,
  content: measure,
  expandIcon: 'measure',
  expandTooltip: 'Measure',
  mode: 'floating',
  container: 'measureWidget',
});

/* Add UI elements */

// Top Left
// view.ui.add(zoomExpand, 'top-left') -- Zoom slider is disabled for now. It is fully functional, but the UI is not ideal.
view.ui.move(["zoom"], 'top-left') // Moves the default zoom buttons below the zoom slider
view.ui.add(home, 'top-left');
view.ui.add(selectorExpand, 'top-left');
view.ui.add(legendExpand, 'top-left');

// Top Right
view.ui.add(searchExpand, 'top-right');
view.ui.add(locate, 'top-right');
view.ui.add([poiBookmarkExpand, buildingBookmarkExpand, parkingBookmarksExpand], 'top-right');

// Bottom Left
view.ui.add(basemapToggle, 'bottom-left');
view.ui.add(printExpand, 'bottom-left');


// Bottom Right
view.ui.add(new ScaleBar({view: view, unit: 'dual'}), 'bottom-right');
view.ui.add(measureExpand, 'bottom-right');


/* Event Listeners */

// Change opacity of imagery basemap when toggled
basemapToggle.watch('activeBasemap', () => {
  if(basemapToggle.activeBasemap.title === "Imagery"){
    tileBaseLayer.set('visible', false);
  }
  else{
    tileBaseLayer.set('visible', true);
  }
});

// This section is for parking layer visibility radio buttons
// Create an array of all the layers
const parkingRadioArray = [summerZoneParkingLots, visitorParkingLots, eveningWeekendParkingLots, parkingPermitAcademic];

// Function to set the visibility of layers
function setLayerVisibility(activeLayer) {
  parkingRadioArray.forEach(layer => {
    layer.visible = (layer === activeLayer);
  });
}

// Add event listeners to each layer to control visibility


// Set the visibility of the layer when the radio button is clicked
parkingRadioArray.forEach(layer => {
  layer.watch("visible", () => {
    if (layer.visible) {
      setLayerVisibility(layer);
    }
  });
});

// Changes the active tool when measure expand is expanded or collapsed
measureExpand.watch('expanded', () => {
  if (measureExpand.expanded) {
    measure.activeTool = 'distance';
  }
  else {
    measure.activeTool = null;
  }
});

// This listener is for the search widget to focus on the search bar when expanded
// Has to use timeout to wait for the search widget to rendered before focusing on it
// Will not work if browser is especially slow
searchExpand.watch('expanded', () => {
  if (searchExpand.expanded) {
    setTimeout(() => {
      search.focus();
  }, 10)}
});


// Closes the search popup after a result is selected and 3 seconds have passed
search.watch('selectedResult', () => {
  setTimeout(() => {
    view.popup.close();
  }, 3000);
});


// Handles on the fly hash changes
window.onhashchange = () => {
  hashActions();
};
