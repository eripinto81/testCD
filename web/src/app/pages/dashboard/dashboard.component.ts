import { ToastrManager } from 'ng6-toastr-notifications';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import Tile from 'ol/layer/Tile';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer/Vector';
import Icon from 'ol/style/Icon';
import { fromLonLat } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import {Fill, Stroke, Style, Text} from 'ol/style';
import { FormControl } from '@angular/forms';
import {Vector} from 'ol/layer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.scss'],
  providers: [DashboardService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  private endereco= null;

  private map: Map;
  private source: OSM;
  private layer: Tile;
  private view: View;

  constructor(private dashboard: DashboardService, private router: Router, private toastr:ToastrManager) {
    
  }

  ngOnInit() {
    this.layer= new Tile({
      source: new OSM()
    })
  }

  ngAfterViewInit(){
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }

    this.loadMap(-3.1204332,-60.0346529)
  }

  findMap(){
    if(!navigator.onLine){
      this.toastr.errorToastr("Aguarde... Você está sem conexão com o servidor!")
    }
    
    this.dashboard.findMap(this.endereco).subscribe(resp=> {
      let json= JSON.stringify(resp)
      let address= JSON.parse(json).features[0].geometry.coordinates
      this.loadMap(address[1], address[0])
    })
  }

  loadMap(lat, lon){    
    this.view= new View({
      center: fromLonLat([lon, lat]),
      zoom: 14
    })

    let popup= document.getElementById('popup');
    let popup_content= document.getElementById('popup-content');
    let popup_closer= document.getElementById('popup-closer');

    /**
     Pop-up para pegar coordenadas
      */
    let overlay= new Overlay({
      element: popup,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    })

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    popup_closer.onclick= function() {
      overlay.setPosition(undefined);
      popup_closer.blur();
      return false;
    }

    if(this.map == undefined){
      const mapa_usuario= localStorage.getItem('mapa_usuario')  

      if(mapa_usuario != null && mapa_usuario != undefined){
        let point= fromLonLat([JSON.parse(mapa_usuario).lon, JSON.parse(mapa_usuario).lat])

        let iconFeature= new Feature({
          geometry: new Point(point),
          name: 'Point'
        })        
  
        let iconStyle= new Style({
          image: new Icon({
            anchor: [0.5, 10],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: './assets/img/brand/map-marker.png'
          })
        })
        
        iconFeature.setStyle(iconStyle)
  
        let marker= new Vector({
            source: new VectorSource({
              features: [iconFeature]
            })
        })

        this.map= new Map({
          target: 'map',
          layers: [this.layer],
          view: this.view,
          overlays: [overlay]
        })

        this.map.addLayer(marker)

        this.tour(this.view, [point])        

        let mapL= this.map

        /**
         * Add a click handler to the map to render the popup.
         */
        mapL.on('singleclick', function(evt) {
          if (evt.dragging) {
            return;
          }
          let feature= mapL.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
              })      
          if (feature) { 
            let coordinate= evt.coordinate;
            popup_content.innerHTML= `<small>${JSON.parse(mapa_usuario).nome} \n ${JSON.parse(mapa_usuario).data}</small>`;
            overlay.setPosition(coordinate);
          }
        })
      }
    }else{
      this.map.setView(this.view)
      this.layer.getSource().refresh()
    }
  }

  tour(view, points) {
    let locations= points
    let index= -1;

    function flyTo(location, done) {
      let duration= 2000;
      let zoom= view.getZoom();
      let parts= 2;
      let called= false;
      function callback(complete) {
        --parts;
        if (called) {
          return;
        }
        if (parts === 0 || !complete) {
          called= true;
          done(complete);
        }
      }
      view.animate({
        center: location,
        duration: duration
      }, callback);
      view.animate({
        zoom: zoom - 1,
        duration: duration / 2
      }, {
        zoom: zoom,
        duration: duration / 2
      }, callback);
    }

    function next(more) {
      if (more) {
        ++index;
        if (index < locations.length) {
          let delay= index === 0 ? 0 : 750;
          setTimeout(function() {
            flyTo(locations[index], next)
          }, delay)
        } else {
          //alert('complete')
        }
      } else {
        //alert('cancelled')
      }
    }
    next(true)
  }

}
