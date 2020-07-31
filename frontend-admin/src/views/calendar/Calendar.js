import React, { Component } from 'react';
import { API } from 'aws-amplify';
import { Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import CalendarWidget from '../../components/Calendar/CalendarWidget';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import Card from '../../components/Card/Card';
import { onError } from '../../libs/errorLib';
import 'react-calendar/dist/Calendar.css';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    
    this.id = null;
    this.currentFullCalendarUrl = null;
    
    this.state = {
      isLoading: false,
      isLoadingCalendarData: false,
      isDeleting: false,
      name: '',
      url: '',
      calendarData: null
    };
  }
  
  async componentDidMount() {
    const id = this.props.match.params.id;
    if (!id.includes('new')) {
      // Existing calendar
      try {
        const calendar = await this.loadCalendar();
        const calendarData = await this.loadCalendarData(calendar.calendarUrl);
        this.id = id;
        this.currentFullCalendarUrl = calendar.calendarUrl;
        this.setState({
          name: calendar.calendarName,
          url: calendar.calendarUrl,
          calendarData: calendarData
        });
      } catch (e) {
        onError(e);
      }
    }
  }
  
  validateForm() {
    return (
      this.state.name.length > 0 &&
      this.state.url.length > 0 &&
      !this.state.isLoadingCalendarData
    );
  }
  
  loadCalendar() {
    return API.get('neverland-retreat', `/calendars/${this.props.match.params.id}`);
  }
  
  loadCalendarData(url) {
    return API.get('neverland-retreat', `/calendar-data?url=${url}`);
  }
  
  saveCalendar() {
    const data = {
      calendarName: this.state.name,
      calendarUrl: this.state.url
    };
    if (this.id === null) {
      // Create new calendar
      return API.post('neverland-retreat', '/calendars', {
        body: data
      });
    } else {
      // Update existing calendar
      return API.put('neverland-retreat', `/calendars/${this.id}`, {
        body: data
      });
    }
  }
  
  deleteCalendar() {
    return API.del('neverland-retreat', `/calendars/${this.props.match.params.id}`);
  }
  
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  }
  
  handleUrlChange = async event => {
    const url = event.target.value;
    
    if (url === this.currentFullCalendarUrl) {
      // The calendar URL was not changed
      return;
    }
    
    this.currentFullCalendarUrl = url;
    this.setState({ isLoadingCalendarData: true });
    
    try {
      const calendarData = await this.loadCalendarData(url);
      this.setState({ calendarData: calendarData });
    } catch (e) {
      console.log('Could not load calendar data from the provided URL.');
      this.setState({ calendarData: null });
    }
    
    this.setState({ isLoadingCalendarData: false });
  }
  
  handleSubmit = async event => {
    event.preventDefault();

    this.setState({isLoading: true});

    try {
      // Save calendar details
      await this.saveCalendar();
      this.props.history.push('/admin/calendars');
    } catch (e) {
      onError(e);
      this.setState({isLoading: false});
    }
  }
  
  handleDelete = async event => {
    const confirmed = window.confirm('Are you sure you want to delete this calendar?');
    if (!confirmed) {
      return;
    }
    
    this.setState({isDeleting: true});

    try {
      await this.deleteCalendar();
      this.props.history.push('/admin/calendars');
    } catch (e) {
      onError(e);
      this.setState({isDeleting: false});
    }
  }
  
  render() {
    return (
      <div className="calendar content">
        <Row>
          <Col lg={7} md={12}>
            <Card
              title="Manage Calendar"
              content={
                <Form onSubmit={this.handleSubmit}>
                  {/* Name */}
                  <FormGroup controlId="name">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl autoFocus type="text" value={this.state.name} onChange={this.handleChange} placeholder="Calendar name" />
                  </FormGroup>
                  {/* Calendar URL */}
                  <FormGroup controlId="url">
                    <ControlLabel>Calendar URL</ControlLabel>
                    <FormControl type="text" value={this.state.url} onChange={this.handleChange} onBlur={this.handleUrlChange} placeholder="Calendar URL" />
                  </FormGroup>
                  <LoaderButton block bsSize="lg" bsStyle="primary" isLoading={this.state.isLoading} disabled={!this.validateForm()} type="submit">Save</LoaderButton>
                  {this.id
                    ? <LoaderButton block bsSize="lg" isLoading={this.state.isDeleting} onClick={this.handleDelete}>Delete</LoaderButton>
                    : ''
                  }
                </Form>
              }
            />
          </Col>
          <Col lg={5} md={12} className="text-center">
            <Card
              title="Calendar Preview"
              content={<CalendarWidget key={this.state.calendarData} data={this.state.calendarData} />}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
