import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';


const Updatepasswordteacher = () => {
  const { student_id } = useParams();
 
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();



  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('student_id', student_id);
   
    formData.append('password', password);

    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/user/updatepasswordstudent.php`, {
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
            <div className="container mt-3">
              {/* Topbar */}
              <div className="row">
              <p className= 'text-danger'>*Enter your new password</p>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                                       <input
                      className='form-control mt-3 cursor'
                      type='password'
                      placeholder='Enter New Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    /><br /><br></br>
                   
                    <div className='d-flex justify-content-end'>
                      <button type="submit" className="btn btn-primary mt-3">Change Password</button>
                    </div>                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Updatepasswordteacher;
