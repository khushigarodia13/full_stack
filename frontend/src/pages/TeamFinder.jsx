import React, { useState, useEffect } from 'react';
import { FaUsers, FaFilter, FaSearch, FaRocket, FaTrophy, FaHandshake, FaGraduationCap, FaCode } from 'react-icons/fa';
import StudentCard from '../components/StudentCard';

export default function TeamFinder() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    scoreRange: 'all',
    skillMatch: 'all',
    year: 'all',
    goals: 'all',
    college: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Indian students data with NIT colleges
  const indianStudents = [
    {
      id: 1,
      name: 'Arjun Sharma',
      year: 3,
      college: 'NIT Agartala',
      productivityScore: 85,
      skills: [
        { name: 'React', level: 'Advanced' },
        { name: 'Node.js', level: 'Intermediate' },
        { name: 'Python', level: 'Expert' }
      ],
      goals: 'Full-stack development and machine learning',
      github: 'https://github.com/arjunsharma',
      linkedin: 'https://linkedin.com/in/arjunsharma',
      location: 'Agartala, Tripura'
    },
    {
      id: 2,
      name: 'Priya Patel',
      year: 2,
      college: 'NIT Warangal',
      productivityScore: 78,
      skills: [
        { name: 'React', level: 'Intermediate' },
        { name: 'JavaScript', level: 'Advanced' },
        { name: 'UI/UX', level: 'Beginner' }
      ],
      goals: 'Frontend development and UI/UX design',
      github: 'https://github.com/priyapatel',
      linkedin: 'https://linkedin.com/in/priyapatel',
      location: 'Warangal, Telangana'
    },
    {
      id: 3,
      name: 'Rahul Verma',
      year: 4,
      college: 'NIT Trichy',
      productivityScore: 92,
      skills: [
        { name: 'Python', level: 'Expert' },
        { name: 'Machine Learning', level: 'Advanced' },
        { name: 'Data Science', level: 'Expert' }
      ],
      goals: 'AI/ML research and data science',
      github: 'https://github.com/rahulverma',
      linkedin: 'https://linkedin.com/in/rahulverma',
      location: 'Trichy, Tamil Nadu'
    },
    {
      id: 4,
      name: 'Ananya Singh',
      year: 2,
      college: 'NIT Surathkal',
      productivityScore: 71,
      skills: [
        { name: 'Java', level: 'Intermediate' },
        { name: 'Android', level: 'Beginner' },
        { name: 'Kotlin', level: 'Intermediate' }
      ],
      goals: 'Mobile app development',
      github: 'https://github.com/ananyasingh',
      linkedin: 'https://linkedin.com/in/ananyasingh',
      location: 'Surathkal, Karnataka'
    },
    {
      id: 5,
      name: 'Vikram Malhotra',
      year: 3,
      college: 'NIT Rourkela',
      productivityScore: 88,
      skills: [
        { name: 'DevOps', level: 'Advanced' },
        { name: 'Docker', level: 'Expert' },
        { name: 'Kubernetes', level: 'Intermediate' }
      ],
      goals: 'DevOps engineering and cloud architecture',
      github: 'https://github.com/vikrammalhotra',
      linkedin: 'https://linkedin.com/in/vikrammalhotra',
      location: 'Rourkela, Odisha'
    },
    {
      id: 6,
      name: 'Kavya Reddy',
      year: 1,
      college: 'NIT Calicut',
      productivityScore: 65,
      skills: [
        { name: 'C++', level: 'Intermediate' },
        { name: 'Data Structures', level: 'Advanced' },
        { name: 'Algorithms', level: 'Beginner' }
      ],
      goals: 'Competitive programming and software engineering',
      github: 'https://github.com/kavyareddy',
      linkedin: 'https://linkedin.com/in/kavyareddy',
      location: 'Calicut, Kerala'
    },
    {
      id: 7,
      name: 'Aditya Kumar',
      year: 4,
      college: 'NIT Durgapur',
      productivityScore: 95,
      skills: [
        { name: 'Cybersecurity', level: 'Expert' },
        { name: 'Ethical Hacking', level: 'Advanced' },
        { name: 'Network Security', level: 'Expert' }
      ],
      goals: 'Cybersecurity analyst and penetration testing',
      github: 'https://github.com/adityakumar',
      linkedin: 'https://linkedin.com/in/adityakumar',
      location: 'Durgapur, West Bengal'
    },
    {
      id: 8,
      name: 'Zara Khan',
      year: 2,
      college: 'NIT Silchar',
      productivityScore: 82,
      skills: [
        { name: 'Blockchain', level: 'Intermediate' },
        { name: 'Solidity', level: 'Advanced' },
        { name: 'Web3', level: 'Beginner' }
      ],
      goals: 'Blockchain development and DeFi',
      github: 'https://github.com/zarakhan',
      linkedin: 'https://linkedin.com/in/zarakhan',
      location: 'Silchar, Assam'
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/user/team-finder", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStudents(data.users);
          setFilteredStudents(data.users);
        } else {
          console.error('Failed to fetch users');
          // Fallback to hardcoded data if API fails
          setStudents(indianStudents);
          setFilteredStudents(indianStudents);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to hardcoded data if API fails
        setStudents(indianStudents);
        setFilteredStudents(indianStudents);
      }
      
      // Set current user with default skills
      setCurrentUser({
        id: 'current-user',
        skills: [
          { name: 'React', level: 'Intermediate' },
          { name: 'JavaScript', level: 'Advanced' },
          { name: 'Node.js', level: 'Beginner' }
        ]
      });
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, filters, searchTerm]);

  const filterStudents = () => {
    let filtered = students.filter(student => {
      // Search filter
      if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !student.college.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Score range filter
      if (filters.scoreRange !== 'all') {
        const [min, max] = filters.scoreRange.split('-').map(Number);
        if (student.productivityScore < min || student.productivityScore > max) {
          return false;
        }
      }

      // Year filter
      if (filters.year !== 'all' && student.year !== parseInt(filters.year)) {
        return false;
      }

      // College filter
      if (filters.college !== 'all' && student.college !== filters.college) {
        return false;
      }

      // Goals filter
      if (filters.goals !== 'all' && !student.goals.toLowerCase().includes(filters.goals.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort by skill match percentage
    filtered.sort((a, b) => {
      const matchA = calculateSkillMatch(a.skills, currentUser?.skills || []);
      const matchB = calculateSkillMatch(b.skills, currentUser?.skills || []);
      return matchB - matchA;
    });

    setFilteredStudents(filtered);
  };

  const calculateSkillMatch = (studentSkills, userSkills) => {
    if (!userSkills.length) return 0;
    
    const studentSkillNames = studentSkills.map(s => s.name.toLowerCase());
    const userSkillNames = userSkills.map(s => s.name.toLowerCase());
    
    const commonSkills = studentSkillNames.filter(skill => 
      userSkillNames.includes(skill)
    );
    
    return Math.round((commonSkills.length / userSkillNames.length) * 100);
  };

  const handleConnect = async (studentId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Connection request sent to student ${studentId}`);
  };

  const getScoreRangeLabel = (range) => {
    switch (range) {
      case '80-100': return 'Elite (80-100)';
      case '70-79': return 'Excellent (70-79)';
      case '60-69': return 'Good (60-69)';
      case '40-59': return 'Average (40-59)';
      default: return 'All Scores';
    }
  };

  const getColleges = () => {
    return [...new Set(students.map(student => student.college))];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaUsers className="text-2xl text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">Team Finder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <FaRocket className="text-yellow-400 text-xl" />
              <span className="text-yellow-400 font-semibold text-lg">Hackathon Ready</span>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            Connect with students from NITs who share your skills and goals. Perfect for hackathons, 
            collaborative projects, and building your network!
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg mb-8 border border-gray-700">
          <div className="flex items-center mb-6">
            <FaFilter className="text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>

            {/* Score Range */}
            <select
              value={filters.scoreRange}
              onChange={(e) => setFilters({...filters, scoreRange: e.target.value})}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
            >
              <option value="all">All Scores</option>
              <option value="80-100">Elite (80-100)</option>
              <option value="70-79">Excellent (70-79)</option>
              <option value="60-69">Good (60-69)</option>
              <option value="40-59">Average (40-59)</option>
            </select>

            {/* Year */}
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
            >
              <option value="all">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">Final Year</option>
            </select>

            {/* College */}
            <select
              value={filters.college}
              onChange={(e) => setFilters({...filters, college: e.target.value})}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
            >
              <option value="all">All Colleges</option>
              {getColleges().map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>

            {/* Goals */}
            <select
              value={filters.goals}
              onChange={(e) => setFilters({...filters, goals: e.target.value})}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
            >
              <option value="all">All Goals</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Development</option>
              <option value="ai">AI/ML</option>
              <option value="data">Data Science</option>
              <option value="cyber">Cybersecurity</option>
              <option value="devops">DevOps</option>
            </select>

            {/* Skill Match */}
            <select
              value={filters.skillMatch}
              onChange={(e) => setFilters({...filters, skillMatch: e.target.value})}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
            >
              <option value="all">All Skill Matches</option>
              <option value="high">High Match (80%+)</option>
              <option value="medium">Medium Match (50-79%)</option>
              <option value="low">Low Match (&lt;50%)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Available Students</h2>
            <div className="text-gray-300 text-lg">
              {filteredStudents.length} students found
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                currentUser={currentUser}
                onConnect={handleConnect}
              />
            ))}
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No students found</h3>
              <p className="text-gray-500">Try adjusting your filters to find more students</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 