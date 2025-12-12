import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Account.css";

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+789456123",
    location: "tamil nadu,indian",
    bio: "i am a tester 1",
  });

  const [editData, setEditData] = useState({ ...userData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-container">
        <h1 className="page-title">👤 My Account</h1>

        <div className="account-grid">

          {/* LEFT SIDE MAIN AREA */}
          <div className="account-main">

            {/* PROFILE HEADER */}
            <div className="profile-header-card">
              <div className="profile-avatar-section">
                <div className="avatar-circle">
                  <span className="avatar-initials">
                    {userData.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              </div>

              <div className="profile-header-info">
                {!isEditing ? (
                  <>
                    <h2 className="profile-display-name">{userData.name}</h2>
                    <p className="profile-display-email">{userData.email}</p>
                  </>
                ) : (
                  <div className="profile-edit-inputs">
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="edit-name-input"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="edit-email-input"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* PERSONAL INFORMATION */}
            <div className="account-card">
              <h3 className="card-section-title">Personal Information</h3>

              <div className="info-grid">

                <div className="info-field">
                  <label className="info-label">📞 Phone</label>
                  {!isEditing ? (
                    <p className="info-value">{userData.phone}</p>
                  ) : (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      className="edit-field-input"
                    />
                  )}
                </div>

                <div className="info-field">
                  <label className="info-label">📍 Location</label>
                  {!isEditing ? (
                    <p className="info-value">{userData.location}</p>
                  ) : (
                    <input
                      type="text"
                      name="location"
                      value={editData.location}
                      onChange={handleChange}
                      className="edit-field-input"
                    />
                  )}
                </div>

                <div className="info-field info-field-full">
                  <label className="info-label">📝 Bio</label>
                  {!isEditing ? (
                    <p className="info-value">{userData.bio}</p>
                  ) : (
                    <textarea
                      name="bio"
                      value={editData.bio}
                      onChange={handleChange}
                      className="edit-textarea-input"
                      rows="3"
                    />
                  )}
                </div>

              </div>

              <div className="action-buttons-container">
                {!isEditing ? (
                  <button className="account-btn btn-edit" onClick={handleEdit}>
                    ✏ Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="account-btn btn-save" onClick={handleSave}>
                      ✔ Save Changes
                    </button>
                    <button className="account-btn btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE IS NOW EMPTY (REMOVED SUMMARY) */}
          <div className="account-sidebar"></div>

        </div>
      </div>
    </div>
  );
}
