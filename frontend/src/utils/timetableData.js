const cs_subjects = [
  // Sem 1
  { id: 'CS-1-MATH1', name: 'Engineering Mathematics I', semester: 1, faculty: 'Prof. Isaac Newton' },
  { id: 'CS-1-PHYS', name: 'Engineering Physics', semester: 1, faculty: 'Dr. Albert Einstein' },
  { id: 'CS-1-BEE', name: 'Basic Electrical Engineering', semester: 1, faculty: 'Prof. Georg Ohm' },
  { id: 'CS-1-EG', name: 'Engineering Graphics', semester: 1, faculty: 'Prof. Leonardo da Vinci' },
  { id: 'CS-1-PC', name: 'Professional Communication', semester: 1, faculty: 'Dr. Noam Chomsky' },
  // Sem 2
  { id: 'CS-2-MATH2', name: 'Engineering Mathematics II', semester: 2, faculty: 'Prof. Isaac Newton' },
  { id: 'CS-2-CHEM', name: 'Engineering Chemistry', semester: 2, faculty: 'Dr. Marie Curie' },
  { id: 'CS-2-PPS', name: 'Programming for Problem Solving', semester: 2, faculty: 'Prof. Dennis Ritchie' },
  { id: 'CS-2-EM', name: 'Engineering Mechanics', semester: 2, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'CS-2-EVS', name: 'Environmental Science', semester: 2, faculty: 'Dr. Rachel Carson' },
  // Sem 3
  { id: 'CS-3-DS', name: 'Data Structures', semester: 3, faculty: 'Dr. Grace Hopper' },
  { id: 'CS-3-DM', name: 'Discrete Mathematics', semester: 3, faculty: 'Prof. Ada Lovelace' },
  { id: 'CS-3-DE', name: 'Digital Electronics', semester: 3, faculty: 'Dr. Claude Shannon' },
  { id: 'CS-3-COA', name: 'Computer Organization & Architecture', semester: 3, faculty: 'Prof. John von Neumann' },
  { id: 'CS-3-OOP', name: 'Object Oriented Programming', semester: 3, faculty: 'Prof. Alan Kay' },
  // Sem 4
  { id: 'CS-4-DBMS', name: 'Database Management Systems', semester: 4, faculty: 'Dr. Edgar Codd' },
  { id: 'CS-4-OS', name: 'Operating Systems', semester: 4, faculty: 'Prof. Linus Torvalds' },
  { id: 'CS-4-DAA', name: 'Design & Analysis of Algorithms', semester: 4, faculty: 'Prof. Donald Knuth' },
  { id: 'CS-4-FLAT', name: 'Formal Languages & Automata', semester: 4, faculty: 'Dr. Alan Turing' },
  { id: 'CS-4-SE', name: 'Software Engineering', semester: 4, faculty: 'Prof. Margaret Hamilton' },
  // Sem 5
  { id: 'CS-5-CN', name: 'Computer Networks', semester: 5, faculty: 'Prof. Vint Cerf' },
  { id: 'CS-5-CD', name: 'Compiler Design', semester: 5, faculty: 'Prof. Alfred Aho' },
  { id: 'CS-5-WT', name: 'Web Technologies', semester: 5, faculty: 'Prof. Tim Berners-Lee' },
  { id: 'CS-5-AJP', name: 'Advanced Java Programming', semester: 5, faculty: 'Prof. James Gosling' },
  { id: 'CS-5-AI', name: 'Artificial Intelligence', semester: 5, faculty: 'Dr. John McCarthy' },
  // Sem 6
  { id: 'CS-6-ML', name: 'Machine Learning', semester: 6, faculty: 'Dr. Andrew Ng' },
  { id: 'CS-6-CNS', name: 'Cryptography & Network Security', semester: 6, faculty: 'Prof. Adi Shamir' },
  { id: 'CS-6-DIST', name: 'Distributed Systems', semester: 6, faculty: 'Dr. Leslie Lamport' },
  { id: 'CS-6-SPM', name: 'Software Project Management', semester: 6, faculty: 'Dr. Fred Brooks' },
  { id: 'CS-6-MAD', name: 'Mobile Application Development', semester: 6, faculty: 'Prof. Steve Jobs' },
  // Sem 7
  { id: 'CS-7-CC', name: 'Cloud Computing', semester: 7, faculty: 'Dr. Werner Vogels' },
  { id: 'CS-7-BDA', name: 'Big Data Analytics', semester: 7, faculty: 'Prof. Doug Cutting' },
  { id: 'CS-7-IOT', name: 'Internet of Things', semester: 7, faculty: 'Dr. Kevin Ashton' },
  { id: 'CS-7-CSF', name: 'Cyber Security & Forensics', semester: 7, faculty: 'Prof. Gene Spafford' },
  { id: 'CS-7-IRS', name: 'Information Retrieval Systems', semester: 7, faculty: 'Dr. Gerard Salton' },
  // Sem 8
  { id: 'CS-8-DL', name: 'Deep Learning', semester: 8, faculty: 'Dr. Yann LeCun' },
  { id: 'CS-8-BCT', name: 'Block Chain Technology', semester: 8, faculty: 'Dr. Satoshi Nakamoto' },
  { id: 'CS-8-QC', name: 'Quantum Computing', semester: 8, faculty: 'Dr. Richard Feynman' },
  { id: 'CS-8-NLP', name: 'Natural Language Processing', semester: 8, faculty: 'Dr. Christopher Manning' },
  { id: 'CS-8-SNA', name: 'Social Network Analysis', semester: 8, faculty: 'Dr. Mark Granovetter' }
];

