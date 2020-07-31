import React, { Component } from 'react';
import { Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { API, Storage } from 'aws-amplify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import Card from '../../components/Card/Card';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import ImageCropper, { readFile } from '../../components/ImageCropper/ImageCropper';
import { s3Upload } from '../../libs/awsLib';
import { onError } from '../../libs/errorLib';
import { capitalize } from '../../libs/textTransformLib';
import './Image.css';

export default class Image extends Component {
  constructor(props) {
    super(props);
    
    this.id = null;
    this.croppedFile = null;
    this.originalImageUrl = null;
    this.fileChanged = false;
    this.type = '';
    
    this.state = {
      isLoading: false,
      isDeleting: false,
      isCropping: false,
      name: '',
      description: '',
      displayUrl: null,
      croppedImage: null,
      fileName: 'neverland-retreat.jpg'
    };
  }
  
  async componentDidMount() {
    const id = this.props.match.params.id;
    if (id.includes('new')) {
      // new image id is either new-condo or new-community
      const type = id.split('-')[1];
      this.type = type;
    } else {
      try {
        const image = await this.loadImage();
        this.id = id;
        this.type = image.type;  
        this.originalImageUrl = image.imageUrl;      
        this.setState({
          name: image.imageName,
          description: image.description,
          displayUrl: await Storage.vault.get(image.imageUrl),
          fileName: image.imageUrl.split('-')[1] // imageUrl format is <date>-fileName
        });
      } catch (e) {
        onError(e);
      }
    }
  }
  
  validateForm() {
    return (
      this.state.name.length > 0 &&
      this.state.description.length > 0 &&
      this.state.displayUrl !== null
    );
  }
  
  loadImage() {
    return API.get('neverland-retreat', `/images/${this.props.match.params.id}`);
  }
  
  saveImage(s3ImageUrl) {
    const data = {
      imageName: this.state.name,
      description: this.state.description,
      imageUrl: s3ImageUrl,
      thumbnailUrl: s3ImageUrl,
      type: this.type,
      sortOrder: 0
    };
    if (this.id === null) {
      // Create new image
      return API.post('neverland-retreat', '/images', {
        body: data
      });
    } else {
      // Update existing image
      return API.put('neverland-retreat', `/images/${this.id}`, {
        body: data
      });
    }
  }
  
  deleteImage() {
    return API.del('neverland-retreat', `/images/${this.props.match.params.id}`);
  }
  
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  }
  
  handleFileChange = async event => {    
    const file = event.target.files[0];
    if (file) {
      const imageDataUrl = await readFile(file);
      this.fileChanged = true;
      this.setState({
        displayUrl: imageDataUrl,
        fileName: file.name
      });
    }
  }
  
  handleSubmit = async event => {
    event.preventDefault();

    this.setState({isLoading: true});

    try {
      if (this.fileChanged) {
          // Remove the old image
          await Storage.vault.remove(this.originalImageUrl);
      }
      
      // Upload the new image
      const s3ImageUrl = await s3Upload(this.croppedFile);
      
      // Save image details
      await this.saveImage(s3ImageUrl);
      this.props.history.push('/admin/images');
    } catch (e) {
      onError(e);
      console.log(e);
      this.setState({isLoading: false});
    }
  }
  
  handleDelete = async event => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (!confirmed) {
      return;
    }
    
    this.setState({isDeleting: true});

    try {
      await this.deleteImage();
      if (this.originalImageUrl) {
          // Remove the old image
          await Storage.vault.remove(this.originalImageUrl);
      }
      this.props.history.push('/admin/images');
    } catch (e) {
      onError(e);
      this.setState({isDeleting: false});
    }
  }
  
  handleImageCropperChange = (blobUrl, croppedFile) => {    
    this.croppedFile = croppedFile;
    this.setState({ croppedImage: blobUrl });
  }
  
  render() {
    return (
      <div className="image content">
        <Row>
          <Col md={7}>
            <Card
              title={`${capitalize(this.type)} Image Details`}
              content={
                <Form onSubmit={this.handleSubmit}>
                  {/* Name */}
                  <FormGroup controlId="name">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl autoFocus type="text" value={this.state.name} onChange={this.handleChange} placeholder="Image name" />
                  </FormGroup>
                  {/* Description */}
                  <FormGroup controlId="description">
                    <ControlLabel>Description</ControlLabel>
                    <FormControl type="text" value={this.state.description} onChange={this.handleChange} placeholder="Short description" />
                  </FormGroup>
                  {/* Image */}
                  <FormGroup controlId="file">
                    <ControlLabel>Image</ControlLabel>
                    <FormControl onChange={this.handleFileChange} type="file" />
                  </FormGroup>
                  {this.state.displayUrl
                    ? (
                        <>
                          <div className="crop-container">
                            <ImageCropper image={this.state.displayUrl} fileName={this.state.fileName} onChange={this.handleImageCropperChange} />
                          </div>
                        </>
                      )
                    : ''
                  }
                  <LoaderButton block bsSize="lg" bsStyle="primary" isLoading={this.state.isLoading} disabled={!this.validateForm()} type="submit">Save</LoaderButton>
                  {this.id
                    ? <LoaderButton block bsSize="lg" isLoading={this.state.isDeleting} onClick={this.handleDelete}>Delete</LoaderButton>
                    : ''
                  }
                </Form>
              }
            />
          </Col>
          <Col md={5} className="text-center">
            <Card
              title="Preview"
              content={
                <div>
                  {this.state.croppedImage
                    ? <img src={this.state.croppedImage} className="preview" alt="Crop preview" />
                    : <FontAwesomeIcon icon={faQuestionCircle} size="4x" />
                  }
                  <h3 className="h4 mb-2">{this.state.name}</h3>
                  <p className="text-white-75 mb-0">{this.state.description}</p>
                </div>
              }
            />
          </Col>
        </Row>
      </div>
    );
  }
}
