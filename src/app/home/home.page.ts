import { Component } from '@angular/core';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isOn: boolean = false;

  photos: any = [];


  constructor(private flashlight: Flashlight, private camera: Camera, public file: File) { }

  async isAvailable(): Promise<boolean> {
    try {
      return await this.flashlight.available();

    }
    catch (e) {
      console.log(e);
    }
  }

  // Toggles the flashlight on and off
  async toggleFlash(): Promise<void> {
    try {
      let available = await this.isAvailable();
      if (available) {

        await this.flashlight.toggle();
        this.isOn = !this.isOn;
      }
      else {
        console.log("Isn't available.");
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  TakePhotos() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
      let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
      this.file.readAsDataURL(path, filename).then((base64Image) => {
        this.photos.push(base64Image);
      })
    });
  }
}
