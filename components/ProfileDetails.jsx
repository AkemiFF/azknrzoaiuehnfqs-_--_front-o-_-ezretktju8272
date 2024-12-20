import style from '@/style/pages/users/Profile.module.css';
import { Button } from "primereact/button";



export default function ProfileDetails({ edit, userData, onInputChange, onEditToggle, onSave }) {
  const renderField = (label, value, field) => {
    return (
      <div className={style.detail}>
        <span className={style.label}>{label}</span>
        {edit ? (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onInputChange(field, e.target.value)}
            className={style.inputField}
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  };

  return (
    <div className={style.profil_detail_container}>
      <div className={style.profil_detail}>
        <span className={style.title}>Personal information</span>
        <div className={style.profil}>
          {renderField("First name", userData.first_name, "first_name")}
          {renderField("Last name", userData.last_name, "last_name")}
          {renderField("Email", userData.email, "email")}
          {renderField("Contact", userData.numero_client, "numero_client")}
          {renderField("Address", userData.adresse, "adresse")}
          {renderField("City", userData.city, "city")}
        </div>
      </div>
      <Button
        className={style.edit_button}
        onClick={edit ? onSave : onEditToggle}
        label={edit ? "Save" : "Edit"}
        icon="pi pi-pen-to-square"
      />
    </div>
  );
}

