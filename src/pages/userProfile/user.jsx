import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/pageTransition.jsx';
import UserModal from './userModal.jsx';
import {
  ProfileTopSection,
  SecuritySection,
  BusinessProfileSection,
  DocumentUploadSection,
} from './userSections.jsx';
import { INITIAL_PROFILE, INITIAL_BUSINESS } from './userHelpers.jsx';
import { fetchProfile, saveProfile, saveBusiness, getUserId } from '../../api/profile.js';

const Profile = () => {
  const [profile,        setProfile]        = useState(INITIAL_PROFILE);
  const [business,       setBusiness]       = useState(INITIAL_BUSINESS);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loading,        setLoading]        = useState(true);
  const [loadError,      setLoadError]      = useState('');

  // Modal state
  const [editModal,   setEditModal]   = useState(false);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError,  setModalError]  = useState('');

  const userId = getUserId();

  // ── Load profile on mount ──────────────────────────────────────────────────
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

  // ── Generic updaters ───────────────────────────────────────────────────────
  const updateProfile  = (key, val) => setProfile(prev => ({ ...prev, [key]: val }));
  const updateBusiness = (key, val) => setBusiness(prev => ({ ...prev, [key]: val }));

  // ── Open modal — clear any previous error ──────────────────────────────────
  const handleOpenEditModal = () => {
    setModalError('');
    setEditModal(true);
  };

  // ── Save all 4 profile fields via PUT /api/user/profile/:id ───────────────
  // Called by UserModal's onSave with { full_name, email, phone_number, location }
  const handleSaveProfile = async (updatedFields) => {
    setModalSaving(true);
    setModalError('');
    try {
      const res = await saveProfile(userId, updatedFields);
      if (res.success) {
        // Update local state from what the server confirms was saved
        const d = res.data;
        setProfile(prev => ({
          ...prev,
          full_name:    d.full_name    ?? prev.full_name,
          email:        d.email        ?? prev.email,
          phone_number: d.phone_number ?? prev.phone_number,
          location:     d.location     ?? prev.location,
        }));
        setEditModal(false);
      } else {
        // Show API error inside the modal (e.g. "Email already in use")
        setModalError(res.message || 'Failed to save changes.');
      }
    } catch {
      setModalError('Network error: could not connect to server.');
    } finally {
      setModalSaving(false);
    }
  };

  // ── Save business profile via PUT /api/user/business/:id ──────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageTransition>
        <div className="p-6 min-h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading profile…</p>
        </div>
      </PageTransition>
    );
  }

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

        <ProfileTopSection
          profile={profile}
          onAvatarChange={(url) => updateProfile('avatar_url', url)}
          onEditProfile={handleOpenEditModal}
          userId={userId}
        />

        <SecuritySection
          sessionTimeout={sessionTimeout}
          onTimeoutChange={setSessionTimeout}
        />

        <BusinessProfileSection
          business={business}
          onChange={updateBusiness}
          onSave={handleSaveBusiness}
        />

        <DocumentUploadSection
          business={business}
          onChange={updateBusiness}
          userId={userId}
        />

      </div>

      {/* Modal: Edit Account & Profile Details
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

    </PageTransition>
  );
};

export default Profile;