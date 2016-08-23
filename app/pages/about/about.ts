import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LocationTracker} from '../../providers/location-tracker/location-tracker';

@Component({
  templateUrl: 'build/pages/about/about.html',
  providers: [LocationTracker]
})
export class AboutPage {

  private tracker: any;

  static get parameters(){
    return [[LocationTracker]];
  }
 
  constructor(tracker) {
    this.tracker = tracker;
  }
 
  start() {
    this.tracker.startTracking().subscribe((position) => {
        // create form to do post
        let data = new FormData();

        let json = "{\n" +
                    "   \"posicao\":\n" +
                    "       \"GPS\":{\"lat\":" + position.latitude + ",\"lng\":" + position.longitude + "}\n" +
                    "   },\n" +
                    "   \"id_posicao\":\"" + 'posicao' + "\"\n" +
                    "}\n";

        // append text and user
        //data.append('text' , text);
        //data.append('user' , usr);
        //data.append('type' , type);

        // create, build and send request
        let xhr = new XMLHttpRequest();
        xhr.open(
            'post',
            'https://foodback-server.herokuapp.com/minhaqui/novaPosicao',
            true
        );
        xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

        xhr.send(json);

        console.log(position);
    });
  }
 
  stop() {
    this.tracker.stopTracking();
  }
}
