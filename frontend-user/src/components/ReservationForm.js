import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { eachDayOfInterval } from 'date-fns';
import ical from 'ical';
import PaymentDetails from './PaymentDetails';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationForm.css';

export default function ReservationForm({ calendars, onSubmit }) {
  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endDateDisabled, setEndDateDisabled] = useState(true);
  const [disabledDates, setDisabledDates] = useState([]);
  const [isRangeSelected, setIsRangeSelected] = useState(false);
  
  useEffect(() => {
    let allDisabledDays = [];
    calendars.forEach(async (calendar, i) => {
      try {
        const calendarData = await loadCalendarData(calendar.calendarUrl);
        const bookedDays = getIcsCalendarData(calendarData);
        allDisabledDays.push(...bookedDays);
        setDisabledDates(allDisabledDays);
      } catch(e) {
        console.log('Unable to get calendar data for ' + calendar.calendarName + ' calendar.');
      }
    });
  }, [calendars]);
  
  function loadCalendarData(url) {
    return API.get('neverland-retreat', `/calendar-data?url=${url}`);
  }
  
  function getIcsCalendarData(calendarData) {
    let allBookedDays = [];
    const data = ical.parseICS(calendarData);
    for (let i in data) {
      const event = data[i];
      if (event.type === 'VEVENT') {
        const bookedDays = eachDayOfInterval({ start: event.start, end: event.end });
        allBookedDays.push(bookedDays);
      }
    };
    
    return allBookedDays.flat();
  }
  
  function handleCheckinChange(date) {
    setStartDate(date);
    
    if (!endDate) {
      setEndDate(new Date(date));
    }
    
    if (date) {
      setEndDateDisabled(false);
      setTimeout(function() {
        checkoutRef.current.input.focus();
      }, 10);
    } else {
      // Start date cleared
      setEndDate(null);
      setEndDateDisabled(true);
    }
    
    checkRangeSelectionComplete(date, endDate);
  }
  
  function handleCheckoutChange(date) {
    setEndDate(date);
    checkRangeSelectionComplete(startDate, date);
  }
  
  function checkRangeSelectionComplete(checkinDate, checkoutDate) {
    if (checkinDate && checkoutDate) {
      checkinRef.current.setOpen(false);
      checkoutRef.current.setOpen(false);
      
      // The date selection is complete
      setIsRangeSelected(true);
    } else {
      setIsRangeSelected(false);
    }
  }
  
  function handleFocus(event) {
    // Close the calendar whose DatePicker doesn't have the focus
    if (event.target === checkinRef.current.input) {
      checkoutRef.current.setOpen(false);
    } else if (event.target === checkoutRef.current.input) {
      checkinRef.current.setOpen(false);
    }
  }
  
  function checkAvailabilityClick() {
    checkinRef.current.input.focus();
  }
  
  function reserveClick(event) {
    event.preventDefault();
    event.stopPropagation();
    onSubmit(startDate, endDate);
  }
  
  return (
    <div className="ReservationForm">
      <div className="display-container">
        <p className="text-white text-left mb-1 pl-1">Check-in</p>
        <DatePicker
          placeholderText="Add date"
          selected={startDate}
          onChange={date => handleCheckinChange(date)}
          onFocus={handleFocus}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          monthsShown={2}
          excludeDates={disabledDates}
          ref={checkinRef}
          selectsStart
          isClearable
        />
        <p className="text-white text-left mt-4 mb-1 pl-1">Check-out</p>
        <DatePicker
          placeholderText="Add date"
          selected={endDate}
          disabled={endDateDisabled}
          onChange={date => handleCheckoutChange(date)}
          onFocus={handleFocus}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          monthsShown={2}
          excludeDates={disabledDates}
          ref={checkoutRef}
          selectsEnd
          isClearable
        />
        {!isRangeSelected
          ? <Button className="btn btn-light btn-xl text-dark d-block text-center mt-4" onClick={checkAvailabilityClick}>
              Check availability
            </Button>
          : <div className="mt-4">
              <PaymentDetails className="bg-light text-left" startDate={startDate} endDate={endDate} />
              <Button className="btn btn-primary btn-xl text-white text-center d-block mt-4" onClick={reserveClick}>
                Reserve
              </Button>
              <p className="text-white mt-1">You won't be charged yet</p>
            </div>
        }
      </div>
    </div>
  );
}
