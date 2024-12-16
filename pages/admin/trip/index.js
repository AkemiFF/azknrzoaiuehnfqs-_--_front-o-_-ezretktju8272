import Head from "next/head";
import style from '../../../style/pages/admin/accommodation/Accommodation.module.css';
import { Toolbar } from "primereact/toolbar";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { Rating } from "primereact/rating";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import AdminLayoutContext from "@/layouts/context/adminLayoutContext";
import { useRouter } from "next/router";
import { getAccessAdmin } from "@/util/Cookies";
import UrlConfig from "@/util/config";
import { Tag } from "primereact/tag";
import { getCsrfTokenDirect } from "@/util/csrf";

export default function Handcraft() {

    const dt = useRef(null);
    const toast = useRef(null);
    const [filters, setFilters] = useState(null);
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            nom_hebergement: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            min_prix_nuit_chambre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            nombre_etoile_hebergement: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        });
        setGlobalFilter('');
    };
    const router = useRouter();

    const { user, setUser } = useContext(AdminLayoutContext);


    useEffect(() => {
        if (user == null) {
            router.push("/admin/login");
        }
        getAccessAdmin()
            .then((data) => {
                if (!data) {
                    router.push("/admin/login");
                    setUser(null)
                }
            })
    }, [router, setUser, user])

    const [type_accommodation, setType_accommodation] = useState([
        { id: 1, nom_type: "Hotel" },
        { id: 2, nom_type: "Maison" },
        { id: 3, nom_type: "Villa" }
    ])

    const [handcrafts, setHandcrafts] = useState(null);
    const [handcraftSelected, setHandcraftSelected] = useState([]);


    const getAllAccommodation = async () => {
        let accessToken = await getAccessAdmin();

        if (!accessToken) {
            accessToken = getNewAdminAccess();
        }
        fetch(`${UrlConfig.apiBaseUrl}/api/artisanat/list/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setHandcrafts(data);
                console.log(data);
            })
            .catch(error => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Data error: ' + error.message,
                    life: 3000
                });
            })

    };
    const getTypeAccommodation = (id) => {
        return type_accommodation.find(accom => accom.id === id);
    };

    const statusChange = (id) => {
        getCsrfTokenDirect().then((csrf) => {
            getAccessAdmin().then((accessToken) => {
                fetch(`${UrlConfig.apiBaseUrl}/api/artisanat/toggle-autorisation/${id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return res.json();
                    })
                    .then(data => {
                        setHandcrafts(handcrafts.map(acc =>
                            acc.id === id ? { ...acc, active: !acc.active } : acc
                        ));
                        toast.current.show({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'status changed to ' + data.active,
                            life: 3000
                        });
                        return data
                    })
                    .catch(error => {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Error: ' + error.message,
                            life: 3000
                        });
                    });
            })
        })
    }
    //datatable
    const [globalFilter, setGlobalFilter] = useState();

    useEffect(() => {
        getAllAccommodation();
        initFilters();
    }, [])

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const leftToolbarTemplate = (
        <React.Fragment>
            <div className={style.leftToolbar}>
                <Button label="New" icon="pi pi-plus" severity="success" />
                <Button onClick={() => { confirmAllDelete() }} label="Delete" icon="pi pi-trash" severity="danger" disabled={!handcraftSelected || !handcraftSelected.length} />
            </div>
        </React.Fragment>
    );

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (item) => {
        return item.active ? <Tag severity="success" value="Active"></Tag> : <Tag severity="warning" value="Disabled"></Tag>

    }

    const typeBodyTemplate = (item) => {
        return <span>{getTypeAccommodation(item.idTypeAccommodation).nom_type}</span>
    }

    const starBodyTemplate = (item) => {
        return <Rating
            value={item.nombre_etoile_hebergement}
            disabled
            cancel={false}
            pt={{
                onIcon: () => ({
                    style: {
                        "color": "#FFD700"
                    }
                })
            }}
        />
    }

    const actionBodyTemplate = (item) => {
        const statusAcc = item.active;

        return (
            <div className={style.actionBodyTemplate}>
                {(statusAcc ?
                    <Button onClick={() => { statusChange(item.id) }} icon="pi pi-play" rounded outlined severity="success" />
                    :
                    <Button onClick={() => { statusChange(item.id) }} icon="pi pi-pause" rounded outlined severity="danger" />
                )}
                <Button icon="pi pi-eye" rounded outlined severity="help" />
                <Button icon="pi pi-pencil" rounded outlined severity="success" />
                <Button onClick={() => confirmDelete(item)} icon="pi pi-trash" rounded outlined severity="danger" />
            </div>
        )
    }

    const confirmDelete = (item) => {
        confirmDialog({
            message: 'Do you want to delete this handcraft?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => deleteAccommodation(item)
        });
    }

    const confirmAllDelete = () => {
        if (handcraftSelected.length) {
            confirmDialog({
                message: `Do you want to delete this accommodation ${handcraftSelected.length} ?`,
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept: () => deleteAllAccommodation()
            });
        }
    }

    const deleteAllAccommodation = () => {
        let _accommodations = [...handcrafts];
        handcraftSelected.map((item) => {
            _accommodations = _accommodations.filter((val) => val.id !== item.id);
        })
        setHandcrafts(_accommodations);
        toast.current.show({ severity: 'success', summary: 'Success', detail: `Handcraft(${handcraftSelected.length})  deleted`, life: 3000 });
        setHandcraftSelected([]);
    }

    const deleteAccommodation = (item) => {
        let _accommodations = handcrafts.filter((val) => val.id !== item.id);
        setHandcrafts(_accommodations);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Handcraft deleted', life: 3000 });
    }

    const header = (
        <div className={style.header_datatable}>
            <h4 className="m-0">Handcraft</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    )


    return (
        <>
            <Head>
                <title>Handcraft</title>
            </Head>
            <div className={style.container}>
                <Toolbar start={leftToolbarTemplate} end={rightToolbarTemplate} />
                <DataTable
                    ref={dt}
                    value={handcrafts}
                    header={header}
                    globalFilter={globalFilter}
                    filters={filters}
                    selection={handcraftSelected}
                    onSelectionChange={(e) => setHandcraftSelected(e.value)}
                >
                    <Column selectionMode="multiple" exportable={false} />
                    <Column sortable field="id" header="ID" exportable={false} />
                    <Column sortable filter filterPlaceholder="Search by name" field="nom" header="Name" />
                    <Column sortable filter filterPlaceholder="Search by email" field="email" header="Email" />
                    <Column dataType="numeric" filter filterField="telephone" sortable field="telephone" header="Contact" />
                    <Column dataType="numeric" filter filterField="total_produits" sortable field="total_produits" header="Nb Product" />
                    <Column body={imageBodyTemplate} header="Status" />

                    <Column body={actionBodyTemplate} exportable={false} />
                </DataTable>
            </div>
            <Toast ref={toast} />
            <ConfirmDialog />
        </>
    )
}