const ece_subjects = [
  // Sem 1
  { id: 'ECE-1-MATH1', name: 'Engineering Mathematics I', semester: 1, faculty: 'Prof. Isaac Newton' },
  { id: 'ECE-1-PHYS', name: 'Engineering Physics', semester: 1, faculty: 'Dr. Albert Einstein' },
  { id: 'ECE-1-BEE', name: 'Basic Electrical Engineering', semester: 1, faculty: 'Prof. Georg Ohm' },
  { id: 'ECE-1-EG', name: 'Engineering Graphics', semester: 1, faculty: 'Prof. Leonardo da Vinci' },
  { id: 'ECE-1-PC', name: 'Professional Communication', semester: 1, faculty: 'Dr. Noam Chomsky' },
  // Sem 2
  { id: 'ECE-2-MATH2', name: 'Engineering Mathematics II', semester: 2, faculty: 'Prof. Isaac Newton' },
  { id: 'ECE-2-CHEM', name: 'Engineering Chemistry', semester: 2, faculty: 'Dr. Marie Curie' },
  { id: 'ECE-2-PPS', name: 'Programming for Problem Solving', semester: 2, faculty: 'Prof. Dennis Ritchie' },
  { id: 'ECE-2-EM', name: 'Engineering Mechanics', semester: 2, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'ECE-2-EVS', name: 'Environmental Science', semester: 2, faculty: 'Dr. Rachel Carson' },
  // Sem 3
  { id: 'ECE-3-DE', name: 'Digital Electronics', semester: 3, faculty: 'Dr. Claude Shannon' },
  { id: 'ECE-3-NA', name: 'Network Analysis', semester: 3, faculty: 'Prof. Gustav Kirchhoff' },
  { id: 'ECE-3-EDC', name: 'Electronic Devices & Circuits', semester: 3, faculty: 'Dr. William Shockley' },
  { id: 'ECE-3-SS', name: 'Signals & Systems', semester: 3, faculty: 'Prof. Joseph Fourier' },
  { id: 'ECE-3-MATH3', name: 'Engineering Mathematics III', semester: 3, faculty: 'Prof. Isaac Newton' },
  // Sem 4
  { id: 'ECE-4-AC', name: 'Analog Circuits', semester: 4, faculty: 'Dr. William Shockley' },
  { id: 'ECE-4-EMF', name: 'Electromagnetic Fields', semester: 4, faculty: 'Prof. James Maxwell' },
  { id: 'ECE-4-LIC', name: 'Linear Integrated Circuits', semester: 4, faculty: 'Dr. Robert Widlar' },
  { id: 'ECE-4-MPMC', name: 'Microprocessors & Microcontrollers', semester: 4, faculty: 'Prof. Thomas Edison' },
  { id: 'ECE-4-CS', name: 'Control Systems', semester: 4, faculty: 'Dr. Claude Shannon' },
  // Sem 5
  { id: 'ECE-5-DC', name: 'Digital Communications', semester: 5, faculty: 'Dr. Harry Nyquist' },
  { id: 'ECE-5-AWP', name: 'Antenna & Wave Propagation', semester: 5, faculty: 'Prof. Heinrich Hertz' },
  { id: 'ECE-5-CA', name: 'Computer Architecture', semester: 5, faculty: 'Prof. John von Neumann' },
  { id: 'ECE-5-VLSI', name: 'VLSI Design', semester: 5, faculty: 'Dr. Carver Mead' },
  { id: 'ECE-5-DSP', name: 'Digital Signal Processing', semester: 5, faculty: 'Dr. Harry Nyquist' },
  // Sem 6
  { id: 'ECE-6-MWE', name: 'Microwave Engineering', semester: 6, faculty: 'Prof. Jagadish Chandra Bose' },
  { id: 'ECE-6-WC', name: 'Wireless Communications', semester: 6, faculty: 'Dr. Irwin Jacobs' },
  { id: 'ECE-6-OC', name: 'Optical Communications', semester: 6, faculty: 'Dr. Charles Kao' },
  { id: 'ECE-6-ES', name: 'Embedded Systems', semester: 6, faculty: 'Prof. Thomas Edison' },
  { id: 'ECE-6-MA', name: 'Microcontrollers & Applications', semester: 6, faculty: 'Dr. Andrew Ng' },
  // Sem 7
  { id: 'ECE-7-RE', name: 'Radar Engineering', semester: 7, faculty: 'Dr. Robert Watson-Watt' },
  { id: 'ECE-7-SAT', name: 'Satellite Communication', semester: 7, faculty: 'Prof. Arthur C. Clarke' },
  { id: 'ECE-7-AWN', name: 'Ad-hoc Wireless Networks', semester: 7, faculty: 'Dr. Irwin Jacobs' },
  { id: 'ECE-7-RFCD', name: 'RF Circuit Design', semester: 7, faculty: 'Dr. Carver Mead' },
  { id: 'ECE-7-RTOS', name: 'Real Time Operating Systems', semester: 7, faculty: 'Prof. Linus Torvalds' },
  // Sem 8
  { id: 'ECE-8-CMC', name: 'Cellular & Mobile Comm.', semester: 8, faculty: 'Dr. Irwin Jacobs' },
  { id: 'ECE-8-VPD', name: 'VLSI Physical Design', semester: 8, faculty: 'Dr. Carver Mead' },
  { id: 'ECE-8-NE', name: 'Nano Electronics', semester: 8, faculty: 'Dr. Richard Feynman' },
  { id: 'ECE-8-MSD', name: 'Mixed Signal Design', semester: 8, faculty: 'Dr. Robert Widlar' },
  { id: 'ECE-8-SAP', name: 'Speech & Audio Processing', semester: 8, faculty: 'Dr. James Flanagan' }
];

