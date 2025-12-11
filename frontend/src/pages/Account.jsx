import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Account.css";

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate learner and problem solver",
    subscription: "Premium"
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
          <div className="account-main">
            <div className="profile-header-card">
              <div className="profile-avatar-section">
                <div className="avatar-circle">
                  <span className="avatar-initials">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <button className="avatar-upload-btn" title="Upload photo">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </button>
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
                      placeholder="Your Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="edit-email-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="account-card">
              <h3 className="card-section-title">Personal Information</h3>
              
              <div className="info-grid">
                <div className="info-field">
                  <label className="info-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Phone
                  </label>
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
                  <label className="info-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Location
                  </label>
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
                  <label className="info-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Bio
                  </label>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="account-btn btn-save" onClick={handleSave}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Save Changes
                    </button>
                    <button className="account-btn btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="account-sidebar">
            <div className="account-card subscription-card">
              <div className="subscription-header">
                <h3 className="card-section-title">Subscription Plan</h3>
                <span className={`subscription-badge badge-${userData.subscription.toLowerCase()}`}>
                  {userData.subscription}
                </span>
              </div>
              
              <div className="subscription-features">
                {userData.subscription === "Premium" ? (
                  <>
                    <div className="feature-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Unlimited Access</span>
                    </div>
                    <div className="feature-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Priority Support</span>
                    </div>
                    <div className="feature-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Advanced Features</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="feature-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Basic Features</span>
                    </div>
                    <div className="feature-item feature-disabled">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span>Limited Access</span>
                    </div>
                  </>
                )}
              </div>

              <button className="account-btn btn-upgrade">
                {userData.subscription === "Premium" ? "Manage Plan" : "Upgrade to Premium"}
              </button>
            </div>

            <div className="account-card settings-card">
              <h3 className="card-section-title">Quick Settings</h3>
              
              <div className="settings-list">
                <div className="setting-item">
                  <span className="setting-label">Email Notifications</span>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <span className="setting-label">Two-Factor Auth</span>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <span className="setting-label">Marketing Emails</span>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="account-card danger-zone-card">
              <h3 className="card-section-title danger-title">Danger Zone</h3>
              <button className="account-btn btn-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}