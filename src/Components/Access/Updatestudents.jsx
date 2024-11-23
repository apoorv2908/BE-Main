import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';


const Updatestudents = () => {
  const { student_id } = useParams();
  const [teacherName, setTeacherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [school, setSchool] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState('');
  const [schools, setSchools] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const apiKey = 'SmNzN3BHZTFvRTlmQW43MG01M0hleThOVFFGVnF6c0RPbEF4cmJIRQ==';

  useEffect(() => {
    fetchTeacherDetails();
    fetchSchools();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (country) {
      fetchStates();
    }
  }, [country]);

  useEffect(() => {
    if (state) {
      fetchCities();
    }
  }, [state]);

  const fetchTeacherDetails = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/user/getstudents.php?student_id=${student_id}`);
      const data = await response.json();
      if (data.success) {
        const student = data.student;
        setTeacherName(student.student_name);
        setEmail(student.email);
        setPassword(student.password);
        setContactNumber(student.contact_no);
        setCountry(student.country);
        setState(student.state);
        setCity(student.city);
        setZipcode(student.zipcode);
        setSchool(student.school_id);
        setProfilePicURL(student.profile_pic);
      } else {
        console.error('Failed to fetch student details');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/addtnl/fetchschools.php`);
      const data = await response.json();
      if (data.success) {
        setSchools(data.schools);
      } else {
        console.error('Failed to fetch schools');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://api.countrystatecity.in/v1/countries', {
        headers: {
          'X-CSCAPI-KEY': apiKey
        }
      });
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${country}/states`, {
        headers: {
          'X-CSCAPI-KEY': apiKey
        }
      });
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${country}/states/${state}/cities`, {
        headers: {
          'X-CSCAPI-KEY': apiKey
        }
      });
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleRemoveProfilePic = () => {
    setProfilePic(null);
    setProfilePicURL('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('student_id', student_id);
    formData.append('teacherName', teacherName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('contactNumber', contactNumber);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('zipcode', zipcode);
    formData.append('school', school);
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/user/updatestudent.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Teacher updated successfully');
        navigate("/");
      } else {
        alert('Failed to update teacher');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating teacher');
    }
  };

  return (
    <div>
      <div className="container-flustudent_id">
        <div className="row">
          {/* Sstudent_idebar */}
          {/* Main content */}
          <div className="col-md-12">
            <div className="container">
              {/* Topbar */}
              <div className="row">
              <p className= 'text-danger'>*For any changes, Rewrite your details and save</p>
              <hr></hr>
              
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label className='fw-bold'>Teacher Name<span className= 'text-danger'></span></label><br />
                    <input
                      className='form-control cursor'
                      placeholder='Enter Teacher Name'
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      
                    /><br />
                    <label className='fw-bold'>Email<span className= 'text-danger'></span></label><br />
                    <input
                      className='form-control  cursor'
                      type='email'
                      placeholder='Enter Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      
                    /><br />
                    <label className='fw-bold'>Contact Number<span className= 'text-danger'></span></label><br />
                    <input
                      className='form-control  cursor'
                      placeholder='Enter Contact Number'
                      value={contactNumber}
                      
                      onChange={(e) => setContactNumber(e.target.value)}
                    /><br />
                    <label className='fw-bold'>School<span className= 'text-danger'></span></label><br />
                    <select
                      className='form-control  cursor'
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    >
                      <option value="">Select School</option>
                      {schools.map((school) => (
                        <option key={school.school_id} value={school.school_id}>{school.school_name}</option>
                      ))}
                    </select><br />
                    <label className='fw-bold'>Country<span className= 'text-danger'></span></label><br />
                    <select
                      className='form-control  cursor'
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.iso2} value={country.iso2}>{country.name}</option>
                      ))}
                    </select><br />
                    <label className='fw-bold'>State<span className= 'text-danger'></span></label><br />
                    <select
                      className='form-control  cursor'
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.iso2} value={state.iso2}>{state.name}</option>
                      ))}
                    </select><br />
                    <label className='fw-bold'>City<span className= 'text-danger'></span></label><br />
                    <select
                      className='form-control  cursor'
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.student_id} value={city.name}>{city.name}</option>
                      ))}
                    </select><br />
                    <label className='fw-bold'>Zip Code</label><br />
                    <input
                      className='form-control  cursor'
                      placeholder='Enter Zip Code'
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                    /><br />
                    <label className='fw-bold'>Profile Picture</label><br />
                    {profilePicURL && (
                      <div className="position-relative">
                        <img  src={`${config.apiBaseUrl}/fullmarks-server/uploads/students/${profilePicURL}`} alt="Profile" className="img-fluid rounded" style={{ maxHeight: '80px' }} />
                        

                        <button
                          type="button"
                          className="btn btn-danger position-absolute"
                          style={{ top: '0', left: '0' }}
                          onClick={handleRemoveProfilePic}
                        >
                          &times;
                        </button>
                      </div>
                    )}
                    {!profilePicURL && (
                      <input
                        className='  cursor'
                        type="file"
                        onChange={(e) => setProfilePic(e.target.files[0])}
                      />
                    )}
                    <br />
                    <div className='d-flex justify-content-end'>
                      <button type="submit" className="btn btn-primary ">Update</button>
                    </div>                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Updatestudents;