const eee_subjects = [
  // Sem 1
  { id: 'EEE-1-MATH1', name: 'Engineering Mathematics I', semester: 1, faculty: 'Prof. Isaac Newton' },
  { id: 'EEE-1-PHYS', name: 'Engineering Physics', semester: 1, faculty: 'Dr. Albert Einstein' },
  { id: 'EEE-1-BEE', name: 'Basic Electrical Engineering', semester: 1, faculty: 'Prof. Georg Ohm' },
  { id: 'EEE-1-EG', name: 'Engineering Graphics', semester: 1, faculty: 'Prof. Leonardo da Vinci' },
  { id: 'EEE-1-PC', name: 'Professional Communication', semester: 1, faculty: 'Dr. Noam Chomsky' },
  // Sem 2
  { id: 'EEE-2-MATH2', name: 'Engineering Mathematics II', semester: 2, faculty: 'Prof. Isaac Newton' },
  { id: 'EEE-2-CHEM', name: 'Engineering Chemistry', semester: 2, faculty: 'Dr. Marie Curie' },
  { id: 'EEE-2-PPS', name: 'Programming for Problem Solving', semester: 2, faculty: 'Prof. Dennis Ritchie' },
  { id: 'EEE-2-EM', name: 'Engineering Mechanics', semester: 2, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'EEE-2-EVS', name: 'Environmental Science', semester: 2, faculty: 'Dr. Rachel Carson' },
  // Sem 3
  { id: 'EEE-3-EMF', name: 'Electromagnetic Fields', semester: 3, faculty: 'Prof. James Maxwell' },
  { id: 'EEE-3-EM1', name: 'Electrical Machines I', semester: 3, faculty: 'Dr. Nikola Tesla' },
  { id: 'EEE-3-NT', name: 'Network Theory', semester: 3, faculty: 'Prof. Gustav Kirchhoff' },
  { id: 'EEE-3-EDC', name: 'Electronic Devices & Circuits', semester: 3, faculty: 'Dr. William Shockley' },
  { id: 'EEE-3-MATH3', name: 'Engineering Mathematics III', semester: 3, faculty: 'Prof. Isaac Newton' },
  // Sem 4
  { id: 'EEE-4-EM2', name: 'Electrical Machines II', semester: 4, faculty: 'Dr. Nikola Tesla' },
  { id: 'EEE-4-PS1', name: 'Power Systems I', semester: 4, faculty: 'Dr. Charles Steinmetz' },
  { id: 'EEE-4-AE', name: 'Analog Electronics', semester: 4, faculty: 'Dr. Robert Widlar' },
  { id: 'EEE-4-EM', name: 'Electrical Measurements', semester: 4, faculty: 'Prof. Georg Ohm' },
  { id: 'EEE-4-CS', name: 'Control Systems', semester: 4, faculty: 'Dr. Claude Shannon' },
  // Sem 5
  { id: 'EEE-5-PE', name: 'Power Electronics', semester: 5, faculty: 'Prof. Thomas Edison' },
  { id: 'EEE-5-PS2', name: 'Power Systems II', semester: 5, faculty: 'Dr. Charles Steinmetz' },
  { id: 'EEE-5-MPMC', name: 'Microprocessors & Microcontrollers', semester: 5, faculty: 'Prof. Thomas Edison' },
  { id: 'EEE-5-SS', name: 'Signals & Systems', semester: 5, faculty: 'Prof. Joseph Fourier' },
  { id: 'EEE-5-EMD', name: 'Electrical Machine Design', semester: 5, faculty: 'Dr. Nikola Tesla' },
  // Sem 6
  { id: 'EEE-6-PSA', name: 'Power System Analysis', semester: 6, faculty: 'Dr. Charles Steinmetz' },
  { id: 'EEE-6-SGP', name: 'Switchgear & Protection', semester: 6, faculty: 'Prof. Gustav Kirchhoff' },
  { id: 'EEE-6-ED', name: 'Electrical Drives', semester: 6, faculty: 'Dr. Nikola Tesla' },
  { id: 'EEE-6-UEE', name: 'Utilization of Electrical Energy', semester: 6, faculty: 'Prof. Thomas Edison' },
  { id: 'EEE-6-HVE', name: 'High Voltage Engineering', semester: 6, faculty: 'Dr. Charles Steinmetz' },
  // Sem 7
  { id: 'EEE-7-PSOC', name: 'Power System Operation & Control', semester: 7, faculty: 'Dr. Charles Steinmetz' },
  { id: 'EEE-7-RES', name: 'Renewable Energy Sources', semester: 7, faculty: 'Dr. Albert Einstein' },
  { id: 'EEE-7-HVDC', name: 'HVDC Transmission', semester: 7, faculty: 'Dr. Nikola Tesla' },
  { id: 'EEE-7-SGT', name: 'Smart Grid Technologies', semester: 7, faculty: 'Dr. Werner Vogels' },
  { id: 'EEE-7-FACTS', name: 'Flexible AC Transmission Systems', semester: 7, faculty: 'Prof. Gustav Kirchhoff' },
  // Sem 8
  { id: 'EEE-8-PQ', name: 'Power Quality', semester: 8, faculty: 'Dr. Charles Steinmetz' },
  { id: 'EEE-8-AIPS', name: 'AI Techniques in Power Systems', semester: 8, faculty: 'Dr. Andrew Ng' },
  { id: 'EEE-8-DG', name: 'Distributed Generation', semester: 8, faculty: 'Dr. Nikola Tesla' },
  { id: 'EEE-8-SEM', name: 'Special Electrical Machines', semester: 8, faculty: 'Dr. Nikola Tesla' },
  { id: 'EEE-8-HEV', name: 'Hybrid Electric Vehicles', semester: 8, faculty: 'Prof. Thomas Edison' }
];

