import React, { Component } from 'react';
import { API } from 'aws-amplify';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import Card from '../../components/Card/Card';
import { onError } from '../../libs/errorLib';
import './Amenities.css';

export default class Amenities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      amenities: []
    };
  }
  
  async componentDidMount() {    
    try {
      const amenities = await this.loadAmenities();
      this.setState({amenities: amenities});
    } catch(e) {
      onError(e);
    }
    
    this.setState({isLoading: false});
  }

  loadAmenities() {
    return API.get('neverland-retreat', '/amenities');
  }

  renderAmenitiesList(type) {
    const filteredAmenities = this.state.amenities.filter(amenity => amenity.type.includes(type));
    return [{}].concat(filteredAmenities).map((amenity, i) =>
      i !== 0 ? (
        <ListGroupItem key={amenity.sk} href={`/admin/amenity/${amenity.sk}`}>
          <h4>{amenity.amenityName}</h4>
          <p className="text-muted mb-0">{amenity.description}</p>
        </ListGroupItem>
      ) : (
          <ListGroupItem bsStyle="info" key="new" href={`/admin/amenity/new-${type}`}>
            <p><b>{"\uFF0B"}</b> Add an amenity</p>
          </ListGroupItem>
      )
    );
  }

  render() {
    return (
      !this.state.isLoading &&
      <div className="amenities content">
        {/* Condo Amenities */}
        <Card
          title="Condo Amenities"
          content={
            <ListGroup>
              {this.renderAmenitiesList('condo')}
            </ListGroup>
          }
        />
        
        {/* Community Amenities */}
        <Card
          title="Community Amenities"
          content={
            <ListGroup>
              {this.renderAmenitiesList('community')}
            </ListGroup>
          }
        />
      </div>
    );
  }
}
