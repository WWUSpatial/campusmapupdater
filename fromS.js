// REQUIRE and FUNCTIONS *********************************************
    // Can eventually compact the require & function lines into a single line...
    require([
        "esri/config",
        "esri/Map",
        "esri/WebMap",
        "esri/webmap/Bookmark",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Expand",
        "esri/widgets/LayerList",
        "esri/widgets/Legend",
        "esri/widgets/Locate",
        "esri/widgets/Search",
        "esri/widgets/Home",
        "esri/widgets/ScaleBar",
        "esri/widgets/Bookmarks",
        "esri/widgets/BasemapToggle",
      ], 
      function(
        esriConfig,
        Map, 
        WebMap, 
        Bookmark, //need both Bookmark and Bookmarks...
        MapView, 
        FeatureLayer,
        Expand,
        LayerList,
        Legend,
        Locate,
        Search,
        Home,
        ScaleBar, 
        Bookmarks,
        BasemapToggle,
      ) {
  
  // API KEY for the WWU_Map (user) ****************************
      esriConfig.apiKey = "AAPKac6cddcb449043f4a7941e995666afe2-0VXn6KraIFlRVo6gPVIMbbjl86JDCN7uIx33xvoriQ9gD5VWTQPNQzKionQUdlD";
        
  // MISC VARS **********************************************
           var today = new Date();
           var dd = today.getDate();
           var mm = today.getMonth()+1; //January is 0!
           var yyyy = today.getFullYear();         
  
      // set Winter var (T or F) depending on current month 
          if (mm > 11 || mm < 4) {
            Winter = true;} else {Winter = false;}        
        
   // WEB MAP and MAP VIEW (using an AGOL web map) ***************     
        const webmap = new WebMap({
          portalItem: {
           id: "9c161033f604436193805a7484feab3d"            // Web Map for JavaScript
          }
          
        });
  
        const view = new MapView({
          container: "viewDiv",
          map: webmap,
        });
        
   /*     
   //NOT WORKING...     
         // get layers when the view is initialized
          webmap.when(() => {
            const layer0 = webmap.layers.items[0];          
            });
        // OR Find a layer by ID...
            const layer1 = webmap.findLayerById("958f6534812a4407925a2a18a640b841");
   */     
        
  
  // Label-PopUp-Top Layers - NOT included in the Layer List (so NOT included in the AGOL Map View)    
          const SearchPts = new FeatureLayer({
            url: "https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/search_pts/FeatureServer",
            visible: true,
            legendEnabled: false,
            listMode: 'hide', // not included in the ListLegend
          }); 
        
        const LabelLines = new FeatureLayer({
            url: "https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/label_lines/FeatureServer",
            visible: true,
            legendEnabled: false,
            listMode: 'hide', // not included in the ListLegend
          }); 
        
         const LabelPolys = new FeatureLayer({
            url: "https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/label_popup_polys/FeatureServer",
            visible: true,
            legendEnabled: false,
            listMode: 'hide', // not included in the LayerListLegend
          });
        
         const BuildingPts_5k = new FeatureLayer({
            url: "https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Building_Pts/FeatureServer",
            title: "Building Info",
            visible: true,
            legendEnabled: true,
            listMode: 'hide', // not included in the LayerListLegend
          });      
        
          const BuildingPts5k = new FeatureLayer({
            url: "https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/Building_Pts_5k/FeatureServer",
            title: "Building Info",
            visible: true,
            legendEnabled: true,
            listMode: 'hide', // not included in the LayerListLegend
          }); 
        
        const BasemapLegend = new FeatureLayer({
            url: "https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/DummyBasemapForLegend/FeatureServer",
            title: "WWU Basemap",
            visible: true,
            legendEnabled: true,
            listMode: 'hide', // not included in the LayerListLegend
          });
  
  // Add the label/pop-up/top layers
          webmap.add(BasemapLegend);
          webmap.add(SearchPts); 
          webmap.add(LabelLines);
          webmap.add(LabelPolys);
          webmap.add(BuildingPts_5k);
          webmap.add(BuildingPts5k);
  
        
        
  // UI ELEMENTS **********************************************
  
  //HOME Button......................................................HOME
          const home = new Home({view: view});
          view.ui.add(home, "top-left"); //....................end of HOME
        
        const scalebar = new ScaleBar({
          view: view
        });
        
        
        
  // LAYER LIST / LEGEND........................................LAYER-LIST-LEGEND
     // Adds a legend instance to the panel of a ListItem in a LayerList 
     // There is also a stand-along Legend below...
          const ListOfLayers = new LayerList({
            view: view,
            listItemCreatedFunction: (event) => {
          const item = event.item;
      if (item.layer.type != "group") {
        // don't show legend twice
        item.panel = {
          content: "legend", open: false
        };
      }
    }
  });
          
         const llExpand = new Expand({
            view: view,
            content: ListOfLayers,
            expanded: false,
            expandTooltip: "Layer List (On / Off)",
            autoCollapse: true,
          });
          view.ui.add(llExpand, "top-left"); //....end of LAYER-LIST-LEGEND      
        
        
  //LEGEND...........................................................LEGEND      
       const legendWidget = new Legend ({
          view: view
        });
        
        const legendExpand = new Expand({
            view: view,
            content: legendWidget,
            expanded: false,
            expandTooltip: "Legend",
            autoCollapse: true,
          });
          view.ui.add(legendExpand, "top-left");//..............end of LEGEND
        
        
  //SCALEBAR........................................................SCALEBAR
          const scaleBar = new ScaleBar({
            view: view,
            unit: "dual" // The scale bar displays both metric and non-metric units.
          });
  
          // Add the widget to the bottom left corner of the view
          view.ui.add(scaleBar, {
            position: "bottom-left"
          }); //...................................................end of SCALEBAR
        
  
        
  // SEARCH Box/Bar/Widget - using search_pts layer.............................SEARCH      
  const searchBox = new Search({
    view: view,
      includeDefaultSources: false, // false turns Off the ESRI location service
      locationEnabled: false,     // false turns Off the Current Location option 
      sources: [
        {
          layer: new FeatureLayer({
      url: "https://services.arcgis.com/qboYD3ru0louQq4F/arcgis/rest/services/search_pts/FeatureServer/146",
      outFields: ["*"]
    }),
          searchFields: [ "display", "key_words"],
          displayField: "display",
          exactMatch: false,
          placeholder: "Search WWU  ex: Red Square",
          maxResults: 8,
          maxSuggestions: 8,
          suggestionsEnabled: true,
          zoomScale: 1000,
          minSuggestCharacters: 2,
          autoSelect: true, //doesn't seem to make any difference... true or false both select & zoom...
          popupEnabled: true,
        }
      ]
  });
       // Put the searchbar into an expand widget...
          const searchBarExpand = new Expand({
            view: view,
            content: searchBox,
            expanded: false,  //defaults to closed search bar
            expandTooltip: "Search WWU",
            autoCollapse: true,
          }) 
          
      // Add the  UN-Expanded Search widget
          view.ui.add(searchBarExpand, {
            position: "top-right"
          }); //.............................................end of SEARCH 
   
  
  // LOCATE Button------------------------------------------------LOCATE
            const locateWidget = new Locate({
            view: view,
            useHeadingEnabled: false,
            goToOverride: function(view, options) {
              options.target.scale = 1500;
              return view.goTo(options.target);
            }
          });
          view.ui.add(locateWidget, "top-right"); //...........end of LOCATE
              
  
        
        
  // BUILDING BOOKMARKS using EXTENT
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
            ]  //end of buildingExtents
          }); //end of buildingBookmarks      
        
  // POI BOOKMARKS using EXTENT
   const poiBookmarks = new Bookmarks({
            view: view,
            bookmarks: [
  // condensed line format, from google spreadsheet formater...
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
  new Bookmark({name: "Lincoln Creek (Park & Ride)", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4685641, ymin:48.73322895, xmax:-122.46238, ymax:48.73661648 }  }  }),
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
            ]  //end of poiExtents
          }); //end of poiBookmarks      
      
  // WWU BOOKMARKS using EXTENT
   const parkingBookmarks = new Bookmarks({
            view: view,
            bookmarks: [
  // condensed line format, from google spreadsheet formater...
  new Bookmark({name: "Lincoln Creek Park & Ride", viewpoint: {targetGeometry: {type: "extent",xmin:-122.4685641, ymin:48.73322895, xmax:-122.46238, ymax:48.73661648 }  }  }),
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
            ]  //end of parkingExtents
          }); //end of parkingBookmarks
        
        
  //BOOKMARKS Widgets
          const buildingBkExpand = new Expand({
            view: view,
            content: buildingBookmarks,
            expanded: false,
            expandTooltip: "Building Bookmarks",
          });
          // Add the expanded widget
          view.ui.add(buildingBkExpand, "top-right");
         // collapses the associated Expand instance when the user selects a bookmark
         buildingBookmarks.on("bookmark-select", function(event){
         buildingBkExpand.expanded = false;
         });      
        
          const poiBkExpand = new Expand({
            view: view,
            content: poiBookmarks,
            expanded: false,
            expandTooltip: "Key Places Bookmarks",
          });
          // Add the expanded widget
          view.ui.add(poiBkExpand, "top-right");
         // collapses the associated Expand instance when the user selects a bookmark
         poiBookmarks.on("bookmark-select", function(event){
         poiBkExpand.expanded = false;
         });   
               
         const parkingBkExpand = new Expand({
            view: view,
            content: parkingBookmarks,
            expanded: false,
            expandTooltip: "Parking Bookmarks",
          });
         // Add the expanded widget
          view.ui.add(parkingBkExpand, "top-right");                  
         // collapses the associated Expand instance when the user selects a bookmark
         parkingBookmarks.on("bookmark-select", function(event){
         parkingBkExpand.expanded = false;
         });  
  
        
        
  
  // Basemap Toggle widget........................................................BASEMAP
          const BasemapToggleWidget = new BasemapToggle({
            view: view, 
            nextBasemap: "hybrid" // allows for toggling to the 'hybrid' basemap
          });
        
       // Put the basemapToggleWidget into an expand widget...
          const basemapExpand = new Expand({
            view: view,
            content: BasemapToggleWidget,
            expanded: false,  //defaults to closed search bar
            expandTooltip: "Basemap Selection",
            autoCollapse: true,
          })  
        
          // Add widget to the top right corner of the view
          view.ui.add(basemapExpand, "bottom-right"); //......................end BASEMAP
        
        
  
  
  
    });  // END...................................................................END of MAP SCRIPT
  