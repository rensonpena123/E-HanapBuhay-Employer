import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/pageTransition.jsx';
import UserModal from './userModal.jsx';
import AlertModal from '../../components/alertModal.jsx';
import {
  ProfileTopSection,
  SecuritySection,
  BusinessProfileSection,
  DocumentUploadSection,
} from './userSections.jsx';
import { INITIAL_PROFILE, INITIAL_BUSINESS } from './userHelpers.jsx';
import { fetchProfile, saveProfile, saveBusiness, getUserId } from '../../api/profile.js';

const emptyAlert = { isOpen: false, type: 'success', title: '', message: '' };

const Profile = () => {
  const [profile,        setProfile]        = useState(INITIAL_PROFILE);
  const [business,       setBusiness]       = useState(INITIAL_BUSINESS);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loading,        setLoading]        = useState(true);
  const [loadError,      setLoadError]      = useState('');

  // Edit modal state
  const [editModal,   setEditModal]   = useState(false);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError,  setModalError]  = useState('');

  // AlertModal state — for profile save success/error/loading feedback
  const [alert, setAlert] = useState(emptyAlert);

  const userId = getUserId();

  // closeAlert — dismisses AlertModal; on success also re-opens edit modal if needed
  const closeAlert = () => setAlert(emptyAlert);

  // Load profile on mount
  useEffect(() => {
    if (!userId) {
      setLoadError('You must be logged in to view this page.');
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetchProfile(userId);
        if (res.success) {
          const d = res.data;
          setProfile({
            full_name:    d.full_name    || '',
            email:        d.email        || '',
            phone_number: d.phone_number || '',
            location:     d.location     || '',
            avatar_url:   d.avatar_url   || null,
          });
          if (d.business) {
            setBusiness({
              companyName:        d.business.companyName        || '',
              companySize:        d.business.companySize        || '',
              industry:           d.business.industry           || '',
              tinNumber:          d.business.tinNumber          || '',
              permitUrl:          d.business.permitUrl          || '',
              website:            d.business.website            || '',
              headquarters:       d.business.headquarters       || '',
              description:        d.business.description        || '',
              verificationStatus: d.business.verificationStatus || 'pending',
              customIndustry:     '',
            });
          }
        } else {
          setLoadError(res.message || 'Failed to load profile.');
        }
      } catch {
        setLoadError('Network error: could not connect to server.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // Generic updaters
  const updateProfile  = (key, val) => setProfile(prev => ({ ...prev, [key]: val }));
  const updateBusiness = (key, val) => setBusiness(prev => ({ ...prev, [key]: val }));

  // syncLocalStorageUser — merges updated fields into localStorage so header reflects changes immediately
  const syncLocalStorageUser = (updatedFields) => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, ...updatedFields }));
      // Notify header to re-read localStorage within the same tab
      window.dispatchEvent(new Event('profileUpdated'));
    } catch {
      // Non-critical — header will show stale data until next login if this fails
    }
  };

  // handleOpenEditModal — resets error state and opens the edit form
  const handleOpenEditModal = () => {
    setModalError('');
    setEditModal(true);
  };

  // handleSaveProfile — saves profile fields with loading/success/error AlertModal feedback
  const handleSaveProfile = async (updatedFields) => {
    // Close the edit form and show loading alert
    setEditModal(false);
    setModalSaving(true);
    setModalError('');
    setAlert({ isOpen: true, type: 'loading', title: 'Saving changes…', message: '' });

    try {
      const res = await saveProfile(userId, updatedFields);
      if (res.success) {
        const d = res.data;
        const newProfile = {
          full_name:    d.full_name    ?? profile.full_name,
          email:        d.email        ?? profile.email,
          phone_number: d.phone_number ?? profile.phone_number,
          location:     d.location     ?? profile.location,
        };
        setProfile(prev => ({ ...prev, ...newProfile }));
        // Sync name/email into localStorage so header updates immediately
        syncLocalStorageUser({ full_name: newProfile.full_name, email: newProfile.email });
        // Show success alert — onEdit re-opens the form if user wants to keep editing
        setAlert({
          isOpen: true,
          type:    'success',
          title:   'Profile Updated!',
          message: 'Your account and profile details have been saved successfully.',
        });
      } else {
        // Show error alert with the API message; onEdit re-opens form so user can fix and retry
        setAlert({
          isOpen: true,
          type:    'error',
          title:   'Save Failed',
          message: res.message || 'Could not save your profile. Please try again.',
        });
      }
    } catch {
      setAlert({
        isOpen: true,
        type:    'error',
        title:   'Connection Error',
        message: 'Could not reach the server. Please check your connection and try again.',
      });
    } finally {
      setModalSaving(false);
    }
  };

  // handleSaveBusiness — upserts business profile via PUT /api/user/business/:id
  const handleSaveBusiness = async () => {
    const industry = business.industry === 'Other'
      ? (business.customIndustry || 'Other')
      : business.industry;

    return saveBusiness(userId, {
      companyName:  business.companyName,
      companySize:  business.companySize,
      industry:     industry,
      tinNumber:    business.tinNumber,
      website:      business.website,
      headquarters: business.headquarters,
      description:  business.description,
    });
  };

  // Render — loading state
  if (loading) {
    return (
      <PageTransition>
        <div className="p-6 min-h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading profile…</p>
        </div>
      </PageTransition>
    );
  }

  // Render — error state
  if (loadError) {
    return (
      <PageTransition>
        <div className="p-6 min-h-full flex items-center justify-center">
          <p className="text-red-500 text-sm">{loadError}</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-6 min-h-full">

        <h1 className="text-2xl font-bold text-brand-dark mb-6">Profile</h1>

        {/* Row 1: Account & Profile (left) | Business Permit (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-start">
          <ProfileTopSection
            profile={profile}
            onAvatarChange={(url) => {
              updateProfile('avatar_url', url);
              // Sync avatar_url to localStorage so header avatar updates immediately
              syncLocalStorageUser({ avatar_url: url });
            }}
            onEditProfile={handleOpenEditModal}
            userId={userId}
          />
          <DocumentUploadSection
            business={business}
            onChange={updateBusiness}
            userId={userId}
          />
        </div>

        {/* Row 2: Security (left) | Business Profile (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-start">
          <SecuritySection
            sessionTimeout={sessionTimeout}
            onTimeoutChange={setSessionTimeout}
          />
          <BusinessProfileSection
            business={business}
            onChange={updateBusiness}
            onSave={handleSaveBusiness}
          />
        </div>

      </div>

      {/* UserModal — Edit Account & Profile Details
          Edits: users.full_name, users.email, users.phone_number, users.location */}
      <UserModal
        isOpen={editModal}
        currentData={{
          full_name:    profile.full_name,
          email:        profile.email,
          phone_number: profile.phone_number,
          location:     profile.location,
        }}
        onClose={() => !modalSaving && setEditModal(false)}
        onSave={handleSaveProfile}
        saving={modalSaving}
        saveError={modalError}
      />

      {/* AlertModal — profile save feedback: loading, success, or error */}
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
        onEdit={
          alert.type === 'success' || alert.type === 'error'
            ? () => { closeAlert(); handleOpenEditModal(); }
            : undefined
        }
      />

    </PageTransition>
  );
};

export default Profile;