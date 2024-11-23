import React, { useState, useEffect } from 'react';

const Profile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/profile`);
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

  return (
    <div>
      <h3>Profile</h3>
      {profileData ? (
        <div>
          <p>Name: {profileData.name}</p>
          <p>Email: {profileData.email}</p>
          {/* Display other profile information here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
