import React, { Component } from 'react';
import { API } from 'aws-amplify';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import CalendarWidget from '../../components/Calendar/CalendarWidget';
import Card from '../../components/Card/Card';
import { onError } from '../../libs/errorLib';
import './Calendars.css';

export default class Calendars extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: true,
      calendars: []
    };
  }
  
  async componentDidMount() {    
    try {
      const calendars = await this.loadCalendars();
      this.setState({ calendars: calendars });
    } catch(e) {
      onError(e);
    }
    
    this.setState({isLoading: false});
  }

  loadCalendars() {
    return API.get('neverland-retreat', '/calendars');
  }
  
  loadCalendarData(url) {
    return API.get('neverland-retreat', `/calendar-data?url=${url}`);
  }

  renderCalendarsList() {
    return [{}].concat(this.state.calendars).map((calendar, i) =>
      i !== 0 ? (
        <ListGroupItem key={calendar.sk} href={`/admin/calendar/${calendar.sk}`}>
          <h4>{calendar.calendarName}</h4>
          <p className="text-muted mb-0">{calendar.description}</p>
        </ListGroupItem>
      ) : (
          <ListGroupItem bsStyle="info" key="new" href="/admin/calendar/new">
            <p><b>{"\uFF0B"}</b> Add an calendar</p>
          </ListGroupItem>
      )
    );
  }
  
  renderCalendarQuickView() {
    return this.state.calendars.map((calendar) =>
      <div key={calendar.sk} className="text-center">
        <h3>{calendar.calendarName}</h3>
        <CalendarWidget data={calendar.calendarData} />
      </div>
    );
  }

  render() {
    return (
      !this.state.isLoading &&
      <div className="calendars content">
        {/* Calendar list */}
        <Card
          title="Synced Calendars"
          content={
            <ListGroup>
              {this.renderCalendarsList()}
            </ListGroup>
          }
        />
        
        {/* Quick view of calendars 
        <Card
          title="Quick View"
          content={this.renderCalendarQuickView()}
        />*/}
      </div>
    );
  }
}
