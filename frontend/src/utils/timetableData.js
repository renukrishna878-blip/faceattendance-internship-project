export const DEPARTMENTS = {
  cs: {
    name: 'Computer Science',
    subjects: [
      { id: 'ai', name: 'Advanced AI', faculty: 'Dr. Alan Turing' },
      { id: 'dm', name: 'Discrete Math', faculty: 'Prof. Ada Lovelace' },
      { id: 'os', name: 'Operating Systems', faculty: 'Prof. Dennis Ritchie' },
      { id: 'ds', name: 'Data Structures', faculty: 'Dr. Grace Hopper' },
      { id: 'cn', name: 'Computer Networks', faculty: 'Prof. Vint Cerf' }
    ]
  },
  ee: {
    name: 'Electrical Eng.',
    subjects: [
      { id: 'ss', name: 'Signals and Systems', faculty: 'Dr. Nikola Tesla' },
      { id: 'mp', name: 'Microprocessors', faculty: 'Prof. Thomas Edison' },
      { id: 'cs', name: 'Control Systems', faculty: 'Dr. Claude Shannon' },
      { id: 'em', name: 'Electromagnetics', faculty: 'Prof. James Maxwell' },
      { id: 'ae', name: 'Analog Electronics', faculty: 'Dr. William Shockley' }
    ]
  },
  me: {
    name: 'Mechanical Eng.',
    subjects: [
      { id: 'td', name: 'Thermodynamics', faculty: 'Prof. Rudolf Diesel' },
      { id: 'fm', name: 'Fluid Mechanics', faculty: 'Dr. Ludwig Prandtl' },
      { id: 'md', name: 'Machine Design', faculty: 'Prof. James Watt' },
      { id: 'km', name: 'Kinematics of Machinery', faculty: 'Dr. Henry Ford' },
      { id: 'cad', name: 'CAD/CAM', faculty: 'Prof. CAD Expert' }
    ]
  },
  ce: {
    name: 'Civil Eng.',
    subjects: [
      { id: 'sa', name: 'Structural Analysis', faculty: 'Prof. Hardy Cross' },
      { id: 'sv', name: 'Surveying', faculty: 'Dr. George Washington' },
      { id: 'sm', name: 'Soil Mechanics', faculty: 'Prof. Karl Terzaghi' },
      { id: 'ct', name: 'Concrete Technology', faculty: 'Dr. Arthur Casagrande' },
      { id: 'ee2', name: 'Environmental Eng.', faculty: 'Prof. John Snow' }
    ]
  }
};