const me_subjects = [
  // Sem 1
  { id: 'ME-1-MATH1', name: 'Engineering Mathematics I', semester: 1, faculty: 'Prof. Isaac Newton' },
  { id: 'ME-1-PHYS', name: 'Engineering Physics', semester: 1, faculty: 'Dr. Albert Einstein' },
  { id: 'ME-1-BEE', name: 'Basic Electrical Engineering', semester: 1, faculty: 'Prof. Georg Ohm' },
  { id: 'ME-1-EG', name: 'Engineering Graphics', semester: 1, faculty: 'Prof. Leonardo da Vinci' },
  { id: 'ME-1-PC', name: 'Professional Communication', semester: 1, faculty: 'Dr. Noam Chomsky' },
  // Sem 2
  { id: 'ME-2-MATH2', name: 'Engineering Mathematics II', semester: 2, faculty: 'Prof. Isaac Newton' },
  { id: 'ME-2-CHEM', name: 'Engineering Chemistry', semester: 2, faculty: 'Dr. Marie Curie' },
  { id: 'ME-2-PPS', name: 'Programming for Problem Solving', semester: 2, faculty: 'Prof. Dennis Ritchie' },
  { id: 'ME-2-EM', name: 'Engineering Mechanics', semester: 2, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'ME-2-EVS', name: 'Environmental Science', semester: 2, faculty: 'Dr. Rachel Carson' },
  // Sem 3
  { id: 'ME-3-MM', name: 'Mechanics of Materials', semester: 3, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'ME-3-TD', name: 'Thermodynamics', semester: 3, faculty: 'Prof. Rudolf Diesel' },
  { id: 'ME-3-MMS', name: 'Metallurgy & Material Science', semester: 3, faculty: 'Dr. Marie Curie' },
  { id: 'ME-3-MF', name: 'Mechanics of Fluids', semester: 3, faculty: 'Dr. Ludwig Prandtl' },
  { id: 'ME-3-MATH3', name: 'Engineering Mathematics III', semester: 3, faculty: 'Prof. Isaac Newton' },
  // Sem 4
  { id: 'ME-4-ATD', name: 'Applied Thermodynamics', semester: 4, faculty: 'Prof. Rudolf Diesel' },
  { id: 'ME-4-FMHM', name: 'Fluid Mechanics & Hydraulic Machinery', semester: 4, faculty: 'Dr. Ludwig Prandtl' },
  { id: 'ME-4-KM', name: 'Kinematics of Machinery', semester: 4, faculty: 'Dr. Henry Ford' },
  { id: 'ME-4-MT1', name: 'Manufacturing Technology I', semester: 4, faculty: 'Prof. James Watt' },
  { id: 'ME-4-MD', name: 'Machine Drawing', semester: 4, faculty: 'Prof. James Watt' },
  // Sem 5
  { id: 'ME-5-DM', name: 'Dynamics of Machinery', semester: 5, faculty: 'Dr. Henry Ford' },
  { id: 'ME-5-MD1', name: 'Machine Design I', semester: 5, faculty: 'Prof. James Watt' },
  { id: 'ME-5-MT2', name: 'Manufacturing Technology II', semester: 5, faculty: 'Prof. James Watt' },
  { id: 'ME-5-HMT', name: 'Heat & Mass Transfer', semester: 5, faculty: 'Dr. Wilhelm Nusselt' },
  { id: 'ME-5-IE', name: 'Industrial Engineering', semester: 5, faculty: 'Dr. Henry Gantt' },
  // Sem 6
  { id: 'ME-6-MD2', name: 'Machine Design II', semester: 6, faculty: 'Prof. James Watt' },
  { id: 'ME-6-CAD', name: 'CAD/CAM', semester: 6, faculty: 'Prof. CAD Expert' },
  { id: 'ME-6-RAC', name: 'Refrigeration & Air Conditioning', semester: 6, faculty: 'Prof. Willis Carrier' },
  { id: 'ME-6-MI', name: 'Metrology & Instrumentation', semester: 6, faculty: 'Prof. James Watt' },
  { id: 'ME-6-OR', name: 'Operations Research', semester: 6, faculty: 'Dr. George Dantzig' },
  // Sem 7
  { id: 'ME-7-AE', name: 'Automobile Engineering', semester: 7, faculty: 'Dr. Henry Ford' },
  { id: 'ME-7-PPE', name: 'Power Plant Engineering', semester: 7, faculty: 'Prof. James Watt' },
  { id: 'ME-7-FEA', name: 'Finite Element Analysis', semester: 7, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'ME-7-MC', name: 'Mechatronics', semester: 7, faculty: 'Prof. Thomas Edison' },
  { id: 'ME-7-UM', name: 'Unconventional Machining', semester: 7, faculty: 'Prof. James Watt' },
  // Sem 8
  { id: 'ME-8-ROB', name: 'Robotics', semester: 8, faculty: 'Dr. Asimov' },
  { id: 'ME-8-TQM', name: 'Total Quality Management', semester: 8, faculty: 'Dr. W. Edwards Deming' },
  { id: 'ME-8-CFD', name: 'Computational Fluid Dynamics', semester: 8, faculty: 'Dr. Ludwig Prandtl' },
  { id: 'ME-8-AM', name: 'Additive Manufacturing', semester: 8, faculty: 'Prof. James Watt' },
  { id: 'ME-8-NDT', name: 'Non-Destructive Testing', semester: 8, faculty: 'Prof. Stephen Timoshenko' }
];

