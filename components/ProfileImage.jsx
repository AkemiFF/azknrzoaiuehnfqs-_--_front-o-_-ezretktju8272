import style from '@/style/pages/users/Profile.module.css';
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";


export default function ProfileImage({ username, firstname, accId, userProfil, onImageUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className={style.profil_image_container}>
      <div className={style.profil_image_wrapper}>
        <Avatar label={firstname[0]} shape="circle" alt="user" className={style.profil_image} image={userProfil || ""} />
        <div className={style.profil_user_info}>
          <span className={style.profil_username}>{username}</span>
          <span className={style.profil_adresse}>
            <span>Account ID :</span>
            <span>#{accId}</span>
          </span>
        </div>
      </div>
      <Button className={style.edit_button} onClick={() => document.getElementById('fileInput').click()}
        label="Upload" icon="pi pi-pen-to-square">
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
    </div>
  );
}