export const WEEKLY_TIMETABLE = {
  cs: [
    { day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Advanced AI', faculty: 'Dr. Alan Turing', room: 'Lecture Hall 4B' },
    { day: 'Monday', time: '11:00 AM - 12:30 PM', subject: 'Discrete Math', faculty: 'Prof. Ada Lovelace', room: 'Room 201' },
    { day: 'Tuesday', time: '09:00 AM - 10:30 AM', subject: 'Operating Systems', faculty: 'Prof. Dennis Ritchie', room: 'Lab 3' },
    { day: 'Tuesday', time: '02:00 PM - 03:30 PM', subject: 'Data Structures', faculty: 'Dr. Grace Hopper', room: 'Lecture Hall 1A' },
    { day: 'Wednesday', time: '09:00 AM - 10:30 AM', subject: 'Advanced AI', faculty: 'Dr. Alan Turing', room: 'Lecture Hall 4B' },
    { day: 'Wednesday', time: '11:00 AM - 12:30 PM', subject: 'Computer Networks', faculty: 'Prof. Vint Cerf', room: 'Room 102' },
    { day: 'Thursday', time: '11:00 AM - 12:30 PM', subject: 'Discrete Math', faculty: 'Prof. Ada Lovelace', room: 'Room 201' },
    { day: 'Thursday', time: '02:00 PM - 03:30 PM', subject: 'Operating Systems', faculty: 'Prof. Dennis Ritchie', room: 'Lab 3' },
    { day: 'Friday', time: '09:00 AM - 10:30 AM', subject: 'Data Structures', faculty: 'Dr. Grace Hopper', room: 'Lecture Hall 1A' },
    { day: 'Friday', time: '11:00 AM - 12:30 PM', subject: 'Computer Networks', faculty: 'Prof. Vint Cerf', room: 'Room 102' }
  ],
  ee: [
    { day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Signals and Systems', faculty: 'Dr. Nikola Tesla', room: 'Room 304' },
    { day: 'Monday', time: '11:00 AM - 12:30 PM', subject: 'Microprocessors', faculty: 'Prof. Thomas Edison', room: 'Lab 2' },
    { day: 'Tuesday', time: '09:00 AM - 10:30 AM', subject: 'Control Systems', faculty: 'Dr. Claude Shannon', room: 'Room 306' },
    { day: 'Tuesday', time: '02:00 PM - 03:30 PM', subject: 'Electromagnetics', faculty: 'Prof. James Maxwell', room: 'Lecture Hall 2' },
    { day: 'Wednesday', time: '09:00 AM - 10:30 AM', subject: 'Signals and Systems', faculty: 'Dr. Nikola Tesla', room: 'Room 304' },
    { day: 'Wednesday', time: '11:00 AM - 12:30 PM', subject: 'Analog Electronics', faculty: 'Dr. William Shockley', room: 'Room 308' },
    { day: 'Thursday', time: '11:00 AM - 12:30 PM', subject: 'Microprocessors', faculty: 'Prof. Thomas Edison', room: 'Lab 2' },
    { day: 'Thursday', time: '02:00 PM - 03:30 PM', subject: 'Control Systems', faculty: 'Dr. Claude Shannon', room: 'Room 306' },
    { day: 'Friday', time: '09:00 AM - 10:30 AM', subject: 'Electromagnetics', faculty: 'Prof. James Maxwell', room: 'Lecture Hall 2' },
    { day: 'Friday', time: '11:00 AM - 12:30 PM', subject: 'Analog Electronics', faculty: 'Dr. William Shockley', room: 'Room 308' }
  ],
  me: [
    { day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Thermodynamics', faculty: 'Prof. Rudolf Diesel', room: 'Mechanical Hall 1' },
    { day: 'Monday', time: '11:00 AM - 12:30 PM', subject: 'Fluid Mechanics', faculty: 'Dr. Ludwig Prandtl', room: 'Room 401' },
    { day: 'Tuesday', time: '09:00 AM - 10:30 AM', subject: 'Machine Design', faculty: 'Prof. James Watt', room: 'CAD Lab' },
    { day: 'Tuesday', time: '02:00 PM - 03:30 PM', subject: 'Kinematics of Machinery', faculty: 'Dr. Henry Ford', room: 'Mechanical Hall 2' },
    { day: 'Wednesday', time: '09:00 AM - 10:30 AM', subject: 'Thermodynamics', faculty: 'Prof. Rudolf Diesel', room: 'Mechanical Hall 1' },
    { day: 'Wednesday', time: '11:00 AM - 12:30 PM', subject: 'CAD/CAM', faculty: 'Prof. CAD Expert', room: 'CAD Lab' },
    { day: 'Thursday', time: '11:00 AM - 12:30 PM', subject: 'Fluid Mechanics', faculty: 'Dr. Ludwig Prandtl', room: 'Room 401' },
    { day: 'Thursday', time: '02:00 PM - 03:30 PM', subject: 'Machine Design', faculty: 'Prof. James Watt', room: 'CAD Lab' },
    { day: 'Friday', time: '09:00 AM - 10:30 AM', subject: 'Kinematics of Machinery', faculty: 'Dr. Henry Ford', room: 'Mechanical Hall 2' },
    { day: 'Friday', time: '11:00 AM - 12:30 PM', subject: 'CAD/CAM', faculty: 'Prof. CAD Expert', room: 'CAD Lab' }
  ],
  ce: [
    { day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Structural Analysis', faculty: 'Prof. Hardy Cross', room: 'Civil Room 10' },
    { day: 'Monday', time: '11:00 AM - 12:30 PM', subject: 'Surveying', faculty: 'Dr. George Washington', room: 'Surveying Field' },
    { day: 'Tuesday', time: '09:00 AM - 10:30 AM', subject: 'Soil Mechanics', faculty: 'Prof. Karl Terzaghi', room: 'Civil Lab 1' },
    { day: 'Tuesday', time: '02:00 PM - 03:30 PM', subject: 'Concrete Technology', faculty: 'Dr. Arthur Casagrande', room: 'Civil Room 12' },
    { day: 'Wednesday', time: '09:00 AM - 10:30 AM', subject: 'Structural Analysis', faculty: 'Prof. Hardy Cross', room: 'Civil Room 10' },
    { day: 'Wednesday', time: '11:00 AM - 12:30 PM', subject: 'Environmental Eng.', faculty: 'Prof. John Snow', room: 'Civil Room 14' },
    { day: 'Thursday', time: '11:00 AM - 12:30 PM', subject: 'Surveying', faculty: 'Dr. George Washington', room: 'Surveying Field' },
    { day: 'Thursday', time: '02:00 PM - 03:30 PM', subject: 'Soil Mechanics', faculty: 'Prof. Karl Terzaghi', room: 'Civil Lab 1' },
    { day: 'Friday', time: '09:00 AM - 10:30 AM', subject: 'Concrete Technology', faculty: 'Dr. Arthur Casagrande', room: 'Civil Room 12' },
    { day: 'Friday', time: '11:00 AM - 12:30 PM', subject: 'Environmental Eng.', faculty: 'Prof. John Snow', room: 'Civil Room 14' }
  ]
};
