import React, { Component } from 'react';
import Cropper from 'react-easy-crop'
import getCroppedImg from '../../libs/imageLib';

export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default class ImageCropper extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      crop: { x: 0, y: 0 }
    };
  }
  
  onCropChange = crop => {
    this.setState({ crop });
  }
  
  onCropComplete = async (croppedArea, croppedAreaPixels) => {
    const croppedImageBlob = await getCroppedImg(this.props.image, croppedAreaPixels);
    const croppedImageBlobUrl = URL.createObjectURL(croppedImageBlob);
    const fileBytes = [await new Response(croppedImageBlob).arrayBuffer()];
    const croppedFile = new File(fileBytes, this.props.fileName, {type: 'image/text'});
    this.props.onChange(croppedImageBlobUrl, croppedFile);
  }
  
  render() {
    return (
      <Cropper
        image={this.props.image}
        crop={this.state.crop}
        zoom={1}
        aspect={13 / 7}
        onCropChange={this.onCropChange}
        onCropComplete={this.onCropComplete}
      />
    );
  }
}