const ce_subjects = [
  // Sem 1
  { id: 'CE-1-MATH1', name: 'Engineering Mathematics I', semester: 1, faculty: 'Prof. Isaac Newton' },
  { id: 'CE-1-PHYS', name: 'Engineering Physics', semester: 1, faculty: 'Dr. Albert Einstein' },
  { id: 'CE-1-BEE', name: 'Basic Electrical Engineering', semester: 1, faculty: 'Prof. Georg Ohm' },
  { id: 'CE-1-EG', name: 'Engineering Graphics', semester: 1, faculty: 'Prof. Leonardo da Vinci' },
  { id: 'CE-1-PC', name: 'Professional Communication', semester: 1, faculty: 'Dr. Noam Chomsky' },
  // Sem 2
  { id: 'CE-2-MATH2', name: 'Engineering Mathematics II', semester: 2, faculty: 'Prof. Isaac Newton' },
  { id: 'CE-2-CHEM', name: 'Engineering Chemistry', semester: 2, faculty: 'Dr. Marie Curie' },
  { id: 'CE-2-PPS', name: 'Programming for Problem Solving', semester: 2, faculty: 'Prof. Dennis Ritchie' },
  { id: 'CE-2-EM', name: 'Engineering Mechanics', semester: 2, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'CE-2-EVS', name: 'Environmental Science', semester: 2, faculty: 'Dr. Rachel Carson' },
  // Sem 3
  { id: 'CE-3-SV', name: 'Surveying', semester: 3, faculty: 'Dr. George Washington' },
  { id: 'CE-3-MF', name: 'Mechanics of Fluids', semester: 3, faculty: 'Dr. Ludwig Prandtl' },
  { id: 'CE-3-SM', name: 'Strength of Materials', semester: 3, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'CE-3-CT', name: 'Concrete Technology', semester: 3, faculty: 'Dr. Arthur Casagrande' },
  { id: 'CE-3-EG', name: 'Engineering Geology', semester: 3, faculty: 'Dr. Charles Lyell' },
  // Sem 4
  { id: 'CE-4-SA1', name: 'Structural Analysis I', semester: 4, faculty: 'Prof. Hardy Cross' },
  { id: 'CE-4-HHM', name: 'Hydraulics & Hydraulic Machinery', semester: 4, faculty: 'Dr. Ludwig Prandtl' },
  { id: 'CE-4-GE1', name: 'Geotechnical Engineering I', semester: 4, faculty: 'Prof. Karl Terzaghi' },
  { id: 'CE-4-BMC', name: 'Building Materials & Construction', semester: 4, faculty: 'Dr. Arthur Casagrande' },
  { id: 'CE-4-TE1', name: 'Transportation Engineering I', semester: 4, faculty: 'Dr. John McAdam' },
  // Sem 5
  { id: 'CE-5-SA2', name: 'Structural Analysis II', semester: 5, faculty: 'Prof. Hardy Cross' },
  { id: 'CE-5-GE2', name: 'Geotechnical Engineering II', semester: 5, faculty: 'Prof. Karl Terzaghi' },
  { id: 'CE-5-EE1', name: 'Environmental Engineering I', semester: 5, faculty: 'Prof. John Snow' },
  { id: 'CE-5-DRCS', name: 'Design of RC Structures', semester: 5, faculty: 'Prof. Karl Terzaghi' },
  { id: 'CE-5-TE2', name: 'Transportation Engineering II', semester: 5, faculty: 'Dr. John McAdam' },
  // Sem 6
  { id: 'CE-6-EE2', name: 'Environmental Engineering II', semester: 6, faculty: 'Prof. John Snow' },
  { id: 'CE-6-DSS', name: 'Design of Steel Structures', semester: 6, faculty: 'Prof. Hardy Cross' },
  { id: 'CE-6-WRE1', name: 'Water Resources Engineering I', semester: 6, faculty: 'Dr. Osborne Reynolds' },
  { id: 'CE-6-EC', name: 'Estimation & Costing', semester: 6, faculty: 'Dr. Henry Gantt' },
  { id: 'CE-6-CPM', name: 'Construction Project Management', semester: 6, faculty: 'Dr. Henry Gantt' },
  // Sem 7
  { id: 'CE-7-DFS', name: 'Design of Foundation Systems', semester: 7, faculty: 'Prof. Karl Terzaghi' },
  { id: 'CE-7-WRE2', name: 'Water Resources Engineering II', semester: 7, faculty: 'Dr. Osborne Reynolds' },
  { id: 'CE-7-PC', name: 'Pre-stressed Concrete', semester: 7, faculty: 'Prof. Karl Terzaghi' },
  { id: 'CE-7-RSGIS', name: 'Remote Sensing & GIS', semester: 7, faculty: 'Dr. John Snow' },
  { id: 'CE-7-GIT', name: 'Ground Improvement Techniques', semester: 7, faculty: 'Prof. Karl Terzaghi' },
  // Sem 8
  { id: 'CE-8-PD', name: 'Pavement Design', semester: 8, faculty: 'Dr. John McAdam' },
  { id: 'CE-8-ERD', name: 'Earthquake Resistant Design', semester: 8, faculty: 'Prof. Charles Richter' },
  { id: 'CE-8-BE', name: 'Bridge Engineering', semester: 8, faculty: 'Prof. Hardy Cross' },
  { id: 'CE-8-EIA', name: 'Environmental Impact Assessment', semester: 8, faculty: 'Prof. John Snow' },
  { id: 'CE-8-SD', name: 'Soil Dynamics', semester: 8, faculty: 'Prof. Karl Terzaghi' }
];

