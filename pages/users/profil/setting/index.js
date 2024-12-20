import Head from 'next/head';
import Link from 'next/link';
import { Toast } from 'primereact/toast';
import React, { useContext, useEffect, useRef, useState } from 'react';

import ProfileDetails from '@/components/ProfileDetails';
import ProfileImage from '@/components/ProfileImage';
import ProfileSkeleton from '@/components/ProfileSkeleton';
import UserProfilMenu from '@/components/UserProfilMenu';
import AppTopbar from '@/layouts/AppTopbar';
import LayoutContext from '@/layouts/context/layoutContext';
import style from '@/style/pages/users/Profile.module.css';
import { FetchUser } from '@/util/Cart';
import UrlConfig from '@/util/config';
import { getClientAccess } from '@/util/Cookies';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        username: '',
        adresse: '',
        email: '',
        numero_client: '',
        bio: '',
        city: '',
        profilPic: '',
    });
    const [edit, setEdit] = useState(false);
    const [file, setFile] = useState(null);
    const toast = useRef(null);
    const { setUser } = useContext(LayoutContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await FetchUser();
                setUserData({
                    id: data.id,
                    firstname: data.first_name,
                    lastname: data.last_name,
                    username: data.username,
                    adresse: data.adresse,
                    email: data.email,
                    numero: data.numero_client,
                    bio: data.biographie,
                    city: data.ville,
                    profilPic: `${UrlConfig.apiBaseUrl}${data.profilPic}`,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user info:', error);
                setLoading(false);
                showToast('error', 'Error', 'Failed to fetch user data');
            }
        };
        fetchUserData();
    }, []);



    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (file) => {
        setFile(file);
        setEdit(true);
    };

    const handleEditSubmit = async () => {
        try {
            const token = await getClientAccess();

            const formData = new FormData();
            Object.entries(userData).forEach(([key, value]) => {
                if (key !== 'profilPic') {
                    formData.append(key, value);
                }
            });
            if (file) {
                formData.append('profilPic', file);
            }

            const response = await fetch(`${UrlConfig.apiBaseUrl}/api/accounts/edit-client/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Unknown error');
            }

            const data = await response.json();
            console.log(data);

            setUserData(prev => ({
                ...prev,
                username: data.username,
                profilPic: file ? URL.createObjectURL(file) : prev.profilPic,
            }));
            setUser({
                username: data.username,
                id: data.id,
                userImage: file ? URL.createObjectURL(file) : userData.profilPic,
            });
            setEdit(false);
            showToast('success', 'Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating user profile:', error);
            showToast('error', 'Error', 'Failed to update profile');
        }
    };

    const showToast = (severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 5000 });
    };

    if (loading) {
        return <div className={style.container}>
            <UserProfilMenu active="Setting" />
            <div className={style.profil_container}>
                <Link href={"/users"} className={style.back}><i className="pi pi-arrow-left" /> Back</Link>

                <ProfileSkeleton />
            </div>
        </div>
    }

    return (
        <div className={style.container}>
            <UserProfilMenu active="Setting" />
            <div className={style.profil_container}>
                <Link href="/users" className={style.back}>
                    <i className="pi pi-arrow-left" /> Back
                </Link>
                <ProfileImage
                    username={userData.username}
                    firstname={userData.firstname}
                    accId={userData.id}
                    userProfil={userData.profilPic}
                    onImageUpload={handleImageUpload}
                />
                <div className={style.separateur} />
                <ProfileDetails
                    edit={edit}
                    userData={userData}
                    onInputChange={handleInputChange}
                    onEditToggle={() => setEdit(prev => !prev)}
                    onSave={handleEditSubmit}
                />
            </div>
            <Toast ref={toast} />
        </div>
    );
}

Profile.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>User profile</title>
            </Head>
            <AppTopbar />
            {page}
        </>
    );
};

