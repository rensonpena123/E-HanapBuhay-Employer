import React, { useState } from 'react';
import PageTransition from '../../components/pageTransition.jsx';
import UserModal from './userModal.jsx';
import {
  ProfileTopSection,
  SecuritySection,
  BusinessProfileSection,
  DocumentUploadSection,
  BusinessDetailsSection,
} from './userSections.jsx';
import { INITIAL_PROFILE, INITIAL_BUSINESS } from './userHelpers.jsx';

const Profile = () => {
  const [profile, setProfile]           = useState(INITIAL_PROFILE);
  const [business, setBusiness]         = useState(INITIAL_BUSINESS);
  const [docs, setDocs]                 = useState({ dti: null, sec: null, mayors: null });
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [editModal, setEditModal]       = useState(false);

  const updateProfile  = (key, val) => setProfile(prev => ({ ...prev, [key]: val }));
  const updateBusiness = (key, val) => setBusiness(prev => ({ ...prev, [key]: val }));
  const handleDocUpload = (key, name) => setDocs(prev => ({ ...prev, [key]: name }));

  return (
    <PageTransition>
      <div className="p-6 min-h-full">

        <h1 className="text-2xl font-bold text-brand-dark mb-6">Profile</h1>

        <ProfileTopSection
          profile={profile}
          onAvatarChange={(val) => updateProfile('avatar', val)}
          onEditUsername={() => setEditModal(true)}
        />

        <SecuritySection
          sessionTimeout={sessionTimeout}
          onTimeoutChange={setSessionTimeout}
        />

        <BusinessProfileSection
          business={business}
          onChange={updateBusiness}
        />

        <DocumentUploadSection
          docs={docs}
          onUpload={handleDocUpload}
        />

        <BusinessDetailsSection
          business={business}
          onChange={updateBusiness}
        />

      </div>

      <UserModal
        isOpen={editModal}
        currentUsername={profile.username}
        onClose={() => setEditModal(false)}
        onSave={(val) => updateProfile('username', val)}
      />

    </PageTransition>
  );
};

export default Profile;