const ch_subjects = [
  // Sem 1
  { id: 'CH-1-MATH1', name: 'Engineering Mathematics I', semester: 1, faculty: 'Prof. Isaac Newton' },
  { id: 'CH-1-PHYS', name: 'Engineering Physics', semester: 1, faculty: 'Dr. Albert Einstein' },
  { id: 'CH-1-BEE', name: 'Basic Electrical Engineering', semester: 1, faculty: 'Prof. Georg Ohm' },
  { id: 'CH-1-EG', name: 'Engineering Graphics', semester: 1, faculty: 'Prof. Leonardo da Vinci' },
  { id: 'CH-1-PC', name: 'Professional Communication', semester: 1, faculty: 'Dr. Noam Chomsky' },
  // Sem 2
  { id: 'CH-2-MATH2', name: 'Engineering Mathematics II', semester: 2, faculty: 'Prof. Isaac Newton' },
  { id: 'CH-2-CHEM', name: 'Engineering Chemistry', semester: 2, faculty: 'Dr. Marie Curie' },
  { id: 'CH-2-PPS', name: 'Programming for Problem Solving', semester: 2, faculty: 'Prof. Dennis Ritchie' },
  { id: 'CH-2-EM', name: 'Engineering Mechanics', semester: 2, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'CH-2-EVS', name: 'Environmental Science', semester: 2, faculty: 'Dr. Rachel Carson' },
  // Sem 3
  { id: 'CH-3-CPC', name: 'Chemical Process Calculations', semester: 3, faculty: 'Prof. Richard Felder' },
  { id: 'CH-3-FF', name: 'Fluid Flow', semester: 3, faculty: 'Dr. Osborne Reynolds' },
  { id: 'CH-3-MUO', name: 'Mechanical Unit Operations', semester: 3, faculty: 'Prof. Richard Felder' },
  { id: 'CH-3-OC', name: 'Organic Chemistry', semester: 3, faculty: 'Dr. Marie Curie' },
  { id: 'CH-3-MATH3', name: 'Engineering Mathematics III', semester: 3, faculty: 'Prof. Isaac Newton' },
  // Sem 4
  { id: 'CH-4-CET', name: 'Chemical Eng. Thermodynamics', semester: 4, faculty: 'Prof. J. Willard Gibbs' },
  { id: 'CH-4-HT', name: 'Heat Transfer', semester: 4, faculty: 'Dr. Wilhelm Nusselt' },
  { id: 'CH-4-CT', name: 'Chemical Technology', semester: 4, faculty: 'Prof. Richard Felder' },
  { id: 'CH-4-MS', name: 'Materials Science', semester: 4, faculty: 'Dr. Marie Curie' },
  { id: 'CH-4-EVS', name: 'Environmental Studies', semester: 4, faculty: 'Dr. Rachel Carson' },
  // Sem 5
  { id: 'CH-5-MT1', name: 'Mass Transfer I', semester: 5, faculty: 'Prof. Adolf Fick' },
  { id: 'CH-5-CRE1', name: 'Chemical Reaction Eng. I', semester: 5, faculty: 'Dr. Octave Levenspiel' },
  { id: 'CH-5-PI', name: 'Process Instrumentation', semester: 5, faculty: 'Prof. J. Willard Gibbs' },
  { id: 'CH-5-OCP', name: 'Optimization of Chemical Processes', semester: 5, faculty: 'Prof. Richard Felder' },
  { id: 'CH-5-IS', name: 'Industrial Safety', semester: 5, faculty: 'Dr. Trevor Kletz' },
  // Sem 6
  { id: 'CH-6-MT2', name: 'Mass Transfer II', semester: 6, faculty: 'Prof. Adolf Fick' },
  { id: 'CH-6-CRE2', name: 'Chemical Reaction Eng. II', semester: 6, faculty: 'Dr. Octave Levenspiel' },
  { id: 'CH-6-PDC', name: 'Process Dynamics & Control', semester: 6, faculty: 'Dr. Donald Coughanowr' },
  { id: 'CH-6-PMS', name: 'Process Modeling & Simulation', semester: 6, faculty: 'Prof. Richard Felder' },
  { id: 'CH-6-EE', name: 'Energy Engineering', semester: 6, faculty: 'Prof. James Watt' },
  // Sem 7
  { id: 'CH-7-PDE', name: 'Plant Design & Economics', semester: 7, faculty: 'Prof. Max Peters' },
  { id: 'CH-7-PS', name: 'Process Safety', semester: 7, faculty: 'Dr. Trevor Kletz' },
  { id: 'CH-7-TP', name: 'Transport Phenomena', semester: 7, faculty: 'Prof. R. Byron Bird' },
  { id: 'CH-7-PE', name: 'Petrochemical Engineering', semester: 7, faculty: 'Prof. Richard Felder' },
  { id: 'CH-7-PST', name: 'Polymer Science & Technology', semester: 7, faculty: 'Dr. Marie Curie' },
  // Sem 8
  { id: 'CH-8-BE', name: 'Biochemical Engineering', semester: 8, faculty: 'Dr. Alexander Fleming' },
  { id: 'CH-8-MT', name: 'Membrane Technology', semester: 8, faculty: 'Prof. Adolf Fick' },
  { id: 'CH-8-CT', name: 'Clean Technology', semester: 8, faculty: 'Dr. Rachel Carson' },
  { id: 'CH-8-NT', name: 'Nanotechnology', semester: 8, faculty: 'Dr. Richard Feynman' },
  { id: 'CH-8-NST', name: 'Novel Separation Techniques', semester: 8, faculty: 'Prof. Adolf Fick' }
];

