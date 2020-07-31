import React, { Component } from 'react';
import { Row, Col, Form, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import Card from '../../components/Card/Card';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import { onError } from '../../libs/errorLib';
import { capitalize } from '../../libs/textTransformLib';

export default class Amenity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isDeleting: false,
      id: null,
      name: '',
      description: '',
      icon: '',
      type: ''
    };
    
    const iconList = Object
      .keys(Icons)
      .filter(key => key !== "fas" && key !== "prefix" )
      .map(icon => Icons[icon]);

    library.add(...iconList);
  }
  
  async componentDidMount() {
    const id = this.props.match.params.id;
    if (id.includes('new')) {
      // new amenity id is either new-condo or new-community
      const type = id.split('-')[1];
      this.setState({type: type});
    } else {
      try {
        const amenity = await this.loadAmenity();
        this.setState({
          id: id,
          name: amenity.amenityName,
          description: amenity.description,
          icon: amenity.icon,
          type: amenity.type
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
      this.state.icon.length > 0
    );
  }
  
  renderIcon() {
    if (!(this.state.icon in library.definitions.fas)) {
      return <FontAwesomeIcon className="mb-4" icon="question-circle" size="4x" />;
    } else {
      return <FontAwesomeIcon className="mb-4" icon={this.state.icon} size="4x" />;
    }
  }
  
  loadAmenity() {
    return API.get('neverland-retreat', `/amenities/${this.props.match.params.id}`);
  }
  
  saveAmenity() {
    const data = {
      amenityName: this.state.name,
      description: this.state.description,
      icon: this.state.icon,
      type: this.state.type,
      sortOrder: 0
    };
    if (this.state.id === null) {
      // Create new amenity
      return API.post('neverland-retreat', '/amenities', {
        body: data
      });
    } else {
      // Update existing amenity
      return API.put('neverland-retreat', `/amenities/${this.state.id}`, {
        body: data
      });
    }
  }
  
  deleteAmenity() {
    return API.del('neverland-retreat', `/amenities/${this.props.match.params.id}`);
  }
  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleSubmit = async event => {
    event.preventDefault();

    this.setState({isLoading: true});

    try {
      await this.saveAmenity();
      this.props.history.push('/admin/amenities');
    } catch (e) {
      onError(e);
      this.setState({isLoading: false});
    }
  }
  
  handleDelete = async event => {
    const confirmed = window.confirm('Are you sure you want to delete this amenity?');
    if (!confirmed) {
      return;
    }
    
    this.setState({isDeleting: true});

    try {
      await this.deleteAmenity();
      this.props.history.push('/admin/amenities');
    } catch (e) {
      onError(e);
      this.setState({isDeleting: false});
    }
  }
  
  render() {
    return (
      <div className="amenity content">
        <Row>
          <Col md={8}>
            <Card
              title={`${capitalize(this.state.type)} Amenity Details`}
              content={
                <Form onSubmit={this.handleSubmit}>
                  {/* Name */}
                  <FormGroup controlId="name">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl autoFocus type="text" value={this.state.name} onChange={this.handleChange} placeholder="Amenity name" />
                  </FormGroup>
                  {/* Description */}
                  <FormGroup controlId="description">
                    <ControlLabel>Description</ControlLabel>
                    <FormControl type="text" value={this.state.description} onChange={this.handleChange} placeholder="Short description" />
                  </FormGroup>
                  {/* Icon */}
                  <FormGroup controlId="icon">
                    <ControlLabel>Icon</ControlLabel>
                    <FormControl type="text" value={this.state.icon} onChange={this.handleChange} placeholder="Font Awesome icon class" />
                    <HelpBlock className="text-muted">
                      Visit&nbsp;
                      <a href="https://fontawesome.com/icons?d=gallery" target="_blank" rel="noopener noreferrer">Font Awesome</a>&nbsp;
                      for a list of icons.
                    </HelpBlock>
                  </FormGroup>
                  <LoaderButton block bsSize="lg" bsStyle="primary" isLoading={this.state.isLoading} disabled={!this.validateForm()} type="submit">Save</LoaderButton>
                  {this.state.id !== null
                    ? <LoaderButton block bsSize="lg" isLoading={this.state.isDeleting} onClick={this.handleDelete}>Delete</LoaderButton>
                    : ''
                  }
                </Form>
              }
            />
          </Col>
          <Col md={4} className="text-center">
            <Card
              title="Preview"
              content={
                <div>
                  {this.renderIcon()}
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
