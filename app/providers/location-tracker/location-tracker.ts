import {Injectable} from '@angular/core';
import {Geolocation, BackgroundGeolocation} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
 
@Injectable()
export class LocationTracker {

  private positionObserver: any;
  private position: any;
  private watch: any;
 
  constructor() {
    this.positionObserver = null;
 
    this.position = Observable.create(observer => {
      this.positionObserver = observer;
    });
  }
 
  startTracking() {
    // In App Tracking
  
    let options = {
      frequency: 300, 
      enableHighAccuracy: true     
    };
  
    this.watch = Geolocation.watchPosition(options);
  
    this.watch.subscribe((data) => {
      this.notifyLocation(data.coords);
    });
  
    // Background Tracking
  
    let backgroundOptions = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };

    BackgroundGeolocation.configure(backgroundOptions)
       .then((location) => {
            console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            BackgroundGeolocation.finish(); // FOR IOS ONLY
        })
       .catch((error) => {
            console.log('BackgroundGeolocation error');
        });
  
    BackgroundGeolocation.start();
  
    return this.position;
  }
 
  stopTracking() {
    BackgroundGeolocation.finish();
    this.watch.unsubscribe();
  }
 
  notifyLocation(location) {
    this.positionObserver.next(location);
  }
}