const it_subjects = [
  // Sem 1
  { id: 'IT-1-MATH1', name: 'Engineering Mathematics I', semester: 1, faculty: 'Prof. Isaac Newton' },
  { id: 'IT-1-PHYS', name: 'Engineering Physics', semester: 1, faculty: 'Dr. Albert Einstein' },
  { id: 'IT-1-BEE', name: 'Basic Electrical Engineering', semester: 1, faculty: 'Prof. Georg Ohm' },
  { id: 'IT-1-EG', name: 'Engineering Graphics', semester: 1, faculty: 'Prof. Leonardo da Vinci' },
  { id: 'IT-1-PC', name: 'Professional Communication', semester: 1, faculty: 'Dr. Noam Chomsky' },
  // Sem 2
  { id: 'IT-2-MATH2', name: 'Engineering Mathematics II', semester: 2, faculty: 'Prof. Isaac Newton' },
  { id: 'IT-2-CHEM', name: 'Engineering Chemistry', semester: 2, faculty: 'Dr. Marie Curie' },
  { id: 'IT-2-PPS', name: 'Programming for Problem Solving', semester: 2, faculty: 'Prof. Dennis Ritchie' },
  { id: 'IT-2-EM', name: 'Engineering Mechanics', semester: 2, faculty: 'Prof. Stephen Timoshenko' },
  { id: 'IT-2-EVS', name: 'Environmental Science', semester: 2, faculty: 'Dr. Rachel Carson' },
  // Sem 3
  { id: 'IT-3-PP', name: 'Python Programming', semester: 3, faculty: 'Prof. Guido van Rossum' },
  { id: 'IT-3-DSY', name: 'Digital Systems', semester: 3, faculty: 'Dr. Claude Shannon' },
  { id: 'IT-3-DS', name: 'Data Structures', semester: 3, faculty: 'Dr. Grace Hopper' },
  { id: 'IT-3-DM', name: 'Discrete Mathematics', semester: 3, faculty: 'Prof. Ada Lovelace' },
  { id: 'IT-3-OOPJ', name: 'OOP using Java', semester: 3, faculty: 'Prof. James Gosling' },
  // Sem 4
  { id: 'IT-4-JP', name: 'Java Programming', semester: 4, faculty: 'Prof. James Gosling' },
  { id: 'IT-4-WT', name: 'Web Technologies', semester: 4, faculty: 'Prof. Tim Berners-Lee' },
  { id: 'IT-4-CO', name: 'Computer Organization', semester: 4, faculty: 'Prof. John von Neumann' },
  { id: 'IT-4-DBS', name: 'Database Systems', semester: 4, faculty: 'Dr. Edgar Codd' },
  { id: 'IT-4-OS', name: 'Operating Systems', semester: 4, faculty: 'Prof. Linus Torvalds' },
  // Sem 5
  { id: 'IT-5-DBMS', name: 'Database Management Systems', semester: 5, faculty: 'Dr. Edgar Codd' },
  { id: 'IT-5-SE', name: 'Software Engineering', semester: 5, faculty: 'Prof. Margaret Hamilton' },
  { id: 'IT-5-CN', name: 'Computer Networks', semester: 5, faculty: 'Prof. Vint Cerf' },
  { id: 'IT-5-DAA', name: 'Design & Analysis of Algorithms', semester: 5, faculty: 'Prof. Donald Knuth' },
  { id: 'IT-5-LI', name: 'Linux Internals', semester: 5, faculty: 'Prof. Linus Torvalds' },
  // Sem 6
  { id: 'IT-6-CD', name: 'Compiler Design', semester: 6, faculty: 'Prof. Alfred Aho' },
  { id: 'IT-6-CNS', name: 'Cryptography & Network Security', semester: 6, faculty: 'Prof. Adi Shamir' },
  { id: 'IT-6-DIST', name: 'Distributed Systems', semester: 6, faculty: 'Dr. Leslie Lamport' },
  { id: 'IT-6-SPM', name: 'Software Project Management', semester: 6, faculty: 'Dr. Fred Brooks' },
  { id: 'IT-6-MAD', name: 'Mobile Application Development', semester: 6, faculty: 'Prof. Steve Jobs' },
  // Sem 7
  { id: 'IT-7-CC', name: 'Cloud Computing', semester: 7, faculty: 'Dr. Werner Vogels' },
  { id: 'IT-7-IS', name: 'Information Security', semester: 7, faculty: 'Prof. Adi Shamir' },
  { id: 'IT-7-DMW', name: 'Data Mining & Warehousing', semester: 7, faculty: 'Dr. Edgar Codd' },
  { id: 'IT-7-DS', name: 'Distributed Systems', semester: 7, faculty: 'Dr. Leslie Lamport' },
  { id: 'IT-7-MC', name: 'Mobile Computing', semester: 7, faculty: 'Dr. Irwin Jacobs' },
  // Sem 8
  { id: 'IT-8-ML', name: 'Machine Learning', semester: 8, faculty: 'Dr. Andrew Ng' },
  { id: 'IT-8-BDA', name: 'Big Data Analytics', semester: 8, faculty: 'Prof. Doug Cutting' },
  { id: 'IT-8-CNS', name: 'Cryptography & Network Security', semester: 8, faculty: 'Prof. Adi Shamir' },
  { id: 'IT-8-EC', name: 'E-Commerce', semester: 8, faculty: 'Prof. Tim Berners-Lee' },
  { id: 'IT-8-HCI', name: 'Human Computer Interaction', semester: 8, faculty: 'Dr. Grace Hopper' }
];


