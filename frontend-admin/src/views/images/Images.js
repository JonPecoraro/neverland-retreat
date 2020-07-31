import React, { Component } from 'react';
import { API } from 'aws-amplify';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import Card from '../../components/Card/Card';
import { onError } from '../../libs/errorLib';
import './Images.css';

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      images: []
    };
  }
  
  async componentDidMount() {    
    try {
      const images = await this.loadImages();
      this.setState({images: images});
    } catch(e) {
      onError(e);
    }
    
    this.setState({isLoading: false});
  }

  loadImages() {
    return API.get('neverland-retreat', '/images');
  }

  renderImagesList(type) {
    const filteredImages = this.state.images.filter(image => image.type.includes(type));
    return [{}].concat(filteredImages).map((image, i) =>
      i !== 0 ? (
        <ListGroupItem key={image.sk} href={`/admin/image/${image.sk}`}>
          <h4>{image.imageName}</h4>
          <p className="text-muted mb-0">{image.description}</p>
        </ListGroupItem>
      ) : (
          <ListGroupItem bsStyle="info" key="new" href={`/admin/image/new-${type}`}>
            <p><b>{"\uFF0B"}</b> Add an image</p>
          </ListGroupItem>
      )
    );
  }

  render() {
    return (
      !this.state.isLoading &&
      <div className="images content">
        {/* Condo Images */}
        <Card
          title="Condo Images"
          content={
            <ListGroup>
              {this.renderImagesList('condo')}
            </ListGroup>
          }
        />
        
        {/* Community Images */}
        <Card
          title="Community Images"
          content={
            <ListGroup>
              {this.renderImagesList('community')}
            </ListGroup>
          }
        />
      </div>
    );
  }
}
