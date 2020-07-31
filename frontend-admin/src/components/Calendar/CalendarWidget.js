import React, { Component } from 'react';
import Calendar from 'react-calendar';
import { Table } from 'react-bootstrap';
import ical from 'ical';
import { format, isWithinInterval, differenceInDays } from 'date-fns';
import './CalendarWidget.css';

export default class CalendarWidget extends Component {
  constructor(props) {
    super(props);
    
    this.bookedDateRanges = [];
    this.icalData = null;
    
    this.state = {
      isLoading: true,
      date: new Date(),
      eventDetails: null
    }
  }
  
  componentDidMount() {
    this.setBookedDates();
    this.setState({ isLoading: false });
  }
  
  setBookedDates = () => {
    if (this.props.data) {
      this.icalData = ical.parseICS(this.props.data);
      for (let i in this.icalData) {
        const event = this.icalData[i];
        if (event.type === 'VEVENT') {
          this.bookedDateRanges.push([event.start, event.end]);
        }
      }
    }
  }
 
  onChange = date => this.setState({ date });
  
  isBooked(date) {
    return (
      this.bookedDateRanges
        .some(range =>
          isWithinInterval(date, { start: range[0], end: range[1] })
        )
      );
  }
  
  tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (this.isBooked(date)) {
        return 'booked-date';
      }
    }
  }
  
  onClickDay = date => {
    // Display the event details if there are any for the clicked day
    if (this.icalData) {
      let clickedBooking = null;
      for (let i in this.icalData) {
        const event = this.icalData[i];
        if (event.type === 'VEVENT') {
          if (isWithinInterval(date, { start: event.start, end: event.end })) {
            clickedBooking = event;
            break;
          }
        }
      }
      this.setState({ eventDetails: clickedBooking });
    }
  }
  
  formatDate = date => {
    return format(date, 'M/d/yyyy');
  }
  
  formatText = text => {
    const newLinePattern = /\n/;
    const whitespacePattern = / |\n|\t|\r|\f|<br|&nbsp;/
    const urlPattern = /https?:/;
    let formattedText = text;
    
    const linkStartLocation = formattedText.search(urlPattern);
    if (linkStartLocation > -1) {
      // find the end of the link
      const searchString = formattedText.substring(linkStartLocation);
      const linkEndLocation = searchString.search(whitespacePattern);
      const link = searchString.substring(0, linkEndLocation);
      formattedText = formattedText.replace(link, `<a href="${link}" target="_blank">${link}</a>`);
    }
    formattedText = formattedText.replace(newLinePattern, '<br />');
    
    return formattedText;
  }
  
  renderEventDetails = () => {
    return (
      this.state.eventDetails &&
      <div className="event-details">
        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <th>Summary</th>
              <td>{this.state.eventDetails.summary}</td>
            </tr>
            <tr>
              <th>Duration</th>
              <td>{differenceInDays(this.state.eventDetails.end, this.state.eventDetails.start)} nights</td>
            </tr>
            <tr>
              <th>Check-in</th>
              <td>{this.formatDate(this.state.eventDetails.start)}</td>
            </tr>
            <tr>
              <th>Check-out</th>
              <td>{this.formatDate(this.state.eventDetails.end)}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td dangerouslySetInnerHTML={{__html: this.state.eventDetails.description ? this.formatText(this.state.eventDetails.description) : ""}} />
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
  
  render() {
    return (
      this.props.data !== null && !this.state.isLoading &&
      <div className="CalendarWidget">
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
          tileClassName={this.tileClassName}
          onClickDay={this.onClickDay}
        />
        {this.renderEventDetails()}
      </div>
    );
  }
}