export const DEPARTMENTS = {
  cs: {
    name: 'Computer Science & Engineering',
    subjects: cs_subjects
  },
  ece: {
    name: 'Electronics & Comm. Eng.',
    subjects: ece_subjects
  },
  eee: {
    name: 'Electrical & Electronics Eng.',
    subjects: eee_subjects
  },
  ee: {
    name: 'Electrical & Electronics Eng.',
    subjects: eee_subjects // Map legacy 'ee' reference to 'eee'
  },
  me: {
    name: 'Mechanical Eng.',
    subjects: me_subjects
  },
  ce: {
    name: 'Civil Eng.',
    subjects: ce_subjects
  },
  ch: {
    name: 'Chemical Eng.',
    subjects: ch_subjects
  },
  it: {
    name: 'Information Technology',
    subjects: it_subjects
  }
};

const makeWeeklyTimetable = (subjectsList) => {
  const getSub = (semester, index) => {
    const filtered = subjectsList.filter(s => s.semester === semester);
    return filtered[index] || subjectsList[0] || { name: 'Laboratory', faculty: 'TBD' };
  };

  return [
    // Monday
    { day: 'Monday', time: '09:00 AM - 10:30 AM', subject: getSub(3, 0).name, faculty: getSub(3, 0).faculty, room: 'Room 301' },
    { day: 'Monday', time: '11:00 AM - 12:30 PM', subject: getSub(5, 0).name, faculty: getSub(5, 0).faculty, room: 'Lab A' },
    { day: 'Monday', time: '02:00 PM - 03:30 PM', subject: getSub(7, 0).name, faculty: getSub(7, 0).faculty, room: 'Room 401' },

    // Tuesday
    { day: 'Tuesday', time: '09:00 AM - 10:30 AM', subject: getSub(3, 1).name, faculty: getSub(3, 1).faculty, room: 'Room 302' },
    { day: 'Tuesday', time: '11:00 AM - 12:30 PM', subject: getSub(5, 1).name, faculty: getSub(5, 1).faculty, room: 'Lab B' },
    { day: 'Tuesday', time: '02:00 PM - 03:30 PM', subject: getSub(7, 1).name, faculty: getSub(7, 1).faculty, room: 'Room 402' },

    // Wednesday
    { day: 'Wednesday', time: '09:00 AM - 10:30 AM', subject: getSub(3, 2).name, faculty: getSub(3, 2).faculty, room: 'Room 301' },
    { day: 'Wednesday', time: '11:00 AM - 12:30 PM', subject: getSub(5, 2).name, faculty: getSub(5, 2).faculty, room: 'Lab A' },
    { day: 'Wednesday', time: '02:00 PM - 03:30 PM', subject: getSub(7, 2).name, faculty: getSub(7, 2).faculty, room: 'Room 401' },

    // Thursday
    { day: 'Thursday', time: '09:00 AM - 10:30 AM', subject: getSub(3, 3).name, faculty: getSub(3, 3).faculty, room: 'Room 302' },
    { day: 'Thursday', time: '11:00 AM - 12:30 PM', subject: getSub(5, 3).name, faculty: getSub(5, 3).faculty, room: 'Lab B' },
    { day: 'Thursday', time: '02:00 PM - 03:30 PM', subject: getSub(7, 3).name, faculty: getSub(7, 3).faculty, room: 'Room 402' },

    // Friday
    { day: 'Friday', time: '09:00 AM - 10:30 AM', subject: getSub(3, 4).name, faculty: getSub(3, 4).faculty, room: 'Room 301' },
    { day: 'Friday', time: '11:00 AM - 12:30 PM', subject: getSub(5, 4).name, faculty: getSub(5, 4).faculty, room: 'Lab A' },
    { day: 'Friday', time: '02:00 PM - 03:30 PM', subject: getSub(7, 4).name, faculty: getSub(7, 4).faculty, room: 'Room 401' }
  ];
};

export const WEEKLY_TIMETABLE = {
  cs: makeWeeklyTimetable(cs_subjects),
  ece: makeWeeklyTimetable(ece_subjects),
  eee: makeWeeklyTimetable(eee_subjects),
  ee: makeWeeklyTimetable(eee_subjects), // Map legacy 'ee' reference to 'eee'
  me: makeWeeklyTimetable(me_subjects),
  ce: makeWeeklyTimetable(ce_subjects),
  ch: makeWeeklyTimetable(ch_subjects),
  it: makeWeeklyTimetable(it_subjects)
};

export const CLASS_STRENGTHS = {
  'cs-3-A': 35,
  'cs-3-B': 35,
  'cs-3-C': 35,
  'cs-4-A': 20,
  'cs-4-B': 20,
  'cs-4-C': 20,
  'ece-2-A': 20,
  'ece-2-B': 20,
  'ece-2-C': 20,
  'eee-3-A': 20,
  'eee-3-B': 20,
  'eee-3-C': 20,
  'me-3-A': 16,
  'me-3-B': 16,
  'me-3-C': 16,
  'ce-4-A': 14,
  'ce-4-B': 14,
  'ce-4-C': 14
};

export const PROFILE_IMAGES = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1579038773867-044c48829161?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1528892951276-a6a247ec6c58?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1504257400765-18889394f4b3?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256'
];

export const generateRoster = (dept, year, section, semester) => {
  // Real Google Form Dataset (Synced with Active MySQL Database)
  return [
    {
      id: "715524104129",
      name: "Renukrishna S",
      dept: "Computer Science & Engineering",
      section: "C",
      year: `${year || 3}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`,
      semester: semester || 5,
      img: "http://localhost:5000/uploads/students/1790767337081-219623626.jpg",
      phone: "+91 9747394949",
      email: "24z229@psgitech.ac.in"
    }
  ];
};
